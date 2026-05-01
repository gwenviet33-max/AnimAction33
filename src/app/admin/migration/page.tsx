'use client'

import { useEffect, useState } from 'react'
import { STORE_DEFAULTS, type StoreSection } from '@/lib/defaults'
import { readLegacyLocalStorage } from '@/lib/store'
import { showToast } from '@/lib/utils'

const SECTIONS = Object.keys(STORE_DEFAULTS) as StoreSection[]

type Status = 'idle' | 'pending' | 'ok' | 'skip' | 'error'

type RowState = {
  hasLegacy: boolean
  status: Status
  detail?: string
}

export default function MigrationPage() {
  const [rows, setRows] = useState<Record<string, RowState>>({})
  const [running, setRunning] = useState(false)

  useEffect(() => {
    const initial: Record<string, RowState> = {}
    for (const s of SECTIONS) {
      const legacy = readLegacyLocalStorage(s)
      initial[s] = {
        hasLegacy: legacy !== null,
        status: 'idle',
      }
    }
    setRows(initial)
  }, [])

  const migrateOne = async (section: StoreSection): Promise<RowState> => {
    const legacy = readLegacyLocalStorage(section)
    if (legacy === null) {
      return { hasLegacy: false, status: 'skip', detail: 'rien dans localStorage' }
    }
    try {
      const res = await fetch(`/api/content/${section}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: legacy }),
      })
      if (!res.ok) {
        const j = await res.json().catch(() => ({}))
        return { hasLegacy: true, status: 'error', detail: j.error || `HTTP ${res.status}` }
      }
      return { hasLegacy: true, status: 'ok', detail: 'écrit dans Firestore' }
    } catch (e) {
      return { hasLegacy: true, status: 'error', detail: (e as Error).message }
    }
  }

  const migrateAll = async () => {
    setRunning(true)
    for (const section of SECTIONS) {
      setRows((r) => ({ ...r, [section]: { ...r[section], status: 'pending' } }))
      const next = await migrateOne(section)
      setRows((r) => ({ ...r, [section]: next }))
    }
    setRunning(false)
    showToast('✅ Migration terminée')
  }

  const clearLocalStorage = () => {
    if (!confirm('Supprimer toutes les clés aa_content:* du localStorage de cet appareil ?')) return
    for (const s of SECTIONS) {
      window.localStorage.removeItem(`aa_content:${s}`)
    }
    showToast('🧹 localStorage purgé')
    setRows((r) => {
      const next = { ...r }
      for (const s of SECTIONS) next[s] = { ...next[s], hasLegacy: false }
      return next
    })
  }

  const totalLegacy = Object.values(rows).filter((r) => r.hasLegacy).length

  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-3xl uppercase md:text-4xl">Migration localStorage → Firestore</h1>
      <p className="mt-2 text-aa-ink/70">
        La migration tourne <strong>automatiquement</strong> à chaque connexion admin sur un nouvel appareil :
        si des clés <code>aa_content:*</code> traînent dans le navigateur, elles partent en Firestore au
        chargement de n&apos;importe quelle page admin et sont effacées localement. Cette page reste
        disponible pour <em>vérifier</em> ou <em>relancer manuellement</em> la migration en cas d&apos;échec.
      </p>

      <div className="mt-6 rounded-md border-[3px] border-aa-ink bg-aa-yellow p-5 shadow-pop">
        <p className="font-bold">{totalLegacy} section(s) trouvée(s) dans le localStorage</p>
        <p className="mt-1 text-sm text-aa-ink/80">
          Le reste sera ignoré (déjà géré par les valeurs par défaut ou n&apos;a jamais été modifié sur cet
          appareil).
        </p>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          onClick={migrateAll}
          disabled={running || totalLegacy === 0}
          className="nb-btn nb-btn--red disabled:opacity-50"
        >
          {running ? 'Migration en cours…' : `🚚 Migrer ${totalLegacy} section(s) vers Firestore`}
        </button>
        <button onClick={clearLocalStorage} className="nb-btn">
          🧹 Purger le localStorage
        </button>
      </div>

      <div className="mt-8 overflow-hidden rounded-md border-[3px] border-aa-ink bg-aa-paper shadow-pop">
        <table className="w-full text-left text-sm">
          <thead className="bg-aa-ink text-aa-paper">
            <tr>
              <th className="px-4 py-3">Section</th>
              <th className="px-4 py-3">localStorage</th>
              <th className="px-4 py-3">Statut</th>
              <th className="px-4 py-3">Détail</th>
            </tr>
          </thead>
          <tbody>
            {SECTIONS.map((s) => {
              const r = rows[s]
              const badge =
                r?.status === 'ok'
                  ? { bg: '#22c55e', label: '✓ OK', color: '#fff' }
                  : r?.status === 'pending'
                    ? { bg: '#FFC91F', label: '…', color: '#0F1B3D' }
                    : r?.status === 'error'
                      ? { bg: '#E8252C', label: '✗ erreur', color: '#fff' }
                      : r?.status === 'skip'
                        ? { bg: '#9ca3af', label: 'skipped', color: '#fff' }
                        : { bg: '#fff', label: '—', color: '#0F1B3D' }
              return (
                <tr key={s} className="border-t border-aa-ink/10">
                  <td className="px-4 py-3 font-mono">{s}</td>
                  <td className="px-4 py-3">
                    {r?.hasLegacy ? (
                      <span className="rounded-full border-2 border-aa-ink bg-aa-yellow px-2 py-0.5 text-xs font-bold">
                        présent
                      </span>
                    ) : (
                      <span className="text-aa-ink/40">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className="rounded-full border-2 border-aa-ink px-2 py-0.5 text-xs font-bold"
                      style={{ background: badge.bg, color: badge.color }}
                    >
                      {badge.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-aa-ink/70">{r?.detail || ''}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-6 rounded-md border-[3px] border-aa-ink bg-aa-cream p-5">
        <h3 className="font-display uppercase">💡 Comment procéder</h3>
        <ol className="mt-2 list-decimal pl-5 text-sm text-aa-ink/80 space-y-1">
          <li>Ouvre cette page depuis l&apos;appareil où tu avais fait le plus de modifs admin.</li>
          <li>Vérifie que les sections présentes correspondent à tes données.</li>
          <li>Clique <b>Migrer vers Firestore</b>.</li>
          <li>Une fois OK partout, va sur le site public depuis un autre appareil pour vérifier que tu vois bien tes modifs.</li>
          <li>Tu peux ensuite <b>Purger le localStorage</b> de cet appareil — toutes les futures modifs admin partiront directement en Firestore et seront visibles partout.</li>
        </ol>
      </div>
    </div>
  )
}

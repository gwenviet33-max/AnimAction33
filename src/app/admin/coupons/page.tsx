'use client'

import { useEffect, useState } from 'react'
import { showToast } from '@/lib/utils'

type Coupon = {
  code: string
  amount: number
  minOrder: number
  createdAt: string
  used: boolean
  usedAt: string | null
  usedBy: string | null
  ip: string | null
}

export default function CouponsAdmin() {
  const [list, setList] = useState<Coupon[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'active' | 'used'>('all')

  const load = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/coupons')
      const json = await res.json()
      setList(json.coupons || [])
    } catch {}
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  const toggleUsed = async (c: Coupon) => {
    const res = await fetch('/api/coupons', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: c.code, used: !c.used }),
    })
    if (res.ok) {
      showToast(c.used ? '↺ Réactivé' : '✓ Marqué utilisé')
      load()
    }
  }

  const remove = async (c: Coupon) => {
    if (!confirm(`Supprimer définitivement ${c.code} ?`)) return
    const res = await fetch('/api/coupons', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: c.code }),
    })
    if (res.ok) {
      showToast('🗑 Supprimé')
      load()
    }
  }

  const copy = async (c: Coupon) => {
    await navigator.clipboard.writeText(c.code)
    showToast('📋 Copié')
  }

  const filtered =
    filter === 'all' ? list : filter === 'active' ? list.filter((c) => !c.used) : list.filter((c) => c.used)

  const stats = {
    total: list.length,
    active: list.filter((c) => !c.used).length,
    used: list.filter((c) => c.used).length,
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl uppercase md:text-4xl">Bons de réduction</h1>
          <p className="mt-1 text-aa-ink/70">
            Codes générés via le mini-jeu (victoire parfaite uniquement) — 15€ dès 200€ d'achat.
          </p>
        </div>
        <button onClick={load} className="nb-btn">
          ↻ Actualiser
        </button>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-4">
        <Stat n={stats.total} l="Total émis" bg="#0F1B3D" text="#FFC91F" />
        <Stat n={stats.active} l="Actifs (utilisables)" bg="#1C5FD8" text="#fff" />
        <Stat n={stats.used} l="Déjà utilisés" bg="#E8252C" text="#fff" />
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {(['all', 'active', 'used'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={
              'rounded-full border-[3px] border-aa-ink px-4 py-1.5 text-sm font-bold ' +
              (filter === f ? 'bg-aa-red text-white' : 'bg-white text-aa-ink')
            }
          >
            {f === 'all' ? 'Tous' : f === 'active' ? 'Actifs' : 'Utilisés'}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="mt-6 text-aa-ink/60">Chargement…</p>
      ) : filtered.length === 0 ? (
        <div className="mt-6 rounded-md border-[3px] border-dashed border-aa-ink/40 bg-white p-8 text-center text-aa-ink/60">
          Aucun code dans cette catégorie.
        </div>
      ) : (
        <div className="mt-6 overflow-hidden rounded-md border-[3px] border-aa-ink bg-aa-paper shadow-pop">
          <table className="w-full text-left text-sm">
            <thead className="bg-aa-ink text-aa-paper">
              <tr>
                <th className="px-4 py-3">Code</th>
                <th className="px-4 py-3">Émis le</th>
                <th className="px-4 py-3">Statut</th>
                <th className="px-4 py-3">Utilisé par</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.code} className="border-t border-aa-ink/10">
                  <td className="px-4 py-3">
                    <button onClick={() => copy(c)} className="font-mono font-bold tracking-widest text-aa-blue hover:underline">
                      {c.code}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-aa-ink/70">
                    {new Date(c.createdAt).toLocaleDateString('fr-FR', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        'rounded-full border-2 border-aa-ink px-2 py-0.5 text-xs font-bold ' +
                        (c.used ? 'bg-aa-red text-white' : 'bg-aa-yellow text-aa-ink')
                      }
                    >
                      {c.used ? 'Utilisé' : 'Actif'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-aa-ink/70">
                    {c.used && c.usedBy ? (
                      <>
                        {c.usedBy}
                        <br />
                        <span className="text-xs text-aa-ink/50">
                          {c.usedAt &&
                            new Date(c.usedAt).toLocaleDateString('fr-FR', {
                              day: '2-digit',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                        </span>
                      </>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => toggleUsed(c)}
                        className="rounded-full border-2 border-aa-ink bg-white px-3 py-1 text-xs font-bold hover:bg-aa-yellow"
                      >
                        {c.used ? '↺ Réactiver' : '✓ Marquer utilisé'}
                      </button>
                      <button
                        onClick={() => remove(c)}
                        className="rounded-full border-2 border-aa-ink bg-aa-red px-3 py-1 text-xs font-bold text-white hover:opacity-90"
                      >
                        🗑
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-6 rounded-md border-[3px] border-aa-ink bg-aa-cream p-5">
        <h3 className="font-display uppercase">💡 Comment ça marche</h3>
        <ul className="mt-2 list-disc pl-5 text-sm text-aa-ink/80">
          <li>Le code est généré <b>automatiquement</b> à la victoire parfaite (sans aucune vie perdue) sur le mini-jeu de la home.</li>
          <li>Chaque code est <b>unique et à usage unique</b>.</li>
          <li>Le client le saisit dans le formulaire de contact — <b>vérification automatique</b> côté serveur, puis le code passe en "Utilisé" dès que la demande est envoyée.</li>
          <li>Tu peux aussi marquer un code utilisé / le réactiver / le supprimer manuellement ici.</li>
        </ul>
      </div>
    </div>
  )
}

function Stat({ n, l, bg, text = '#0F1B3D' }: { n: number; l: string; bg: string; text?: string }) {
  return (
    <div className="rounded-md border-[3px] border-aa-ink p-5 shadow-pop" style={{ background: bg, color: text }}>
      <div className="font-display text-3xl">{n}</div>
      <div className="mt-1 text-xs font-bold uppercase tracking-wide opacity-80">{l}</div>
    </div>
  )
}

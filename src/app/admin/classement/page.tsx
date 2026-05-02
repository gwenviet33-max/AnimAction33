'use client'

import { useEffect, useState } from 'react'
import { showToast } from '@/lib/utils'

type Entry = {
  id: string
  name: string
  timeMs: number
  date: string
}

const fmtTime = (ms: number) => {
  const totalSec = ms / 1000
  const m = Math.floor(totalSec / 60)
  const s = totalSec - m * 60
  return m > 0 ? `${m}m${s.toFixed(2).padStart(5, '0')}s` : `${s.toFixed(2)}s`
}

export default function ClassementAdmin() {
  const [list, setList] = useState<Entry[]>([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/leaderboard', { cache: 'no-store' })
      const json = await res.json()
      setList(json.entries || [])
    } catch {}
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  const remove = async (e: Entry) => {
    if (!confirm(`Supprimer "${e.name}" (${fmtTime(e.timeMs)}) du classement ?`)) return
    const res = await fetch('/api/leaderboard', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: e.id }),
    })
    if (res.ok) {
      showToast('🗑 Supprimé')
      load()
    } else {
      showToast('❌ Erreur')
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl uppercase md:text-4xl">Classement du mini-jeu</h1>
          <p className="mt-1 text-aa-ink/70">
            Top 10 des temps les plus rapides. Si un pseudo est inapproprié et a échappé au filtre
            automatique, supprime-le ici.
          </p>
        </div>
        <button onClick={load} className="nb-btn">
          ↻ Actualiser
        </button>
      </div>

      {loading ? (
        <p className="mt-6 text-aa-ink/60">Chargement…</p>
      ) : list.length === 0 ? (
        <div className="mt-6 rounded-md border-[3px] border-dashed border-aa-ink/40 bg-white p-8 text-center text-aa-ink/60">
          Personne dans le classement pour le moment.
        </div>
      ) : (
        <div className="mt-6 overflow-hidden rounded-md border-[3px] border-aa-ink bg-aa-paper shadow-pop">
          <table className="w-full text-left text-sm">
            <thead className="bg-aa-ink text-aa-paper">
              <tr>
                <th className="px-4 py-3">Rang</th>
                <th className="px-4 py-3">Pseudo</th>
                <th className="px-4 py-3">Temps</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {list.map((e, i) => (
                <tr key={e.id} className="border-t border-aa-ink/10">
                  <td className="px-4 py-3 font-display">
                    {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}
                  </td>
                  <td className="px-4 py-3 font-bold">{e.name}</td>
                  <td className="px-4 py-3 font-mono">{fmtTime(e.timeMs)}</td>
                  <td className="px-4 py-3 text-aa-ink/70">
                    {new Date(e.date).toLocaleDateString('fr-FR', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => remove(e)}
                      className="rounded-full border-2 border-aa-ink bg-aa-red px-3 py-1 text-xs font-bold text-white hover:opacity-90"
                    >
                      🗑 Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-6 rounded-md border-[3px] border-aa-ink bg-aa-cream p-5">
        <h3 className="font-display uppercase">💡 Modération automatique</h3>
        <ul className="mt-2 list-disc pl-5 text-sm text-aa-ink/80">
          <li>
            Les pseudos sont filtrés à la source : insultes courantes (FR + EN), tentatives
            d&apos;usurpation (admin, modo, animaction, gwen…) sont bloquées.
          </li>
          <li>
            Le filtre normalise (minuscules, sans accents, sans symboles) avant de comparer — donc{' '}
            <code>P*ut@in</code> ou <code>PUTAIN</code> sont aussi rejetés.
          </li>
          <li>
            Si un pseudo a quand même réussi à passer (ex : insulte non listée), supprime-le ici.
            L&apos;entrée disparaît du top 10 public, et la place suivante remonte.
          </li>
          <li>
            Une IP ne peut avoir qu&apos;<b>une seule entrée</b> dans le classement (la plus rapide).
            Plusieurs joueurs sur le même réseau peuvent jouer, mais seul leur meilleur temps reste.
          </li>
        </ul>
      </div>
    </div>
  )
}

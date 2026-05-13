'use client'

import { useEffect, useState } from 'react'
import { aaStore, STORE_DEFAULTS } from '@/lib/store'
import type { Game } from '@/lib/defaults'
import { showToast } from '@/lib/utils'

const emptyGame = (): Game => ({
  emoji: '🎯',
  cat: 'Nouveau',
  name: 'Nouveau jeu',
  players: 'Tous âges',
})

export default function GamesAdmin() {
  const [games, setGames] = useState<Game[]>(STORE_DEFAULTS.games)

  useEffect(() => {
    aaStore.get('games').then(setGames)
  }, [])

  const update = (next: Game[]) => setGames(next)

  const updateOne = (idx: number, patch: Partial<Game>) => {
    update(games.map((g, i) => (i === idx ? { ...g, ...patch } : g)))
  }

  const remove = (idx: number) => {
    if (!confirm(`Supprimer "${games[idx].name}" ?`)) return
    update(games.filter((_, i) => i !== idx))
  }

  const move = (idx: number, dir: -1 | 1) => {
    const dst = idx + dir
    if (dst < 0 || dst >= games.length) return
    const next = [...games]
    ;[next[idx], next[dst]] = [next[dst], next[idx]]
    update(next)
  }

  const add = () => {
    update([emptyGame(), ...games])
  }

  const save = async () => {
    const ok = await aaStore.flush('games', games)
    showToast(ok ? '💾 Catalogue sauvegardé' : '⚠️ Erreur de sauvegarde')
  }

  const reset = async () => {
    if (!confirm('Réinitialiser le catalogue aux valeurs par défaut ?')) return
    aaStore.reset('games')
    setGames(STORE_DEFAULTS.games)
    showToast('↺ Réinitialisé')
  }

  return (
    <div className="max-w-4xl">
      <h1 className="font-display text-3xl uppercase md:text-4xl">Catalogue de jeux</h1>
      <p className="mt-1 text-aa-ink/70">
        Chaque jeu de la liste apparaît dans le carousel <strong>« +30 jeux »</strong> de la home et
        sur la page <code>/prestations/grands-jeux</code>.
      </p>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-bold text-aa-ink/80">{games.length} jeu(x) dans le catalogue</p>
        <button onClick={add} className="nb-btn nb-btn--blue">
          + Ajouter un jeu
        </button>
      </div>

      <div className="mt-4 space-y-3">
        {games.map((g, i) => (
          <article key={i} className="rounded-md border-[3px] border-aa-ink bg-aa-paper p-4 shadow-pop">
            <div className="grid grid-cols-[60px_1fr_2fr_2fr_auto] items-end gap-2">
              <label className="block">
                <span className="text-[10px] font-bold uppercase">Emoji</span>
                <input
                  type="text"
                  value={g.emoji}
                  onChange={(e) => updateOne(i, { emoji: e.target.value })}
                  maxLength={4}
                  className="mt-1 w-full rounded-md border-2 border-aa-ink bg-white p-2 text-center text-xl"
                />
              </label>
              <label className="block">
                <span className="text-[10px] font-bold uppercase">Catégorie</span>
                <input
                  type="text"
                  value={g.cat}
                  onChange={(e) => updateOne(i, { cat: e.target.value })}
                  placeholder="ex: Immersif"
                  className="mt-1 w-full rounded-md border-2 border-aa-ink bg-white p-2 text-sm"
                />
              </label>
              <label className="block">
                <span className="text-[10px] font-bold uppercase">Nom</span>
                <input
                  type="text"
                  value={g.name}
                  onChange={(e) => updateOne(i, { name: e.target.value })}
                  placeholder="ex: Murder Party"
                  className="mt-1 w-full rounded-md border-2 border-aa-ink bg-white p-2 font-bold"
                />
              </label>
              <label className="block">
                <span className="text-[10px] font-bold uppercase">Joueurs / durée</span>
                <input
                  type="text"
                  value={g.players}
                  onChange={(e) => updateOne(i, { players: e.target.value })}
                  placeholder="ex: 10 à 40 joueurs · 2h"
                  className="mt-1 w-full rounded-md border-2 border-aa-ink bg-white p-2 text-sm"
                />
              </label>
              <div className="flex flex-col gap-1">
                <button
                  onClick={() => move(i, -1)}
                  disabled={i === 0}
                  className="rounded-md border-2 border-aa-ink bg-white px-2 text-xs disabled:opacity-30"
                  aria-label="Monter"
                >
                  ▲
                </button>
                <button
                  onClick={() => move(i, 1)}
                  disabled={i === games.length - 1}
                  className="rounded-md border-2 border-aa-ink bg-white px-2 text-xs disabled:opacity-30"
                  aria-label="Descendre"
                >
                  ▼
                </button>
                <button
                  onClick={() => remove(i)}
                  className="rounded-md border-2 border-aa-ink bg-aa-red px-2 py-0.5 text-xs font-bold text-white"
                  aria-label="Supprimer"
                >
                  ×
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <button onClick={save} className="nb-btn nb-btn--red">
          💾 Enregistrer le catalogue
        </button>
        <button onClick={reset} className="nb-btn">
          ↺ Réinitialiser aux valeurs par défaut
        </button>
      </div>
    </div>
  )
}

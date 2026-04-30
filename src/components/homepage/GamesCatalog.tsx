'use client'

import Link from 'next/link'
import { useStoreSection } from '@/lib/store'

export function GamesCatalog() {
  const games = useStoreSection('games')

  return (
    <section className="bg-aa-yellow py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="text-center">
          <h2 className="font-display uppercase leading-tight" style={{ fontSize: 'clamp(40px, 6vw, 72px)' }}>
            Le <span className="accent-blue">catalogue</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-aa-ink/80">
            +30 jeux immersifs — du classique réinventé à l'expérience signature.
          </p>
        </div>

        <div className="no-scrollbar mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4">
          {games.map((g, i) => (
            <article
              key={i}
              className="min-w-[260px] snap-start rounded-md border-[3px] border-aa-ink bg-aa-paper p-5 shadow-pop"
            >
              <div className="text-4xl">{g.emoji}</div>
              <span className="mt-3 inline-block rounded-full border-2 border-aa-ink bg-aa-blue px-2.5 py-0.5 text-xs font-bold uppercase text-white">
                {g.cat}
              </span>
              <h3 className="mt-3 font-display text-xl uppercase">{g.name}</h3>
              <p className="mt-1 text-sm text-aa-ink/70">{g.players}</p>
            </article>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link href="/prestations/grands-jeux" className="nb-btn nb-btn--blue">
            Voir le catalogue complet
          </Link>
        </div>
      </div>
    </section>
  )
}

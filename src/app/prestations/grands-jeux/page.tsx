import type { Metadata } from 'next'
import Link from 'next/link'
import { getContent } from '@/lib/content-server'

export const metadata: Metadata = {
  title: 'Catalogue grands jeux — +30 animations sur mesure',
  description:
    "Plus de 30 grands jeux dans notre catalogue : Koh-Lanta, Murder Party, Pékin Express, Olympiades, Escape Game, Capture du drapeau…",
}

const CATS = ['Tous', 'Immersif', 'Aventure', 'Exploration', 'Show', 'Compétition', 'Stratégie', 'Adresse', 'Terrain', 'Classique', 'Action']

export default async function GrandsJeuxPage() {
  const games = await getContent('games')

  return (
    <>
      <section className="bg-aa-yellow py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <span className="nb-pill">🎯 +30 jeux uniques</span>
          <h1 className="mt-6 font-display uppercase leading-[0.95]" style={{ fontSize: 'clamp(48px, 8vw, 96px)' }}>
            Le <span className="accent-red">catalogue</span>
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-aa-ink/80">
            Du classique de cours d'école au scénario de TV-reality — adaptable à votre événement, votre âge, votre lieu.
          </p>
        </div>
      </section>

      <section className="bg-white py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <div className="flex flex-wrap gap-2">
            {CATS.map((c) => (
              <span
                key={c}
                className="rounded-full border-[3px] border-aa-ink bg-aa-paper px-3 py-1 font-bold text-aa-ink shadow-pop-sm"
              >
                {c}
              </span>
            ))}
          </div>

          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {games.map((g, i) => (
              <article key={i} className="nb-card p-5">
                <div className="text-4xl">{g.emoji}</div>
                <span className="mt-3 inline-block rounded-full border-2 border-aa-ink bg-aa-blue px-2.5 py-0.5 text-xs font-bold uppercase text-white">
                  {g.cat}
                </span>
                <h2 className="mt-3 font-display text-xl uppercase">{g.name}</h2>
                <p className="mt-1 text-sm text-aa-ink/70">{g.players}</p>
              </article>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link href="/contact" className="nb-btn nb-btn--red">
              Choisir un jeu pour mon événement
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}

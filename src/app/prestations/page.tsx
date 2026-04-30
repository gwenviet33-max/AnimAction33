import type { Metadata } from 'next'
import Link from 'next/link'
import { getContent } from '@/lib/content-server'

export const metadata: Metadata = {
  title: 'Prestations',
  description: "Six terrains de jeu : anniversaires, mariages, EVG, team building, grands jeux, écoles & loisirs.",
}

const PALETTE = ['#FFFDF6', '#E8EFFC', '#FDE3E4', '#FFC91F', '#1C5FD8', '#DAF0DE']
const TEXT_LIGHT = [false, false, false, false, true, false]

export default async function PrestationsIndex() {
  const allPrestations = await getContent('prestations')
  const prestations = allPrestations.filter((p) => p.active)

  return (
    <>
      <section className="bg-aa-cream py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <span className="nb-pill">🎪 Catalogue complet</span>
          <h1 className="mt-6 font-display uppercase leading-[0.95]" style={{ fontSize: 'clamp(48px, 7vw, 88px)' }}>
            Toutes nos <span className="accent-red">prestations</span>
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-aa-ink/70">
            Chaque animation est sur mesure — choisissez votre terrain de jeu.
          </p>
        </div>
      </section>

      <section className="bg-white py-16 md:py-20">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-5 sm:grid-cols-2 lg:grid-cols-3 md:px-8">
          {prestations.map((p, i) => (
            <Link
              key={p.key}
              href={p.href}
              className="block rounded-md border-[3px] border-aa-ink p-6 shadow-pop transition hover:-translate-x-1 hover:-translate-y-1 hover:shadow-pop-lg"
              style={{ background: PALETTE[i % PALETTE.length], color: TEXT_LIGHT[i % PALETTE.length] ? '#fff' : '#0F1B3D' }}
            >
              <div className="text-5xl">{p.emoji}</div>
              <h2 className="mt-4 font-display text-2xl uppercase">{p.title}</h2>
              <p className={'mt-2 ' + (TEXT_LIGHT[i % PALETTE.length] ? 'text-white/90' : 'text-aa-ink/80')}>{p.desc}</p>
              <div className="mt-5 flex items-center justify-between">
                <span className="rounded-full border-[3px] border-aa-ink bg-aa-yellow px-3 py-1 text-sm font-bold text-aa-ink">
                  {p.price}
                </span>
                <span className="grid h-9 w-9 place-items-center rounded-full border-[3px] border-aa-ink bg-aa-paper text-aa-ink">→</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  )
}

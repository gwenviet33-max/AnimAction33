'use client'

import Link from 'next/link'
import { useStoreSection } from '@/lib/store'
import { RevealOnScroll } from '@/components/shared/RevealOnScroll'

const PALETTE = ['#FFFDF6', '#E8EFFC', '#FDE3E4', '#FFC91F', '#1C5FD8', '#DAF0DE']
const TEXT_LIGHT = [false, false, false, false, true, false]

export function PrestationsGrid() {
  const prestations = useStoreSection('prestations')
  const visible = prestations.filter((p) => p.active)

  return (
    <section className="bg-aa-cream py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="text-center">
          <h2 className="font-display uppercase leading-tight" style={{ fontSize: 'clamp(40px, 6vw, 72px)' }}>
            Nos <span className="accent-red">prestations</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-aa-ink/70">
            Six terrains de jeu, une seule mission : des événements inoubliables.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((p, i) => (
            <RevealOnScroll key={p.key} delay={(i % 3) as 0 | 1 | 2}>
              <Link
                href={p.href}
                className="block h-full rounded-md border-[3px] border-aa-ink p-6 shadow-pop transition hover:-translate-x-1 hover:-translate-y-1 hover:shadow-pop-lg"
                style={{
                  background: PALETTE[i % PALETTE.length],
                  color: TEXT_LIGHT[i % PALETTE.length] ? '#fff' : '#0F1B3D',
                }}
              >
                <div className="text-5xl">{p.emoji}</div>
                <h3 className="mt-4 font-display text-2xl uppercase">{p.title}</h3>
                <p className={'mt-2 text-base ' + (TEXT_LIGHT[i % PALETTE.length] ? 'text-white/90' : 'text-aa-ink/80')}>
                  {p.desc}
                </p>
                <div className="mt-6 flex items-center justify-between">
                  <span
                    className="inline-block rounded-full border-[3px] border-aa-ink bg-aa-yellow px-3 py-1 text-sm font-bold text-aa-ink"
                  >
                    {p.price}
                  </span>
                  <span
                    className="grid h-9 w-9 place-items-center rounded-full border-[3px] border-aa-ink bg-aa-paper text-aa-ink"
                    aria-hidden
                  >
                    →
                  </span>
                </div>
              </Link>
            </RevealOnScroll>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link href="/prestations" className="nb-btn nb-btn--blue">
            Voir toutes les prestations →
          </Link>
        </div>
      </div>
    </section>
  )
}

'use client'

import Link from 'next/link'
import { useState } from 'react'

const TYPES = [
  { v: 'anniv', l: '🎂 Anniversaire' },
  { v: 'mariage', l: '💍 Mariage' },
  { v: 'evg', l: '🥂 EVG / EVF' },
  { v: 'team', l: '🏢 Team Building' },
  { v: 'ecole', l: '🏫 École / Loisirs' },
  { v: 'autre', l: '✨ Autre' },
]

export function ContactQuick() {
  const [type, setType] = useState<string>('')

  return (
    <section className="bg-aa-ink py-20 text-aa-paper md:py-28">
      <div className="mx-auto max-w-4xl px-5 md:px-8">
        <h2 className="text-center font-display uppercase leading-tight" style={{ fontSize: 'clamp(36px, 5vw, 60px)' }}>
          Parlons de votre <span className="accent-yellow">événement</span>
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-white/70">
          Quelques infos pour bien démarrer — devis détaillé sous 48h.
        </p>

        <div className="mt-10 rounded-md border-[3px] border-aa-paper bg-aa-paper p-6 text-aa-ink shadow-pop md:p-8">
          <p className="font-bold">Type d'événement</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {TYPES.map((t) => (
              <button
                key={t.v}
                onClick={() => setType(t.v)}
                className={
                  'rounded-full border-[3px] border-aa-ink px-3 py-1.5 font-bold transition ' +
                  (type === t.v ? 'bg-aa-red text-white' : 'bg-white text-aa-ink hover:bg-aa-yellow')
                }
              >
                {t.l}
              </button>
            ))}
          </div>

          <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-2">
            <input
              type="date"
              className="rounded-md border-2 border-aa-ink bg-white p-3 focus:outline-none"
              aria-label="Date"
            />
            <input
              type="email"
              placeholder="votre@email.fr"
              className="rounded-md border-2 border-aa-ink bg-white p-3 focus:outline-none"
              aria-label="Email"
            />
          </div>

          <div className="mt-6 text-center">
            <Link href="/contact" className="nb-btn nb-btn--red">
              Continuer ma demande →
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

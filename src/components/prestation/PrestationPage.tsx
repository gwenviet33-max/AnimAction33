'use client'

import Link from 'next/link'
import type { Formule } from '@/lib/store'

export type PrestationPageProps = {
  emoji: string
  badge: string
  title: string
  titleAccent: string
  baseline: string
  intro: string
  inclus: string[]
  activites: { emoji: string; nom: string }[]
  timeline: { temps: string; titre: string; desc: string }[]
  formules: Formule[]
  options?: string[]
  bgHero?: string
  bgFormules?: string
  ctaColor?: 'red' | 'blue' | 'yellow'
}

export function PrestationPage(props: PrestationPageProps) {
  const heroBg = props.bgHero || 'bg-aa-yellow'
  const formulesBg = props.bgFormules || 'bg-aa-cream'
  const cta = props.ctaColor === 'blue' ? 'nb-btn--blue' : props.ctaColor === 'yellow' ? 'nb-btn--yellow' : 'nb-btn--red'

  return (
    <>
      <section className={`relative overflow-hidden ${heroBg} py-20 md:py-28`}>
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <span className="nb-pill">{props.badge}</span>
          <h1
            className="mt-6 font-display uppercase leading-[0.95]"
            style={{ fontSize: 'clamp(48px, 8vw, 96px)' }}
          >
            {props.title} <span className="accent-red">{props.titleAccent}</span>
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-aa-ink/80 md:text-xl">{props.baseline}</p>
          <div className="mt-8">
            <Link href="/contact" className={`nb-btn ${cta}`}>
              Demander un devis →
            </Link>
          </div>
          <div className="absolute right-6 top-12 hidden text-7xl md:block">{props.emoji}</div>
        </div>
      </section>

      <section className="bg-white py-16 md:py-20">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 md:grid-cols-2 md:px-8">
          <div>
            <h2 className="font-display uppercase text-3xl md:text-4xl">L'expérience</h2>
            <p className="mt-4 text-aa-ink/80">{props.intro}</p>
          </div>
          <div className="rounded-md border-[3px] border-aa-ink bg-aa-cream p-6 shadow-pop">
            <h3 className="font-display uppercase text-xl">Inclus dans la prestation</h3>
            <ul className="mt-4 space-y-2">
              {props.inclus.map((it, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-aa-blue">✓</span>
                  <span>{it}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-aa-cream py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <h2 className="text-center font-display uppercase text-3xl md:text-4xl">
            Activités possibles
          </h2>
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {props.activites.map((a, i) => (
              <div key={i} className="nb-card p-5 text-center">
                <div className="text-4xl">{a.emoji}</div>
                <p className="mt-2 font-bold">{a.nom}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16 md:py-20">
        <div className="mx-auto max-w-4xl px-5 md:px-8">
          <h2 className="text-center font-display uppercase text-3xl md:text-4xl">Le déroulé type</h2>
          <ol className="mt-10 space-y-5">
            {props.timeline.map((t, i) => (
              <li key={i} className="rounded-md border-[3px] border-aa-ink bg-aa-paper p-5 shadow-pop-sm">
                <div className="flex items-center gap-3">
                  <span className="rounded-full border-2 border-aa-ink bg-aa-yellow px-3 py-1 font-display text-sm">
                    {t.temps}
                  </span>
                  <h3 className="font-display text-lg uppercase">{t.titre}</h3>
                </div>
                <p className="mt-2 text-aa-ink/80">{t.desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className={`${formulesBg} py-16 md:py-20`}>
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <h2 className="text-center font-display uppercase text-3xl md:text-4xl">
            Nos <span className="accent-red">formules</span>
          </h2>
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
            {props.formules.map((f, i) => (
              <article
                key={i}
                className={
                  'relative rounded-md border-[3px] border-aa-ink bg-aa-paper p-6 shadow-pop ' +
                  (f.badge === 'Le + choisi' ? 'md:-translate-y-3 bg-aa-yellow' : '')
                }
              >
                {f.badge && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full border-[3px] border-aa-ink bg-aa-red px-3 py-1 font-display text-xs uppercase text-white">
                    {f.badge}
                  </span>
                )}
                <h3 className="font-display text-2xl uppercase">{f.nom}</h3>
                <div className="mt-2 font-display text-4xl">
                  {f.prix !== null ? <>{f.prix}€</> : <>Sur devis</>}
                </div>
                <div className="mt-1 text-sm text-aa-ink/70">
                  {f.duree} · {f.max}
                </div>
                <ul className="mt-5 space-y-2 text-sm">
                  {f.features.map((feat, j) => (
                    <li key={j} className="flex gap-2">
                      <span className="text-aa-blue">✓</span>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/contact" className={`nb-btn ${cta} mt-6 w-full`}>
                  Choisir
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {props.options && props.options.length > 0 && (
        <section className="bg-white py-16">
          <div className="mx-auto max-w-5xl px-5 md:px-8">
            <h2 className="text-center font-display uppercase text-3xl">Options possibles</h2>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              {props.options.map((opt, i) => (
                <span
                  key={i}
                  className="rounded-full border-[3px] border-aa-ink bg-aa-yellow px-3 py-1.5 font-bold text-aa-ink shadow-pop-sm"
                >
                  {opt}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="bg-aa-blue py-16 text-aa-paper md:py-20">
        <div className="mx-auto max-w-3xl px-5 text-center md:px-8">
          <h2 className="font-display uppercase text-3xl md:text-5xl">
            Prêt à <span className="accent-yellow">déchirer</span> ?
          </h2>
          <p className="mt-3 text-white/80">Devis gratuit sous 48h — sans engagement.</p>
          <Link href="/contact" className="nb-btn nb-btn--red mt-6 inline-flex">
            Demander un devis
          </Link>
        </div>
      </section>
    </>
  )
}

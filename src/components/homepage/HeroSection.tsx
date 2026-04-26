'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useStoreSection } from '@/lib/store'

export function HeroSection() {
  const hero = useStoreSection('hero')
  const stats = useStoreSection('stats')

  return (
    <section className="relative min-h-[92vh] overflow-hidden bg-aa-ink text-aa-paper">
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(1200px 600px at 75% 20%, rgba(28,95,216,.25), transparent 60%), radial-gradient(900px 500px at 15% 75%, rgba(232,37,44,.18), transparent 60%)',
        }}
      />
      <div className="dots-bg absolute inset-0 opacity-50" aria-hidden />

      <div className="relative mx-auto grid min-h-[92vh] max-w-7xl grid-cols-1 items-center gap-10 px-5 py-16 md:grid-cols-[1.05fr_0.95fr] md:px-8 md:py-24">
        <div>
          <span className="nb-pill">{hero.pill}</span>
          <h1 className="mt-6 font-display uppercase leading-[0.95]" style={{ fontSize: 'clamp(56px, 8vw, 108px)' }}>
            <span className="block">{hero.title_l1}</span>
            <span className="block">
              {hero.title_l2} <span className="accent-red">{hero.title_l2_accent}</span>
            </span>
          </h1>
          <p className="mt-5 max-w-xl whitespace-pre-line text-lg text-white/70 md:text-xl">
            {hero.sub}
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/contact" className="nb-btn nb-btn--red">
              {hero.cta_primary}
            </Link>
            <Link href="/prestations" className="nb-btn nb-btn--ghost">
              {hero.cta_secondary}
            </Link>
          </div>

          <div className="mt-12 grid max-w-xl grid-cols-3 gap-6">
            {stats.hero.map((s, i) => (
              <div key={i}>
                <div className="font-display text-4xl text-aa-yellow md:text-5xl">
                  {s.value}
                  <span>{s.suffix}</span>
                </div>
                <div className="mt-1 text-sm text-white/70">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative hidden md:block">
          <Image
            src="/mascot-only.png"
            alt="Mascotte AnimAction33"
            width={520}
            height={520}
            priority
            className="mx-auto h-[520px] w-auto animate-float drop-shadow-[0_20px_40px_rgba(0,0,0,0.4)]"
          />
          <div
            className="absolute -right-2 top-[10%] -rotate-12 transform rounded-full border-[3px] border-aa-ink bg-aa-red px-3 py-1.5 font-display text-sm uppercase text-white shadow-pop-sm"
          >
            On arrive !
          </div>
          <div
            className="absolute bottom-[14%] -left-2 rotate-[8deg] transform rounded-full border-[3px] border-aa-ink bg-aa-yellow px-3 py-1.5 font-display text-sm uppercase text-aa-ink shadow-pop-sm"
          >
            ★ Fun garanti
          </div>
          <div className="absolute right-[18%] top-[2%] animate-float text-3xl">⭐</div>
          <div className="absolute left-[6%] top-[40%] animate-float text-3xl" style={{ animationDelay: '1s' }}>
            🎉
          </div>
          <div className="absolute right-[2%] bottom-[2%] animate-float text-3xl" style={{ animationDelay: '2s' }}>
            🏆
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 transform text-aa-yellow">
        <div className="flex flex-col items-center gap-1">
          <span className="font-display text-xs uppercase tracking-widest">Scroll</span>
          <span className="block h-3 w-3 -rotate-45 transform animate-bounce-arrow border-b-2 border-r-2 border-aa-yellow" />
        </div>
      </div>
    </section>
  )
}

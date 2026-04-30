'use client'

import { useStoreSection } from '@/lib/store'
import { aaStore } from '@/lib/store'
import { Star } from 'lucide-react'

export function TestimonialsSection() {
  const testimonials = useStoreSection('testimonials')
  const config = aaStore.DEFAULTS.config
  const visible = testimonials.filter((t) => t.affiche)

  return (
    <section className="bg-aa-cream py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="text-center">
          <h2 className="font-display uppercase leading-tight" style={{ fontSize: 'clamp(36px, 5vw, 60px)' }}>
            Ce que disent <span className="accent-red">nos clients</span>
          </h2>
        </div>

        {visible.length === 0 ? (
          <div className="mx-auto mt-10 max-w-md rounded-md border-[3px] border-dashed border-aa-ink bg-white p-8 text-center">
            <p className="text-aa-ink/70">Soyez le premier à laisser un avis !</p>
            <a
              href={config.googleReviewLink}
              target="_blank"
              rel="noopener noreferrer"
              className="nb-btn nb-btn--red mt-4"
            >
              Laisser un avis Google
            </a>
          </div>
        ) : (
          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            {visible.slice(0, 3).map((t, i) => (
              <article key={i} className="nb-card p-6">
                <div className="flex gap-0.5 text-aa-yellow">
                  {Array.from({ length: t.stars }).map((_, j) => (
                    <Star key={j} size={18} fill="currentColor" stroke="none" />
                  ))}
                </div>
                <p className="mt-3 text-aa-ink/90">“{t.text}”</p>
                <div className="mt-4 text-sm font-bold text-aa-ink/70">
                  {t.prenom || 'Anonyme'} {t.ville && `· ${t.ville}`}
                  {t.activite && (
                    <span className="ml-1 rounded-full border-2 border-aa-ink bg-aa-yellow px-2 py-0.5 text-xs uppercase text-aa-ink">
                      {t.activite}
                    </span>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}

        <div className="mt-10 flex justify-center">
          <a
            href={config.googleReviewLink}
            target="_blank"
            rel="noopener noreferrer"
            className="nb-btn"
            style={{ background: '#34A853', color: '#fff' }}
          >
            ⭐ Laisser un avis sur Google
          </a>
        </div>
      </div>
    </section>
  )
}

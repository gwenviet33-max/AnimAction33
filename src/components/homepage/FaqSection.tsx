'use client'

import { useState } from 'react'
import { useStoreSection } from '@/lib/store'
import { Plus, Minus } from 'lucide-react'

export function FaqSection() {
  const faq = useStoreSection('faq')
  const [open, setOpen] = useState<number | null>(0)

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }

  return (
    <section className="bg-white py-20 md:py-28">
      <div className="mx-auto max-w-3xl px-5 md:px-8">
        <h2 className="text-center font-display uppercase leading-tight" style={{ fontSize: 'clamp(36px, 5vw, 60px)' }}>
          Questions <span className="accent-blue">fréquentes</span>
        </h2>

        <div className="mt-10 space-y-4">
          {faq.map((item, i) => (
            <button
              key={i}
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full rounded-md border-[3px] border-aa-ink bg-aa-paper p-5 text-left shadow-pop transition hover:shadow-pop-lg"
            >
              <div className="flex items-center justify-between gap-4">
                <span className="font-display text-base uppercase md:text-lg">{item.q}</span>
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border-[3px] border-aa-ink bg-aa-yellow text-aa-ink">
                  {open === i ? <Minus size={18} /> : <Plus size={18} />}
                </span>
              </div>
              {open === i && <p className="mt-3 text-aa-ink/80">{item.a}</p>}
            </button>
          ))}
        </div>
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    </section>
  )
}

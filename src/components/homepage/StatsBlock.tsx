'use client'

import { useStoreSection } from '@/lib/store'
import { AnimatedCounter } from '@/components/shared/AnimatedCounter'

export function StatsBlock() {
  const stats = useStoreSection('stats')
  return (
    <section className="bg-aa-blue py-20 text-aa-paper md:py-24">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-5 md:grid-cols-4 md:px-8">
        {stats.block.map((s, i) => (
          <div
            key={i}
            className="rounded-md border-[3px] border-aa-ink bg-aa-paper p-6 text-center text-aa-ink shadow-pop"
          >
            <div className="font-display text-4xl md:text-5xl">
              <AnimatedCounter value={s.value} suffix={s.suffix} />
            </div>
            <div className="mt-2 text-sm font-bold uppercase tracking-wide text-aa-ink/70">
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

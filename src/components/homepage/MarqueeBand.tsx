'use client'

import { useStoreSection } from '@/lib/store'

export function MarqueeBand() {
  const items = useStoreSection('marquee')
  const doubled = [...items, ...items]
  return (
    <section className="overflow-hidden border-y-4 border-aa-yellow bg-aa-ink py-4">
      <div className="flex w-max animate-marquee gap-14 whitespace-nowrap px-6 font-display text-base uppercase text-aa-yellow md:text-lg">
        {doubled.map((item, i) => (
          <span key={i} className="inline-flex items-center gap-3">
            {item}
            <span className="inline-block h-2 w-2 rounded-full bg-aa-yellow" />
          </span>
        ))}
      </div>
    </section>
  )
}

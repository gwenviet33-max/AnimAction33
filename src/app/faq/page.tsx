import type { Metadata } from 'next'
import { FaqSection } from '@/components/homepage/FaqSection'

export const metadata: Metadata = {
  title: 'FAQ — questions fréquentes',
  description: 'Toutes les réponses à vos questions sur les animations AnimAction33.',
}

export default function FaqPage() {
  return (
    <>
      <section className="bg-aa-yellow py-16 md:py-20">
        <div className="mx-auto max-w-5xl px-5 md:px-8">
          <span className="nb-pill">💡 FAQ</span>
          <h1 className="mt-6 font-display uppercase leading-[0.95]" style={{ fontSize: 'clamp(40px, 6vw, 72px)' }}>
            On répond à <span className="accent-red">tout</span>
          </h1>
        </div>
      </section>
      <FaqSection />
    </>
  )
}

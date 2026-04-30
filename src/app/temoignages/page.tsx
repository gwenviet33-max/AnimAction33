import type { Metadata } from 'next'
import { TestimonialsSection } from '@/components/homepage/TestimonialsSection'

export const metadata: Metadata = {
  title: 'Témoignages clients',
  description: 'Avis et retours de clients sur les animations AnimAction33.',
}

export default function TemoignagesPage() {
  return (
    <>
      <section className="bg-aa-cream py-20 md:py-24">
        <div className="mx-auto max-w-5xl px-5 md:px-8">
          <span className="nb-pill">⭐ Vos retours</span>
          <h1 className="mt-6 font-display uppercase leading-[0.95]" style={{ fontSize: 'clamp(44px, 7vw, 80px)' }}>
            Ils nous ont fait <span className="accent-red">confiance</span>
          </h1>
        </div>
      </section>
      <TestimonialsSection />
    </>
  )
}

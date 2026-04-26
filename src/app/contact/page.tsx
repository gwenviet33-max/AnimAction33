import type { Metadata } from 'next'
import { ContactForm } from '@/components/contact/ContactForm'

export const metadata: Metadata = {
  title: 'Contact — devis gratuit sous 48h',
  description: 'Formulaire de contact AnimAction33 : devis détaillé sous 48h, sans engagement. Libourne et Gironde.',
}

export default function ContactPage() {
  return (
    <>
      <section className="bg-aa-yellow py-16 md:py-20">
        <div className="mx-auto max-w-5xl px-5 md:px-8">
          <span className="nb-pill">📋 Devis gratuit sous 48h</span>
          <h1 className="mt-6 font-display uppercase leading-[0.95]" style={{ fontSize: 'clamp(40px, 7vw, 80px)' }}>
            Parlons de votre <span className="accent-red">événement</span>
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-aa-ink/80">
            4 questions, 2 minutes — on revient vers vous avec un devis détaillé.
          </p>
        </div>
      </section>

      <section className="bg-white py-12 md:py-16">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 md:grid-cols-[1.5fr_1fr] md:px-8">
          <ContactForm />

          <aside className="space-y-4">
            <div className="rounded-md border-[3px] border-aa-ink bg-aa-cream p-5 shadow-pop">
              <h3 className="font-display uppercase">📞 Téléphone</h3>
              <a href="tel:+33677243675" className="mt-1 block font-bold text-aa-blue">
                06 77 24 36 75
              </a>
              <p className="mt-1 text-sm text-aa-ink/70">Lun–Dim · 9h–20h</p>
            </div>
            <div className="rounded-md border-[3px] border-aa-ink bg-aa-yellow p-5 shadow-pop">
              <h3 className="font-display uppercase">💬 WhatsApp</h3>
              <a
                href="https://wa.me/33677243675"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 block font-bold text-aa-ink"
              >
                Discutons sur WhatsApp →
              </a>
            </div>
            <div className="rounded-md border-[3px] border-aa-ink bg-aa-paper p-5 shadow-pop">
              <h3 className="font-display uppercase">⏰ Délai</h3>
              <p className="mt-1 text-aa-ink/80">Devis détaillé sous <strong>48h</strong> ouvrées maximum.</p>
            </div>
            <div className="rounded-md border-[3px] border-aa-ink bg-aa-blue p-5 text-aa-paper shadow-pop">
              <h3 className="font-display uppercase">📍 Zone</h3>
              <p className="mt-1">Libourne, Bordeaux, toute la Gironde — jusqu'à 60 km sans frais.</p>
            </div>
          </aside>
        </div>
      </section>
    </>
  )
}

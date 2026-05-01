'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Facebook, Instagram, Youtube } from 'lucide-react'
import { aaStore, useStoreSection } from '@/lib/store'

export function Footer() {
  const config = useStoreSection('config')
  const contact = useStoreSection('contact')
  const prestations = useStoreSection('prestations')
  const visiblePrestations = prestations.filter((p) => p.active)

  return (
    <footer className="bg-aa-ink text-aa-paper">
      <div className="mx-auto max-w-7xl px-5 py-10 md:px-8">
        <div className="rounded-md border-[3px] border-aa-paper bg-aa-yellow p-6 text-aa-ink shadow-pop md:p-10">
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h3 className="font-display text-2xl uppercase md:text-3xl">
                Réservez votre date
              </h3>
              <p className="mt-1 text-aa-ink/80">
                Devis gratuit sous {config.delaiDevis} — sans engagement.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/contact" className="nb-btn nb-btn--red">
                Demander un devis
              </Link>
              <a href="tel:+33677243675" className="nb-btn">
                📞 Appeler
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 md:grid-cols-4 md:px-8">
        <div>
          <Link href="/" className="inline-flex items-center gap-3">
            <Image
              src="/logo-final.png"
              alt={config.siteName}
              width={56}
              height={56}
              className="h-14 w-14 rounded-full border-2 border-aa-paper object-cover"
            />
            <span className="font-display text-xl uppercase">
              <span className="text-aa-yellow">ANIM</span>
              <span className="text-aa-red">ACTION33</span>
            </span>
          </Link>
          <p className="mt-4 max-w-xs text-aa-paper/70">{config.baseline}</p>
          <div className="mt-5 flex gap-3">
            <a
              href={config.instagram}
              aria-label="Instagram"
              className="grid h-10 w-10 place-items-center rounded-full border-2 border-aa-paper text-aa-paper transition hover:bg-aa-yellow hover:text-aa-ink"
            >
              <Instagram size={18} />
            </a>
            <a
              href={config.facebook}
              aria-label="Facebook"
              className="grid h-10 w-10 place-items-center rounded-full border-2 border-aa-paper text-aa-paper transition hover:bg-aa-yellow hover:text-aa-ink"
            >
              <Facebook size={18} />
            </a>
            <a
              href={config.youtube}
              aria-label="YouTube"
              className="grid h-10 w-10 place-items-center rounded-full border-2 border-aa-paper text-aa-paper transition hover:bg-aa-yellow hover:text-aa-ink"
            >
              <Youtube size={18} />
            </a>
          </div>
        </div>

        <div>
          <h4 className="mb-3 font-display uppercase text-aa-yellow">Prestations</h4>
          <ul className="space-y-2 text-aa-paper/80">
            {visiblePrestations.map((p) => (
              <li key={p.key}>
                <Link href={p.href} className="hover:text-aa-yellow">
                  {p.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-3 font-display uppercase text-aa-yellow">Informations</h4>
          <ul className="space-y-2 text-aa-paper/80">
            <li><Link href="/a-propos" className="hover:text-aa-yellow">À propos</Link></li>
            <li><Link href="/galerie" className="hover:text-aa-yellow">Galerie</Link></li>
            <li><Link href="/temoignages" className="hover:text-aa-yellow">Témoignages</Link></li>
            <li><Link href="/faq" className="hover:text-aa-yellow">FAQ</Link></li>
            <li><Link href="/blog" className="hover:text-aa-yellow">Blog</Link></li>
            <li><Link href="/mentions-legales" className="hover:text-aa-yellow">Mentions légales</Link></li>
            <li><Link href="/cgv" className="hover:text-aa-yellow">CGV</Link></li>
            <li><Link href="/politique-confidentialite" className="hover:text-aa-yellow">Confidentialité</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 font-display uppercase text-aa-yellow">Contact</h4>
          <ul className="space-y-2 text-aa-paper/80">
            <li>📍 Libourne & Gironde</li>
            <li><a href="tel:+33677243675" className="hover:text-aa-yellow">📞 06 77 24 36 75</a></li>
            <li><a href={`mailto:${contact.email}`} className="hover:text-aa-yellow">✉️ {contact.email}</a></li>
            <li>🕒 Lun–Dim · 9h–20h</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-aa-paper/15 px-5 py-5 text-center text-sm text-aa-paper/60 md:px-8">
        © {new Date().getFullYear()} {config.siteName} · SIRET {config.siret} · Tous droits réservés
        <div className="mt-1 opacity-20 transition hover:opacity-80">
          🐵 Made with passion (et quelques bananes)
        </div>
      </div>
    </footer>
  )
}

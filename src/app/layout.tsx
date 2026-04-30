import type { Metadata } from 'next'
import './globals.css'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { WhatsAppFloat } from '@/components/layout/WhatsAppFloat'
import { MobileStickyBar } from '@/components/layout/MobileStickyBar'
import { SplashScreen } from '@/components/layout/SplashScreen'
import { EasterEggs } from '@/components/layout/EasterEggs'
import { Bandeau } from '@/components/layout/Bandeau'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://animaction33.netlify.app'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    template: '%s | AnimAction33',
    default: "AnimAction33 — Vivez l'Animation Autrement | Libourne, Gironde",
  },
  description:
    "Animateur événementiel professionnel à Libourne. Anniversaires dès 199€, mariages, EVG, team building, +30 grands jeux. BAFA/BAFD, RC Pro. Devis gratuit sous 48h.",
  keywords: [
    'animateur Libourne',
    'animation anniversaire Gironde',
    'grands jeux Bordeaux',
    'team building Gironde',
    'AnimAction33',
  ],
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: SITE_URL,
    siteName: 'AnimAction33',
    title: "AnimAction33 — Vivez l'Animation Autrement",
    description: 'Animateur événementiel professionnel à Libourne. Devis gratuit sous 48h.',
  },
  alternates: { canonical: SITE_URL },
}

const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'AnimAction33',
  description: 'Animateur événementiel à Libourne',
  telephone: '+33677243675',
  url: SITE_URL,
  email: 'contact@animaction33.fr',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Libourne',
    postalCode: '33500',
    addressCountry: 'FR',
  },
  areaServed: 'Gironde',
  priceRange: '€€',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
      </head>
      <body>
        <SplashScreen />
        <EasterEggs />
        <Bandeau />
        <Header />
        <main>{children}</main>
        <Footer />
        <WhatsAppFloat />
        <MobileStickyBar />
      </body>
    </html>
  )
}

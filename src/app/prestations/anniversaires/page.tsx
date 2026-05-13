import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PrestationPage } from '@/components/prestation/PrestationPage'
import { getContent, isPrestationActive } from '@/lib/content-server'

export const metadata: Metadata = {
  title: 'Anniversaires enfants — animations Libourne dès 199€',
  description:
    "Anniversaires inoubliables pour enfants : Koh-Lanta, chasse au trésor, murder party… 5 à 50 enfants. Animateur BAFA/BAFD à Libourne.",
}

const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  serviceType: 'Animation anniversaire enfant',
  provider: { '@type': 'LocalBusiness', name: 'AnimAction33' },
  areaServed: 'Gironde',
  offers: { '@type': 'Offer', price: '199', priceCurrency: 'EUR' },
}

export default async function AnniversairesPage() {
  if (!(await isPrestationActive('anniversaires'))) notFound()
  const [formules, details] = await Promise.all([
    getContent('formules'),
    getContent('prestationsDetails'),
  ])
  const d = details.anniversaires
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <PrestationPage
        emoji="🎂"
        badge="🎂 Anniversaires"
        title="L'anniversaire qu'ils ne"
        titleAccent="raconteront pas en classe (ils le mimeront)"
        baseline={d.baseline}
        intro={d.intro}
        inclus={d.inclus}
        activites={d.activites}
        timeline={d.timeline}
        formules={formules.anniversaires}
        options={d.options}
        bgHero="bg-aa-yellow"
      />
    </>
  )
}

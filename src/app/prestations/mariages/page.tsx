import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PrestationPage } from '@/components/prestation/PrestationPage'
import { getContent, isPrestationActive } from '@/lib/content-server'

export const metadata: Metadata = {
  title: "Animations mariage Gironde — vin d'honneur, soirée, journée",
  description:
    "Animation mariage à Libourne et en Gironde : vin d'honneur, soirée complète, blind test, karaoké, animation enfants. Devis sous 48h.",
}

export default async function MariagesPage() {
  if (!(await isPrestationActive('mariages'))) notFound()
  const [formules, details] = await Promise.all([
    getContent('formules'),
    getContent('prestationsDetails'),
  ])
  const d = details.mariages
  return (
    <PrestationPage
      emoji="💍"
      badge="💍 Mariages"
      title="Le mariage où tout le monde"
      titleAccent="parle encore"
      baseline={d.baseline}
      intro={d.intro}
      inclus={d.inclus}
      activites={d.activites}
      timeline={d.timeline}
      formules={formules.mariages}
      options={d.options}
      bgHero="bg-aa-cream"
      ctaColor="red"
    />
  )
}

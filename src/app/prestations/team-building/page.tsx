import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PrestationPage } from '@/components/prestation/PrestationPage'
import { getContent, isPrestationActive } from '@/lib/content-server'

export const metadata: Metadata = {
  title: 'Team Building Gironde — olympiades, escape, grands jeux',
  description:
    'Animation team building entreprises : olympiades, escape game, grands jeux. 20 à 100 collaborateurs. Facture entreprise, RC Pro.',
}

export default async function TeamBuildingPage() {
  if (!(await isPrestationActive('team'))) notFound()
  const [formules, details] = await Promise.all([
    getContent('formules'),
    getContent('prestationsDetails'),
  ])
  const d = details.team
  return (
    <PrestationPage
      emoji="🏢"
      badge="🏢 Team Building"
      title="La cohésion qui ne sent pas"
      titleAccent="le séminaire forcé"
      baseline={d.baseline}
      intro={d.intro}
      inclus={d.inclus}
      activites={d.activites}
      timeline={d.timeline}
      formules={formules.teamBuilding}
      options={d.options}
      bgHero="bg-aa-cream"
      ctaColor="blue"
    />
  )
}

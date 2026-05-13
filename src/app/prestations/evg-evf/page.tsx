import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PrestationPage } from '@/components/prestation/PrestationPage'
import { getContent, isPrestationActive } from '@/lib/content-server'

export const metadata: Metadata = {
  title: 'EVG / EVF Bordeaux & Libourne — animations sur mesure',
  description:
    "Enterrements de vie de garçon ou de jeune fille : Koh-Lanta adulte, défis fous, city game, scénarios immersifs. Animation pro à Libourne et en Gironde.",
}

export default async function EvgEvfPage() {
  if (!(await isPrestationActive('evg'))) notFound()
  const [formules, details] = await Promise.all([
    getContent('formules'),
    getContent('prestationsDetails'),
  ])
  const d = details.evg
  return (
    <PrestationPage
      emoji="🥂"
      badge="🥂 EVG / EVF"
      title="L'EVG/EVF dont"
      titleAccent="il/elle parlera 10 ans"
      baseline={d.baseline}
      intro={d.intro}
      inclus={d.inclus}
      activites={d.activites}
      timeline={d.timeline}
      formules={formules.evg}
      options={d.options}
      bgHero="bg-aa-cream"
      ctaColor="red"
    />
  )
}

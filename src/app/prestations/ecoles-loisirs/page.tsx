import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PrestationPage } from '@/components/prestation/PrestationPage'
import { getContent, isPrestationActive } from '@/lib/content-server'

export const metadata: Metadata = {
  title: 'Écoles, ALSH & accueils périscolaires — animation Gironde',
  description:
    'Animation de centres de loisirs, NAP, accueils périscolaires : projets pédagogiques, BAFA/BAFD, RC Pro. Libourne et Gironde.',
}

export default async function EcolesPage() {
  if (!(await isPrestationActive('ecoles'))) notFound()
  const details = await getContent('prestationsDetails')
  const d = details.ecoles
  return (
    <PrestationPage
      emoji="🏫"
      badge="🏫 Écoles & Loisirs"
      title="L'animateur dont l'équipe"
      titleAccent="va devenir fan"
      baseline={d.baseline}
      intro={d.intro}
      inclus={d.inclus}
      activites={d.activites}
      timeline={d.timeline}
      formules={[
        { nom: 'Intervention', prix: 149, duree: '2h', max: '30 enfants', badge: null, features: ['Animation thématique', 'Matériel fourni', 'Rapport synthétique'] },
        { nom: 'Demi-journée', prix: 249, duree: '4h', max: '60 enfants', badge: 'Le + choisi', features: ['Programme complet', 'Pause goûter', 'Rapport pédagogique'] },
        { nom: 'Projet long', prix: null, duree: 'Sur devis', max: 'Illimité', badge: 'Premium', features: ['Cycle pédagogique', 'Plusieurs séances', 'Bilan final', 'Sur mesure'] },
      ]}
      options={d.options}
      bgHero="bg-aa-cream"
      ctaColor="blue"
    />
  )
}

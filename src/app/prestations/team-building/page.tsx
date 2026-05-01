import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PrestationPage } from '@/components/prestation/PrestationPage'
import { getContent, isPrestationActive } from '@/lib/content-server'

export const metadata: Metadata = {
  title: 'Team Building Gironde — olympiades, escape, grands jeux',
  description:
    "Animation team building entreprises : olympiades, escape game, grands jeux. 20 à 100 collaborateurs. Facture entreprise, RC Pro.",
}

export default async function TeamBuildingPage() {
  if (!(await isPrestationActive('team'))) notFound()
  const formules = await getContent('formules')
  return (
    <PrestationPage
      emoji="🏢"
      badge="🏢 Team Building"
      title="La cohésion qui ne sent pas"
      titleAccent="le séminaire forcé"
      baseline="Olympiades, escape game, grands jeux d'entreprise : on cale le tempo, on libère les rires — le management se passe le reste de la semaine."
      intro="Atelier court ou journée séminaire complète : on conçoit un programme aligné sur vos objectifs RH (cohésion, intégration, fun pur) et adapté à la taille du groupe."
      inclus={[
        'Animateur professionnel',
        'Programme ajusté à vos objectifs',
        'Tout le matériel + sono',
        'Rapport animation post-événement',
        'Facture entreprise',
        'Adaptation indoor / outdoor',
      ]}
      activites={[
        { emoji: '🏆', nom: 'Olympiades' },
        { emoji: '🎲', nom: 'Escape Game' },
        { emoji: '🚩', nom: 'Capture du drapeau' },
        { emoji: '🗺️', nom: 'Chasse au trésor' },
        { emoji: '🎤', nom: 'Blind test équipe' },
        { emoji: '💪', nom: 'Défis cohésion' },
        { emoji: '🕵️', nom: 'Murder party' },
        { emoji: '🎯', nom: 'Grands jeux' },
      ]}
      timeline={[
        { temps: 'J-15', titre: 'Cadrage', desc: 'Visio avec le service RH pour fixer objectifs et contraintes.' },
        { temps: 'J', titre: 'Accueil', desc: 'Énergisation rapide, formation des équipes mélangées.' },
        { temps: 'Matinée', titre: 'Défis cohésion', desc: 'Ateliers tournants, première montée d\'adrénaline.' },
        { temps: 'Midi', titre: 'Pause optimisée', desc: 'Format pause café ou déjeuner libre selon votre cadre.' },
        { temps: 'Après-midi', titre: 'Grand jeu final', desc: 'Olympiades / escape — un seul gagnant, des souvenirs partagés.' },
      ]}
      formules={formules.teamBuilding}
      options={['Vidéo souvenir', 'Photographe', 'Trophée gravé', 'T-shirts personnalisés', 'Restauration', 'Salle privatisée']}
      bgHero="bg-aa-cream"
      ctaColor="blue"
    />
  )
}

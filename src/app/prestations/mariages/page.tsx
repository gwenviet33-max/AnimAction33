import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PrestationPage } from '@/components/prestation/PrestationPage'
import { getContent, isPrestationActive } from '@/lib/content-server'

export const metadata: Metadata = {
  title: 'Animations mariage Gironde — vin d\'honneur, soirée, journée',
  description:
    "Animation mariage à Libourne et en Gironde : vin d'honneur, soirée complète, blind test, karaoké, animation enfants. Devis sous 48h.",
}

export default async function MariagesPage() {
  if (!(await isPrestationActive('mariages'))) notFound()
  const formules = await getContent('formules')
  return (
    <PrestationPage
      emoji="💍"
      badge="💍 Mariages"
      title="Le mariage où tout le monde"
      titleAccent="parle encore"
      baseline="Vin d'honneur rythmé, soirée déchaînée ou journée complète : on s'adapte à vos envies, des plus chics aux plus folles."
      intro="Animation enfants pendant que les parents profitent, blind test pour briser la glace, karaoké géant pour libérer les voix : on dose le fun selon l'ambiance que VOUS voulez."
      inclus={[
        'Animateur expérimenté en mariages',
        'Sono + micro fournis',
        'Programme personnalisé selon votre déroulé',
        'Coordination avec votre traiteur / DJ',
        'Repérage du lieu en amont',
        'Plan B en cas de pluie',
      ]}
      activites={[
        { emoji: '🎤', nom: 'Karaoké' },
        { emoji: '🎵', nom: 'Blind Test' },
        { emoji: '💃', nom: 'Animation danse' },
        { emoji: '🎲', nom: 'Quiz mariés' },
        { emoji: '🎪', nom: 'Animation enfants' },
        { emoji: '🏆', nom: 'Olympiades adultes' },
        { emoji: '🎁', nom: 'Surprise mariés' },
        { emoji: '📸', nom: 'Photobooth' },
      ]}
      timeline={[
        { temps: 'J-30', titre: 'Visio de prépa', desc: 'On cale le déroulé avec les mariés.' },
        { temps: 'Vin d\'honneur', titre: 'Mise en route', desc: 'Animation enfants, jeu adultes léger, ambiance.' },
        { temps: 'Repas', titre: 'Pause maîtrisée', desc: 'Quiz mariés entre les plats, anecdotes drôles.' },
        { temps: 'Soirée', titre: 'Le feu', desc: 'Blind test, karaoké, animations lancées au bon moment.' },
        { temps: 'Fin', titre: 'Cérémonie minuit', desc: 'Surprise des mariés ou fin en beauté.' },
      ]}
      formules={formules.mariages}
      options={['Animation enfants 2h', 'Photobooth', 'DJ partenaire', 'Cérémonie minuit', 'Surprise vidéo', 'Décoration']}
      bgHero="bg-aa-cream"
      ctaColor="red"
    />
  )
}

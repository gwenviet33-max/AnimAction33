import type { Metadata } from 'next'
import { PrestationPage } from '@/components/prestation/PrestationPage'

export const metadata: Metadata = {
  title: 'Écoles, ALSH & accueils périscolaires — animation Gironde',
  description:
    "Animation de centres de loisirs, NAP, accueils périscolaires : projets pédagogiques, BAFA/BAFD, RC Pro. Libourne et Gironde.",
}

export default function EcolesPage() {
  return (
    <PrestationPage
      emoji="🏫"
      badge="🏫 Écoles & Loisirs"
      title="L'animateur dont l'équipe"
      titleAccent="va devenir fan"
      baseline="Centres de loisirs, NAP, accueils périscolaires : interventions ponctuelles ou projets longs, pour soulager vos équipes ou réenchanter une thématique."
      intro="BAFD complet, expérience en direction d'ALSH, projets pédagogiques cousus main pour la tranche 3-12 ans. Vos équipes restent maîtres de la pédagogie — on apporte l'expertise grands jeux."
      inclus={[
        'Animateur diplômé BAFA/BAFD',
        'Projet pédagogique sur mesure',
        'Tout le matériel pédagogique',
        'Rapport d\'activité post-intervention',
        'Coordination avec votre direction',
        'Facture mairie / association',
      ]}
      activites={[
        { emoji: '🎨', nom: 'Ateliers créatifs' },
        { emoji: '🏃', nom: 'Grands jeux' },
        { emoji: '🗺️', nom: 'Chasse au trésor' },
        { emoji: '🎭', nom: 'Atelier théâtre' },
        { emoji: '🎵', nom: 'Atelier musique' },
        { emoji: '🌳', nom: 'Sorties nature' },
        { emoji: '🥋', nom: 'Initiation Viet Vo Dao' },
        { emoji: '📚', nom: 'Veillées contées' },
      ]}
      timeline={[
        { temps: 'Pré', titre: 'Réunion de cadrage', desc: 'Avec la direction : objectifs, public, contraintes.' },
        { temps: 'J-7', titre: 'Validation du projet', desc: 'Programme final + matériel listé.' },
        { temps: 'Jour J', titre: 'Animation', desc: 'Intervention de 1h à journée complète.' },
        { temps: 'Post', titre: 'Bilan', desc: 'Rapport pédagogique + photos pour la commune.' },
      ]}
      formules={[
        { nom: 'Intervention', prix: 149, duree: '2h', max: '30 enfants', badge: null, features: ['Animation thématique', 'Matériel fourni', 'Rapport synthétique'] },
        { nom: 'Demi-journée', prix: 249, duree: '4h', max: '60 enfants', badge: 'Le + choisi', features: ['Programme complet', 'Pause goûter', 'Rapport pédagogique'] },
        { nom: 'Projet long', prix: null, duree: 'Sur devis', max: 'Illimité', badge: 'Premium', features: ['Cycle pédagogique', 'Plusieurs séances', 'Bilan final', 'Sur mesure'] },
      ]}
      options={['Mallette pédagogique', 'Costume thème', 'Vidéo bilan', 'Sortie extérieure']}
      bgHero="bg-aa-cream"
      ctaColor="blue"
    />
  )
}

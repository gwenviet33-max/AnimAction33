import type { Metadata } from 'next'
import { PrestationPage } from '@/components/prestation/PrestationPage'
import { STORE_DEFAULTS } from '@/lib/defaults'

export const metadata: Metadata = {
  title: 'EVG / EVF Bordeaux & Libourne — animations sur mesure',
  description:
    "Enterrements de vie de garçon ou de jeune fille : Koh-Lanta adulte, défis fous, city game, scénarios immersifs. Animation pro à Libourne et en Gironde.",
}

export default function EvgEvfPage() {
  return (
    <PrestationPage
      emoji="🥂"
      badge="🥂 EVG / EVF"
      title="L'EVG/EVF dont"
      titleAccent="il/elle parlera 10 ans"
      baseline="Défis physiques, jeux décalés, scénarios immersifs : on prend en main 2 à 8 heures de votre journée pour souder le groupe et marquer le futur(e) marié(e) à vie."
      intro="Vous arrivez. On a tout préparé. Le futur(e) marié(e) ne sait rien, le groupe est lancé, l'ambiance monte. On reste pro — vous restez fun."
      inclus={[
        'Animateur expérimenté EVG/EVF',
        'Scénario adapté au groupe',
        'Tout le matériel et accessoires',
        'Costumes / déguisements selon thème',
        'Coordination avec votre planning',
        'Photos du groupe',
      ]}
      activites={[
        { emoji: '🏝️', nom: 'Koh-Lanta adulte' },
        { emoji: '🎭', nom: 'Murder party' },
        { emoji: '🚶', nom: 'City game' },
        { emoji: '🏝️', nom: 'Pékin Express urbain' },
        { emoji: '💪', nom: 'Parcours du combattant' },
        { emoji: '🎯', nom: 'Défis fous' },
        { emoji: '❓', nom: 'Quiz futur(e) marié(e)' },
        { emoji: '🕵️', nom: 'Missions secrètes' },
      ]}
      timeline={[
        { temps: 'Pré', titre: 'Brief organisateur', desc: 'On cale le scénario en visio avec l\'organisateur(trice).' },
        { temps: 'H', titre: 'Arrivée surprise', desc: 'Briefing surprise du futur(e) marié(e), missions distribuées.' },
        { temps: 'H+1h', titre: 'Défis & énigmes', desc: 'Enchaînement d\'épreuves rapides, montée en intensité.' },
        { temps: 'H+2h', titre: 'Scénario immersif', desc: 'Pic de l\'expérience : grand jeu signature.' },
        { temps: 'Fin', titre: 'Diplôme + photo', desc: 'Remise du "diplôme de futur(e) marié(e)", photo souvenir.' },
      ]}
      formules={STORE_DEFAULTS.formules.evg}
      options={['Costumes / déguisements', 'Vidéaste', 'Repas inclus', 'Hébergement (sur devis)', 'Transport groupe', 'Surprise personnalisée']}
      bgHero="bg-aa-cream"
      ctaColor="red"
    />
  )
}

import type { Metadata } from 'next'
import { PrestationPage } from '@/components/prestation/PrestationPage'
import { getContent } from '@/lib/content-server'

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
  const formules = await getContent('formules')
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
        baseline="Koh-Lanta version cours d'école, chasse au trésor sur mesure, murder party junior — on transforme votre maison ou votre jardin en terrain d'aventure."
        intro="Un animateur professionnel, des scénarios cousus main pour l'âge des enfants, du matériel pro fourni — vous n'avez qu'à profiter de la journée. Photos, diplômes souvenir, surprise finale : c'est nous qui gérons."
        inclus={[
          '1 animateur diplômé BAFA/BAFD',
          'Scénario sur mesure selon l\'âge',
          'Tout le matériel (déguisements, accessoires, sono)',
          'Diplôme + souvenir pour chaque enfant',
          'Photos de la journée',
          'Devis détaillé sous 48h',
        ]}
        activites={[
          { emoji: '🏝️', nom: 'Koh-Lanta' },
          { emoji: '🗺️', nom: 'Chasse au trésor' },
          { emoji: '🎭', nom: 'Murder Party junior' },
          { emoji: '🎯', nom: 'Olympiades' },
          { emoji: '🕵️', nom: 'Enquête mystère' },
          { emoji: '🎨', nom: 'Atelier créatif' },
          { emoji: '🎤', nom: 'Karaoké kids' },
          { emoji: '🦸', nom: 'Aventure héros' },
        ]}
        timeline={[
          { temps: 'J-7', titre: 'Préparation', desc: 'On finalise le thème, les surprises et le matériel.' },
          { temps: 'H', titre: 'Arrivée des enfants', desc: 'Accueil costumé, présentation des règles, mise en équipes.' },
          { temps: 'H+30', titre: 'Le grand jeu', desc: 'Ateliers, défis, énigmes, fous rires garantis.' },
          { temps: 'H+1h45', titre: 'Goûter & cadeaux', desc: 'Pause goûter, remise des diplômes, photo de groupe.' },
          { temps: 'H+2h', titre: 'Retour des parents', desc: 'Enfants épuisés, parents ravis. Mission accomplie.' },
        ]}
        formules={formules.anniversaires}
        options={['Décoration thématique', 'Goûter inclus', 'Vidéo souvenir', 'Animateur n°2', 'Sono + micro', 'Costumes adultes']}
        bgHero="bg-aa-yellow"
      />
    </>
  )
}

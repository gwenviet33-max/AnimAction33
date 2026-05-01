export type Stat = { value: string; suffix: string; label: string }
export type Prestation = {
  key: string
  emoji: string
  title: string
  desc: string
  price: string
  href: string
  active: boolean
}
export type Game = { emoji: string; cat: string; name: string; players: string }
export type Testimonial = {
  stars: number
  text: string
  prenom: string
  ville: string
  activite: string
  affiche: boolean
}
export type FaqItem = { q: string; a: string }
export type ContactType = { value: string; label: string }
export type Formule = {
  nom: string
  prix: number | null
  duree: string
  max: string
  badge: string | null
  features: string[]
}

export const STORE_DEFAULTS = {
  stats: {
    hero: [
      { value: '500', suffix: '+', label: 'Événements' },
      { value: '30', suffix: '+', label: 'Jeux' },
      { value: '7j/7', suffix: '', label: 'Disponible' },
    ] as Stat[],
    block: [
      { value: '500', suffix: '+', label: 'Événements animés' },
      { value: '10', suffix: '', label: "Ans d'expérience" },
      { value: '30', suffix: '+', label: 'Jeux au catalogue' },
      { value: 'Des dizaines', suffix: '', label: 'Familles satisfaites' },
    ] as Stat[],
  },
  hero: {
    pill: '🎪 Animation événementielle • Gironde',
    title_l1: 'Des anims',
    title_l2: 'qui',
    title_l2_accent: 'déchirent',
    sub: "Anniversaires, mariages, EVG, koh-lanta…\nOn s'occupe de tout — vous profitez.",
    cta_primary: 'Réserver ma date',
    cta_secondary: 'Voir les prestations →',
  },
  marquee: [
    '🎓 BAFA + BAFD',
    '🥋 Professeur de Viet Vo Dao',
    "🎪 10 ans d'animation",
    '⭐ Animateur multi-diplômé',
    '🎯 +30 jeux uniques',
    '🛡️ Moniteur professionnel & Instructeur fédéral',
    '✅ PSE1 / PSE2 / PSC1',
    '📍 Libourne & Gironde',
  ],
  prestations: [
    {
      key: 'anniversaires',
      emoji: '🎂',
      title: 'Anniversaires',
      desc: 'Koh-Lanta, chasse au trésor, murder party… pour 5 à 50 enfants.',
      price: 'Dès 199€',
      href: '/prestations/anniversaires',
      active: true,
    },
    {
      key: 'mariages',
      emoji: '💍',
      title: 'Mariages',
      desc: "Animations discrètes ou déchaînées — on s'adapte à l'ambiance.",
      price: 'Dès 349€',
      href: '/prestations/mariages',
      active: true,
    },
    {
      key: 'evg',
      emoji: '🥂',
      title: 'EVG / EVF',
      desc: "Challenges, défis, rires — la soirée qu'ils n'oublieront pas.",
      price: 'Dès 249€',
      href: '/prestations/evg-evf',
      active: true,
    },
    {
      key: 'team',
      emoji: '🏢',
      title: 'Team Building',
      desc: "Cohésion d'équipe, olympiades, grands jeux d'entreprise.",
      price: 'Dès 399€',
      href: '/prestations/team-building',
      active: true,
    },
    {
      key: 'grands-jeux',
      emoji: '🎯',
      title: 'Grands Jeux',
      desc: '+30 jeux dans notre catalogue — du classique à l’original.',
      price: '+30 jeux',
      href: '/prestations/grands-jeux',
      active: true,
    },
    {
      key: 'ecoles',
      emoji: '🏫',
      title: 'Écoles & Loisirs',
      desc: 'Centres de loisirs, NAP, accueils périscolaires.',
      price: 'BAFA/BAFD',
      href: '/prestations/ecoles-loisirs',
      active: true,
    },
  ] as Prestation[],
  games: [
    { emoji: '🎭', cat: 'Immersif', name: 'Murder Party', players: '10 à 40 joueurs · 2h' },
    { emoji: '🏝️', cat: 'Aventure', name: 'Koh-Lanta', players: '8 à 50 joueurs · 3h' },
    { emoji: '🗺️', cat: 'Exploration', name: 'Chasse au trésor', players: '6 à 40 joueurs · 1h30' },
    { emoji: '🎤', cat: 'Show', name: 'Karaoké géant', players: '10+ · libre' },
    { emoji: '🏆', cat: 'Compétition', name: 'Olympiades', players: '10 à 100 · 2h' },
    { emoji: '🎲', cat: 'Stratégie', name: 'Escape Game', players: '4 à 12 · 1h' },
    { emoji: '🎯', cat: 'Adresse', name: 'Défis fous', players: 'Tous âges' },
    { emoji: '🚩', cat: 'Terrain', name: 'Capture Drapeau', players: '10 à 60 · 1h30' },
    { emoji: '🕵️', cat: 'Immersif', name: 'Killer', players: '10 à 50 · 2h' },
    { emoji: '🐔', cat: 'Classique', name: 'Poule Renard Vipère', players: '20 à 100 · 45min' },
    { emoji: '🏃', cat: 'Action', name: 'Fugitif', players: '15 à 80 · 1h' },
    { emoji: '🏝️', cat: 'Aventure', name: 'Pékin Express', players: '8 à 40 · 3h' },
  ] as Game[],
  testimonials: [
    {
      stars: 5,
      text: "Votre témoignage pourrait s'afficher ici…",
      prenom: '',
      ville: '',
      activite: '',
      affiche: true,
    },
  ] as Testimonial[],
  faq: [
    {
      q: 'Vous vous déplacez dans toute la Gironde ?',
      a: 'Oui — Libourne et toute la Gironde (jusqu’à 60 km sans frais supplémentaires).',
    },
    {
      q: 'Vous avez les assurances nécessaires ?',
      a: 'RC Pro + BAFA + BAFD + PSC1 + PSE1 + PSE2 — tout est en règle.',
    },
    {
      q: 'On peut adapter une animation à notre thème ?',
      a: 'Absolument ! Chaque animation est personnalisée selon votre événement.',
    },
    {
      q: "Combien de temps à l'avance faut-il réserver ?",
      a: 'Idéalement 4 à 6 semaines — surtout en haute saison (été, vacances).',
    },
    {
      q: 'Comment se passe le devis ?',
      a: 'Vous remplissez le formulaire, on discute 10 min au téléphone, devis sous 48h.',
    },
    {
      q: 'Vous gérez aussi le matériel ?',
      a: 'Oui — sono, micros, costumes, accessoires, décors. Tout est fourni.',
    },
  ] as FaqItem[],
  contact: {
    phone: '06 77 24 36 75',
    phone_raw: '0677243675',
    email: 'contact@animaction33.fr',
    zone: 'Libourne & Gironde',
    whatsapp: '33677243675',
  },
  contactTypes: [
    { value: 'anniv', label: '🎂 Anniversaire' },
    { value: 'mariage', label: '💍 Mariage' },
    { value: 'evg', label: '🥂 EVG / EVF' },
    { value: 'team', label: '🏢 Team Building' },
    { value: 'ecole', label: '🏫 École / Loisirs' },
    { value: 'autre', label: '✨ Autre' },
  ] as ContactType[],
  bandeau: {
    actif: true,
    texte: '🔥 Les dates d’été se remplissent vite — Réservez maintenant !',
    lien: '/contact',
  },
  config: {
    siteName: 'AnimAction33',
    baseline: "Vivez l'animation autrement",
    siret: '99048354700016',
    delaiDevis: '48h',
    googleReviewLink: 'https://g.page/r/animaction33/review',
    googleMapsLink: 'https://maps.google.com/?q=AnimAction33+Libourne',
    instagram: 'https://instagram.com/animaction33',
    facebook: 'https://facebook.com/animaction33',
    youtube: 'https://youtube.com/@animaction33',
    tiktok: 'https://tiktok.com/@animaction33',
  },
  formules: {
    anniversaires: [
      {
        nom: 'Découverte',
        prix: 199,
        duree: '2h',
        max: '10 enfants',
        badge: null,
        features: ['1 animateur diplômé', 'Matériel fourni', 'Scénario personnalisé', 'Diplôme souvenir'],
      },
      {
        nom: 'Aventure',
        prix: 269,
        duree: '3h',
        max: '15 enfants',
        badge: 'Le + choisi',
        features: ['Tout Découverte', 'Scénario premium', 'Photo de groupe', 'Surprise finale'],
      },
      {
        nom: 'Épique',
        prix: null,
        duree: 'Sur mesure',
        max: 'Illimité',
        badge: 'Premium',
        features: ['2 animateurs', 'Durée sur mesure', 'Tout inclus', 'Création sur mesure'],
      },
    ] as Formule[],
    mariages: [
      {
        nom: "Vin d'honneur",
        prix: 349,
        duree: '2h',
        max: 'Tous âges',
        badge: null,
        features: ['Animation enfants', '1 jeu adultes', 'Quiz mariés', 'Matériel fourni'],
      },
      {
        nom: 'Soirée complète',
        prix: 549,
        duree: '4h',
        max: 'Tous âges',
        badge: 'Le + choisi',
        features: ["Tout vin d'honneur", 'Blind test', 'Karaoké', 'Jeux ambiance'],
      },
      {
        nom: 'Journée entière',
        prix: null,
        duree: 'Sur devis',
        max: 'Illimité',
        badge: 'Premium',
        features: ['Cérémonie à minuit', 'Animation complète', 'DJ partenaire', 'Tout inclus'],
      },
    ] as Formule[],
    evg: [
      {
        nom: 'Fun',
        prix: 249,
        duree: '2h',
        max: '15 pers',
        badge: null,
        features: ['Défis physiques', 'Jeux décalés', 'Animation micro', 'Matériel fourni'],
      },
      {
        nom: 'Légendaire',
        prix: 399,
        duree: '3h',
        max: '25 pers',
        badge: 'Le + choisi',
        features: ['Koh-Lanta adulte', 'Scénario premium', 'Quiz futur(e) marié(e)', 'Missions secrètes'],
      },
      {
        nom: 'Épique',
        prix: null,
        duree: 'Journée',
        max: 'Illimité',
        badge: 'Premium',
        features: ['City game', 'Pékin Express urbain', 'Parcours du combattant', 'Tout inclus'],
      },
    ] as Formule[],
    teamBuilding: [
      {
        nom: 'Atelier',
        prix: 399,
        duree: '2h',
        max: '20 pers',
        badge: null,
        features: ['1 jeu au choix', 'Animation pro', 'Matériel fourni', 'Facture entreprise'],
      },
      {
        nom: 'Demi-journée',
        prix: 699,
        duree: '4h',
        max: '40 pers',
        badge: 'Le + choisi',
        features: ['Programme complet', 'Pause café', 'Rapport animation', 'Facture entreprise'],
      },
      {
        nom: 'Journée',
        prix: null,
        duree: 'Sur devis',
        max: 'Illimité',
        badge: 'Premium',
        features: ['Séminaire complet', 'Plusieurs activités', 'Coordination totale', 'Sur mesure'],
      },
    ] as Formule[],
  },
}

export type StoreSection = keyof typeof STORE_DEFAULTS

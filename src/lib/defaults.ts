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
export type BlogPost = {
  slug: string
  title: string
  intro: string
  body: string
  published: boolean
  date: string
}
export type Activity = { emoji: string; nom: string }
export type TimelineStep = { temps: string; titre: string; desc: string }
export type PrestationDetail = {
  baseline: string
  intro: string
  inclus: string[]
  activites: Activity[]
  timeline: TimelineStep[]
  options: string[]
}
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
    schedule: '24h/24, 7j/7 selon vos besoins',
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
  blog: {
    enabled: false,
    posts: [
      {
        slug: 'organiser-anniversaire-koh-lanta',
        title: 'Comment organiser un anniversaire Koh-Lanta',
        intro:
          "Le pas-à-pas pour transformer un jardin (ou un parc public) en arène d'aventure.",
        body: [
          "Choisir un thème accrocheur (jungle, île déserte, pirates) et adapter au nombre d'enfants.",
          'Préparer 4 à 6 ateliers tournants : adresse, équilibre, énigme, mémoire.',
          'Constituer 2 à 4 équipes équilibrées pour favoriser la coopération.',
          'Prévoir un final fort : poteaux, totem, photo de groupe.',
        ].join('\n\n'),
        published: false,
        date: '2026-01-01T00:00:00Z',
      },
      {
        slug: 'evg-evf-libourne-bordeaux',
        title: 'EVG / EVF à Libourne et Bordeaux : 5 idées',
        intro:
          "Au-delà du karting et de la dégustation, des animations qui marquent vraiment.",
        body: [
          'Koh-Lanta adulte au bord du lac.',
          'City game urbain à Saint-Émilion ou Bordeaux centre.',
          'Murder party privatisée dans un château.',
          'Pékin Express version vignoble.',
          'Soirée enquête + dîner mystère.',
        ].join('\n\n'),
        published: false,
        date: '2026-01-01T00:00:00Z',
      },
      {
        slug: 'team-building-petite-equipe',
        title: 'Team building pour petite équipe (5-15 pers)',
        intro: "Quels formats fonctionnent vraiment quand on est peu nombreux.",
        body: [
          'Escape game scénarisé : court, intense, valorise la communication.',
          "Olympiades 'maison' avec 4 ateliers tournants.",
          'Atelier coopératif (construction, cuisine, énigmes).',
          "Le format 'mini-Murder Party' fonctionne très bien à partir de 6.",
        ].join('\n\n'),
        published: false,
        date: '2026-01-01T00:00:00Z',
      },
    ] as BlogPost[],
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
  prestationsDetails: {
    anniversaires: {
      baseline:
        "Koh-Lanta version cours d'école, chasse au trésor sur mesure, murder party junior — on transforme votre maison ou votre jardin en terrain d'aventure.",
      intro:
        "Un animateur professionnel, des scénarios cousus main pour l'âge des enfants, du matériel pro fourni — vous n'avez qu'à profiter de la journée. Photos, diplômes souvenir, surprise finale : c'est nous qui gérons.",
      inclus: [
        '1 animateur diplômé BAFA/BAFD',
        "Scénario sur mesure selon l'âge",
        'Tout le matériel (déguisements, accessoires, sono)',
        'Diplôme + souvenir pour chaque enfant',
        'Photos de la journée',
        'Devis détaillé sous 48h',
      ],
      activites: [
        { emoji: '🏝️', nom: 'Koh-Lanta' },
        { emoji: '🗺️', nom: 'Chasse au trésor' },
        { emoji: '🎭', nom: 'Murder Party junior' },
        { emoji: '🎯', nom: 'Olympiades' },
        { emoji: '🕵️', nom: 'Enquête mystère' },
        { emoji: '🎨', nom: 'Atelier créatif' },
        { emoji: '🎤', nom: 'Karaoké kids' },
        { emoji: '🦸', nom: 'Aventure héros' },
      ],
      timeline: [
        { temps: 'J-7', titre: 'Préparation', desc: 'On finalise le thème, les surprises et le matériel.' },
        { temps: 'H', titre: 'Arrivée des enfants', desc: 'Accueil costumé, présentation des règles, mise en équipes.' },
        { temps: 'H+30', titre: 'Le grand jeu', desc: 'Ateliers, défis, énigmes, fous rires garantis.' },
        { temps: 'H+1h45', titre: 'Goûter & cadeaux', desc: 'Pause goûter, remise des diplômes, photo de groupe.' },
        { temps: 'H+2h', titre: 'Retour des parents', desc: 'Enfants épuisés, parents ravis. Mission accomplie.' },
      ],
      options: ['Décoration thématique', 'Goûter inclus', 'Vidéo souvenir', 'Animateur n°2', 'Sono + micro', 'Costumes adultes'],
    },
    mariages: {
      baseline:
        "Vin d'honneur rythmé, soirée déchaînée ou journée complète : on s'adapte à vos envies, des plus chics aux plus folles.",
      intro:
        "Animation enfants pendant que les parents profitent, blind test pour briser la glace, karaoké géant pour libérer les voix : on dose le fun selon l'ambiance que VOUS voulez.",
      inclus: [
        'Animateur expérimenté en mariages',
        'Sono + micro fournis',
        'Programme personnalisé selon votre déroulé',
        'Coordination avec votre traiteur / DJ',
        'Repérage du lieu en amont',
        'Plan B en cas de pluie',
      ],
      activites: [
        { emoji: '🎤', nom: 'Karaoké' },
        { emoji: '🎵', nom: 'Blind Test' },
        { emoji: '💃', nom: 'Animation danse' },
        { emoji: '🎲', nom: 'Quiz mariés' },
        { emoji: '🎪', nom: 'Animation enfants' },
        { emoji: '🏆', nom: 'Olympiades adultes' },
        { emoji: '🎁', nom: 'Surprise mariés' },
        { emoji: '📸', nom: 'Photobooth' },
      ],
      timeline: [
        { temps: 'J-30', titre: 'Visio de prépa', desc: 'On cale le déroulé avec les mariés.' },
        { temps: "Vin d'honneur", titre: 'Mise en route', desc: 'Animation enfants, jeu adultes léger, ambiance.' },
        { temps: 'Repas', titre: 'Pause maîtrisée', desc: 'Quiz mariés entre les plats, anecdotes drôles.' },
        { temps: 'Soirée', titre: 'Le feu', desc: 'Blind test, karaoké, animations lancées au bon moment.' },
        { temps: 'Fin', titre: 'Cérémonie minuit', desc: 'Surprise des mariés ou fin en beauté.' },
      ],
      options: ['Animation enfants 2h', 'Photobooth', 'DJ partenaire', 'Cérémonie minuit', 'Surprise vidéo', 'Décoration'],
    },
    evg: {
      baseline:
        "Défis physiques, jeux décalés, scénarios immersifs : on prend en main 2 à 8 heures de votre journée pour souder le groupe et marquer le futur(e) marié(e) à vie.",
      intro:
        "Vous arrivez. On a tout préparé. Le futur(e) marié(e) ne sait rien, le groupe est lancé, l'ambiance monte. On reste pro — vous restez fun.",
      inclus: [
        'Animateur expérimenté EVG/EVF',
        'Scénario adapté au groupe',
        'Tout le matériel et accessoires',
        'Costumes / déguisements selon thème',
        'Coordination avec votre planning',
        'Photos du groupe',
      ],
      activites: [
        { emoji: '🏝️', nom: 'Koh-Lanta adulte' },
        { emoji: '🎭', nom: 'Murder party' },
        { emoji: '🚶', nom: 'City game' },
        { emoji: '🏝️', nom: 'Pékin Express urbain' },
        { emoji: '💪', nom: 'Parcours du combattant' },
        { emoji: '🎯', nom: 'Défis fous' },
        { emoji: '❓', nom: 'Quiz futur(e) marié(e)' },
        { emoji: '🕵️', nom: 'Missions secrètes' },
      ],
      timeline: [
        { temps: 'Pré', titre: 'Brief organisateur', desc: "On cale le scénario en visio avec l'organisateur(trice)." },
        { temps: 'H', titre: 'Arrivée surprise', desc: 'Briefing surprise du futur(e) marié(e), missions distribuées.' },
        { temps: 'H+1h', titre: 'Défis & énigmes', desc: "Enchaînement d'épreuves rapides, montée en intensité." },
        { temps: 'H+2h', titre: 'Scénario immersif', desc: "Pic de l'expérience : grand jeu signature." },
        { temps: 'Fin', titre: 'Diplôme + photo', desc: 'Remise du "diplôme de futur(e) marié(e)", photo souvenir.' },
      ],
      options: ['Costumes / déguisements', 'Vidéaste', 'Repas inclus', 'Hébergement (sur devis)', 'Transport groupe', 'Surprise personnalisée'],
    },
    team: {
      baseline:
        "Olympiades, escape game, grands jeux d'entreprise : on cale le tempo, on libère les rires — le management se passe le reste de la semaine.",
      intro:
        "Atelier court ou journée séminaire complète : on conçoit un programme aligné sur vos objectifs RH (cohésion, intégration, fun pur) et adapté à la taille du groupe.",
      inclus: [
        'Animateur professionnel',
        'Programme ajusté à vos objectifs',
        'Tout le matériel + sono',
        'Rapport animation post-événement',
        'Facture entreprise',
        'Adaptation indoor / outdoor',
      ],
      activites: [
        { emoji: '🏆', nom: 'Olympiades' },
        { emoji: '🎲', nom: 'Escape Game' },
        { emoji: '🚩', nom: 'Capture du drapeau' },
        { emoji: '🗺️', nom: 'Chasse au trésor' },
        { emoji: '🎤', nom: 'Blind test équipe' },
        { emoji: '💪', nom: 'Défis cohésion' },
        { emoji: '🕵️', nom: 'Murder party' },
        { emoji: '🎯', nom: 'Grands jeux' },
      ],
      timeline: [
        { temps: 'J-15', titre: 'Cadrage', desc: 'Visio avec le service RH pour fixer objectifs et contraintes.' },
        { temps: 'J', titre: 'Accueil', desc: 'Énergisation rapide, formation des équipes mélangées.' },
        { temps: 'Matinée', titre: 'Défis cohésion', desc: "Ateliers tournants, première montée d'adrénaline." },
        { temps: 'Midi', titre: 'Pause optimisée', desc: 'Format pause café ou déjeuner libre selon votre cadre.' },
        { temps: 'Après-midi', titre: 'Grand jeu final', desc: 'Olympiades / escape — un seul gagnant, des souvenirs partagés.' },
      ],
      options: ['Vidéo souvenir', 'Photographe', 'Trophée gravé', 'T-shirts personnalisés', 'Restauration', 'Salle privatisée'],
    },
    ecoles: {
      baseline:
        "Centres de loisirs, NAP, accueils périscolaires : interventions ponctuelles ou projets longs, pour soulager vos équipes ou réenchanter une thématique.",
      intro:
        "BAFD complet, expérience en direction d'ALSH, projets pédagogiques cousus main pour la tranche 3-12 ans. Vos équipes restent maîtres de la pédagogie — on apporte l'expertise grands jeux.",
      inclus: [
        'Animateur diplômé BAFA/BAFD',
        'Projet pédagogique sur mesure',
        'Tout le matériel pédagogique',
        "Rapport d'activité post-intervention",
        'Coordination avec votre direction',
        'Facture mairie / association',
      ],
      activites: [
        { emoji: '🎨', nom: 'Ateliers créatifs' },
        { emoji: '🏃', nom: 'Grands jeux' },
        { emoji: '🗺️', nom: 'Chasse au trésor' },
        { emoji: '🎭', nom: 'Atelier théâtre' },
        { emoji: '🎵', nom: 'Atelier musique' },
        { emoji: '🌳', nom: 'Sorties nature' },
        { emoji: '🥋', nom: 'Initiation Viet Vo Dao' },
        { emoji: '📚', nom: 'Veillées contées' },
      ],
      timeline: [
        { temps: 'Pré', titre: 'Réunion de cadrage', desc: 'Avec la direction : objectifs, public, contraintes.' },
        { temps: 'J-7', titre: 'Validation du projet', desc: 'Programme final + matériel listé.' },
        { temps: 'Jour J', titre: 'Animation', desc: 'Intervention de 1h à journée complète.' },
        { temps: 'Post', titre: 'Bilan', desc: 'Rapport pédagogique + photos pour la commune.' },
      ],
      options: ['Mallette pédagogique', 'Costume thème', 'Vidéo bilan', 'Sortie extérieure'],
    },
  } as Record<string, PrestationDetail>,
}

export type StoreSection = keyof typeof STORE_DEFAULTS

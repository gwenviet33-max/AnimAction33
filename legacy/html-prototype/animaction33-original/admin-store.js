/**
 * AnimAction33 — Content store
 *
 * Tiny abstraction over storage so we can swap LocalStorage ↔ Firestore
 * without touching pages. All page code MUST go through `aaStore`.
 *
 * API:
 *   aaStore.get(section)         → object (defaults if absent)
 *   aaStore.set(section, value)  → persists + notifies subscribers
 *   aaStore.reset(section)       → restore defaults
 *   aaStore.onChange(section, cb)→ subscribe (returns unsubscribe fn)
 *   aaStore.DEFAULTS             → the default content object
 *
 * Sections are independent so reset/edit per section is cheap.
 * Cross-tab sync via the native `storage` event.
 */

(function () {
  const PREFIX = "aa_content:";

  const DEFAULTS = {
    stats: {
      hero: [
        { value: "500", suffix: "+", label: "Événements" },
        { value: "30", suffix: "+", label: "Jeux" },
        { value: "7j/7", suffix: "", label: "Disponible" },
      ],
      block: [
        { value: "500", suffix: "+", label: "Événements" },
        { value: "10", suffix: "", label: "Ans" },
        { value: "30", suffix: "+", label: "Jeux" },
        { value: "Des dizaines", suffix: "", label: "Familles satisfaites" },
      ],
    },
    hero: {
      pill: "🎪 Animation événementielle • Gironde",
      title_l1: "Des anims",
      title_l2: "qui",
      title_l2_accent: "déchirent",
      sub: "Anniversaires, mariages, EVG, koh-lanta…\nOn s'occupe de tout — vous profitez.",
      cta_primary: "Réserver ma date",
      cta_secondary: "Voir les prestations →",
    },
    marquee: [
      "🎓 BAFA + BAFD",
      "🥋 Professeur de Viet Vo Dao",
      "🎪 7 ans d'animation",
      "⭐ Animateur multi-diplômé",
      "🎯 Des jeux uniques",
      "🛡️ Moniteur professionnel & Instructeur fédéral",
      "✅ PSE1 / PSE2 / PSC1",
    ],
    prestations: [
      { key: "anniversaires", emoji: "🎂", title: "Anniversaires", desc: "Koh-Lanta, chasse au trésor, murder party… pour 5 à 50 enfants.", price: "Dès 199€", href: "Anniversaires.html" },
      { key: "mariages", emoji: "💍", title: "Mariages", desc: "Animations discrètes ou déchaînées — on s'adapte à l'ambiance.", price: "Dès 349€", href: "Mariages.html" },
      { key: "evg", emoji: "🥂", title: "EVG / EVF", desc: "Challenges, défis, rires — la soirée qu'ils n'oublieront pas.", price: "Dès 249€", href: "EVG-EVF.html" },
      { key: "team", emoji: "🏢", title: "Team Building", desc: "Cohésion d'équipe, olympiades, grands jeux d'entreprise.", price: "Dès 399€", href: "TeamBuilding.html" },
      { key: "grands-jeux", emoji: "🎯", title: "Grands Jeux", desc: "+30 jeux dans notre catalogue — du classique à l'original.", price: "+30 jeux", href: "" },
      { key: "ecoles", emoji: "🏫", title: "Écoles & Loisirs", desc: "Centres de loisirs, NAP, accueils périscolaires.", price: "BAFA/BAFD", href: "" },
    ],
    games: [
      { emoji: "🎭", cat: "Immersif", name: "Murder Party", players: "10 à 40 joueurs · 2h" },
      { emoji: "🏝️", cat: "Aventure", name: "Koh-Lanta", players: "8 à 50 joueurs · 3h" },
      { emoji: "🗺️", cat: "Exploration", name: "Chasse au trésor", players: "6 à 40 joueurs · 1h30" },
      { emoji: "🎤", cat: "Show", name: "Karaoké géant", players: "10+ · libre" },
      { emoji: "🏆", cat: "Compétition", name: "Olympiades", players: "10 à 100 · 2h" },
      { emoji: "🎲", cat: "Stratégie", name: "Escape Game", players: "4 à 12 · 1h" },
      { emoji: "🎯", cat: "Adresse", name: "Défis fous", players: "Tous âges" },
      { emoji: "🤡", cat: "Comédie", name: "Stand-up battle", players: "10+ · 1h" },
    ],
    testimonials: [
      { stars: 5, text: "Votre témoignage pourrait s'afficher ici…" },
      { stars: 5, text: "Votre témoignage pourrait s'afficher ici…" },
      { stars: 5, text: "Votre témoignage pourrait s'afficher ici…" },
    ],
    faq: [
      { q: "Vous vous déplacez dans toute la Gironde ?", a: "Oui — Libourne et toute la Gironde (jusqu'à 60 km sans frais)." },
      { q: "Vous avez les assurances nécessaires ?", a: "RC Pro + BAFA + BAFD + PSC1 + PSE1 — tout est en règle." },
      { q: "On peut adapter une animation à mon thème ?", a: "Absolument ! Chaque animation est personnalisée." },
      { q: "Combien de temps à l'avance faut-il réserver ?", a: "Idéalement 4 à 6 semaines — surtout en haute saison." },
      { q: "Comment se passe le devis ?", a: "Vous remplissez le formulaire, on discute 10 minutes au téléphone, devis sous 48h." },
      { q: "Vous gérez aussi le matériel ?", a: "Oui — sono, micros, costumes, accessoires, décors." },
    ],
    contact: {
      phone: "06 77 24 36 75",
      phone_raw: "0677243675",
      email: "contact@animaction33.fr",
      zone: "Libourne & Gironde",
    },
  };

  function key(section) { return PREFIX + section; }

  function deepClone(v) { return JSON.parse(JSON.stringify(v)); }

  function get(section) {
    if (!(section in DEFAULTS)) {
      console.warn("aaStore.get: unknown section", section);
      return null;
    }
    try {
      const raw = localStorage.getItem(key(section));
      if (!raw) return deepClone(DEFAULTS[section]);
      return JSON.parse(raw);
    } catch (e) {
      console.warn("aaStore.get parse error", section, e);
      return deepClone(DEFAULTS[section]);
    }
  }

  const subs = new Map(); // section -> Set<cb>

  function notify(section, value) {
    const set = subs.get(section);
    if (set) set.forEach(cb => { try { cb(value); } catch (e) { console.error(e); } });
  }

  function set(section, value) {
    if (!(section in DEFAULTS)) {
      console.warn("aaStore.set: unknown section", section);
      return;
    }
    localStorage.setItem(key(section), JSON.stringify(value));
    notify(section, value);
  }

  function reset(section) {
    if (!(section in DEFAULTS)) return;
    localStorage.removeItem(key(section));
    notify(section, deepClone(DEFAULTS[section]));
  }

  function onChange(section, cb) {
    if (!subs.has(section)) subs.set(section, new Set());
    subs.get(section).add(cb);
    return () => subs.get(section)?.delete(cb);
  }

  // Cross-tab sync
  window.addEventListener("storage", (e) => {
    if (!e.key || !e.key.startsWith(PREFIX)) return;
    const section = e.key.slice(PREFIX.length);
    notify(section, get(section));
  });

  window.aaStore = { get, set, reset, onChange, DEFAULTS, _key: key };
})();

'use client'

import { useEffect, useState } from 'react'
import { aaStore, STORE_DEFAULTS } from '@/lib/store'
import type { ContactType, FaqItem } from '@/lib/defaults'
import { showToast } from '@/lib/utils'

type Tab = 'hero' | 'marquee' | 'faq' | 'contactTypes'

const TABS: { key: Tab; label: string }[] = [
  { key: 'hero', label: '🎯 Bloc d\'accueil' },
  { key: 'marquee', label: '🎞 Bandeau défilant' },
  { key: 'faq', label: '❓ FAQ' },
  { key: 'contactTypes', label: '✉️ Types de demande (formulaire)' },
]

export default function ContenusAdmin() {
  const [tab, setTab] = useState<Tab>('hero')
  const [hero, setHero] = useState(STORE_DEFAULTS.hero)
  const [marquee, setMarquee] = useState<string[]>(STORE_DEFAULTS.marquee)
  const [faq, setFaq] = useState<FaqItem[]>(STORE_DEFAULTS.faq)
  const [contactTypes, setContactTypes] = useState<ContactType[]>(
    STORE_DEFAULTS.contactTypes
  )

  useEffect(() => {
    aaStore.get('hero').then(setHero)
    aaStore.get('marquee').then(setMarquee)
    aaStore.get('faq').then(setFaq)
    aaStore.get('contactTypes').then(setContactTypes)
  }, [])

  const saveAll = async () => {
    const results = await Promise.all([
      aaStore.flush('hero', hero),
      aaStore.flush('marquee', marquee),
      aaStore.flush('faq', faq),
      aaStore.flush('contactTypes', contactTypes),
    ])
    if (results.every(Boolean)) showToast('💾 Contenus sauvegardés')
    else showToast('⚠️ Sauvegarde partielle — vérifie ta connexion')
  }

  return (
    <div className="max-w-4xl">
      <h1 className="font-display text-3xl uppercase md:text-4xl">Contenus du site</h1>
      <p className="mt-1 text-aa-ink/70">
        Édite tous les textes affichés sur le site public. Sauvegarde unique en bas de page.
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={
              'rounded-full border-[3px] border-aa-ink px-4 py-1.5 font-bold transition ' +
              (tab === t.key ? 'bg-aa-red text-white' : 'bg-white text-aa-ink hover:bg-aa-yellow')
            }
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'hero' && (
        <Section title="Bloc d'accueil (haut de la home)">
          <Field label="Pill (étiquette jaune)">
            <Input value={hero.pill} on={(v) => setHero({ ...hero, pill: v })} />
          </Field>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <Field label="Titre — ligne 1">
              <Input value={hero.title_l1} on={(v) => setHero({ ...hero, title_l1: v })} />
            </Field>
            <Field label="Titre — ligne 2 (début)">
              <Input value={hero.title_l2} on={(v) => setHero({ ...hero, title_l2: v })} />
            </Field>
            <Field label="Titre — ligne 2 (mot rouge)">
              <Input
                value={hero.title_l2_accent}
                on={(v) => setHero({ ...hero, title_l2_accent: v })}
              />
            </Field>
          </div>
          <Field label="Sous-titre (saute une ligne avec un retour clavier)">
            <textarea
              value={hero.sub}
              onChange={(e) => setHero({ ...hero, sub: e.target.value })}
              rows={3}
              className="w-full rounded-md border-2 border-aa-ink bg-white p-2"
            />
          </Field>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <Field label="Bouton principal">
              <Input value={hero.cta_primary} on={(v) => setHero({ ...hero, cta_primary: v })} />
            </Field>
            <Field label="Bouton secondaire">
              <Input value={hero.cta_secondary} on={(v) => setHero({ ...hero, cta_secondary: v })} />
            </Field>
          </div>
        </Section>
      )}

      {tab === 'marquee' && (
        <Section title="Bandeau défilant (juste sous le hero)">
          <p className="text-sm text-aa-ink/70">
            Liste des messages qui défilent en boucle. Une ligne = un message.
          </p>
          <div className="space-y-2">
            {marquee.map((item, i) => (
              <div key={i} className="flex gap-2">
                <Input
                  value={item}
                  on={(v) => setMarquee(marquee.map((m, j) => (i === j ? v : m)))}
                />
                <button
                  onClick={() => setMarquee(marquee.filter((_, j) => j !== i))}
                  className="rounded-full border-2 border-aa-ink bg-aa-red px-3 text-xs font-bold text-white"
                  aria-label="Supprimer"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <button onClick={() => setMarquee([...marquee, '✨ Nouveau message'])} className="nb-btn">
            + Ajouter un message
          </button>
        </Section>
      )}

      {tab === 'faq' && (
        <Section title="Foire aux questions">
          <div className="space-y-4">
            {faq.map((item, i) => (
              <div key={i} className="rounded-md border-2 border-aa-ink/20 bg-white p-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-aa-ink/60">Q{i + 1}</span>
                  <button
                    onClick={() => setFaq(faq.filter((_, j) => j !== i))}
                    className="ml-auto rounded-full border-2 border-aa-ink bg-aa-red px-3 py-0.5 text-xs font-bold text-white"
                  >
                    Supprimer
                  </button>
                </div>
                <Field label="Question">
                  <Input
                    value={item.q}
                    on={(v) => setFaq(faq.map((f, j) => (i === j ? { ...f, q: v } : f)))}
                  />
                </Field>
                <Field label="Réponse">
                  <textarea
                    value={item.a}
                    onChange={(e) =>
                      setFaq(faq.map((f, j) => (i === j ? { ...f, a: e.target.value } : f)))
                    }
                    rows={3}
                    className="w-full rounded-md border-2 border-aa-ink bg-white p-2"
                  />
                </Field>
              </div>
            ))}
          </div>
          <button
            onClick={() => setFaq([...faq, { q: 'Nouvelle question', a: 'Nouvelle réponse' }])}
            className="nb-btn"
          >
            + Ajouter une question
          </button>
        </Section>
      )}

      {tab === 'contactTypes' && (
        <Section title="Types d'événement proposés dans le formulaire de contact">
          <p className="text-sm text-aa-ink/70">
            Étape 1 du formulaire <code>/contact</code>. Le « value » est l&apos;identifiant
            technique (ne mets pas d&apos;espaces ni d&apos;accents) ; le « label » est ce que voit
            le visiteur (avec emoji).
          </p>
          <div className="space-y-2">
            {contactTypes.map((t, i) => (
              <div key={i} className="grid grid-cols-1 gap-2 md:grid-cols-[1fr_2fr_auto]">
                <Input
                  placeholder="value (ex: anniv)"
                  value={t.value}
                  on={(v) =>
                    setContactTypes(
                      contactTypes.map((x, j) => (i === j ? { ...x, value: v } : x))
                    )
                  }
                />
                <Input
                  placeholder="label affiché (ex: 🎂 Anniversaire)"
                  value={t.label}
                  on={(v) =>
                    setContactTypes(
                      contactTypes.map((x, j) => (i === j ? { ...x, label: v } : x))
                    )
                  }
                />
                <button
                  onClick={() => setContactTypes(contactTypes.filter((_, j) => j !== i))}
                  className="rounded-full border-2 border-aa-ink bg-aa-red px-3 text-xs font-bold text-white"
                  aria-label="Supprimer"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={() => setContactTypes([...contactTypes, { value: 'nouveau', label: '✨ Nouveau' }])}
            className="nb-btn"
          >
            + Ajouter un type
          </button>
        </Section>
      )}

      <div className="mt-8 flex flex-wrap gap-3">
        <button onClick={saveAll} className="nb-btn nb-btn--red">
          💾 Enregistrer tout
        </button>
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-6 rounded-md border-[3px] border-aa-ink bg-aa-paper p-5 shadow-pop space-y-4">
      <h2 className="font-display text-xl uppercase">{title}</h2>
      {children}
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs font-bold uppercase">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  )
}

function Input({
  value,
  on,
  placeholder,
}: {
  value: string
  on: (v: string) => void
  placeholder?: string
}) {
  return (
    <input
      type="text"
      value={value}
      placeholder={placeholder}
      onChange={(e) => on(e.target.value)}
      className="w-full rounded-md border-2 border-aa-ink bg-white p-2"
    />
  )
}

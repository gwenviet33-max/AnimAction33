'use client'

import { useEffect, useState } from 'react'
import { aaStore, STORE_DEFAULTS } from '@/lib/store'
import type { Activity, PrestationDetail, TimelineStep } from '@/lib/defaults'
import { showToast } from '@/lib/utils'

type AllDetails = (typeof STORE_DEFAULTS)['prestationsDetails']

const KEYS: { key: string; label: string }[] = [
  { key: 'anniversaires', label: '🎂 Anniversaires' },
  { key: 'mariages', label: '💍 Mariages' },
  { key: 'evg', label: '🥂 EVG / EVF' },
  { key: 'team', label: '🏢 Team Building' },
  { key: 'ecoles', label: '🏫 Écoles & Loisirs' },
]

export default function PrestationsContentAdmin() {
  const [data, setData] = useState<AllDetails>(STORE_DEFAULTS.prestationsDetails)
  const [key, setKey] = useState<string>('anniversaires')

  useEffect(() => {
    aaStore.get('prestationsDetails').then(setData)
  }, [])

  const current = data[key] || STORE_DEFAULTS.prestationsDetails[key]

  const setCurrent = (patch: Partial<PrestationDetail>) => {
    setData({ ...data, [key]: { ...current, ...patch } })
  }

  const save = async () => {
    const ok = await aaStore.flush('prestationsDetails', data)
    showToast(ok ? '💾 Contenu sauvegardé' : '⚠️ Erreur de sauvegarde')
  }

  return (
    <div className="max-w-4xl">
      <h1 className="font-display text-3xl uppercase md:text-4xl">Contenu des prestations</h1>
      <p className="mt-1 text-aa-ink/70">
        Édite l&apos;intro, les activités proposées, le déroulé type et les options de chaque
        prestation. (Titre, prix, formules et état activé/désactivé se gèrent ailleurs.)
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        {KEYS.map((k) => (
          <button
            key={k.key}
            onClick={() => setKey(k.key)}
            className={
              'rounded-full border-[3px] border-aa-ink px-4 py-1.5 font-bold transition ' +
              (key === k.key ? 'bg-aa-red text-white' : 'bg-white text-aa-ink hover:bg-aa-yellow')
            }
          >
            {k.label}
          </button>
        ))}
      </div>

      <Section title="Phrase d'accroche (sous le titre)">
        <textarea
          value={current.baseline}
          onChange={(e) => setCurrent({ baseline: e.target.value })}
          rows={3}
          className="w-full rounded-md border-2 border-aa-ink bg-white p-2"
        />
      </Section>

      <Section title="Intro (paragraphe « L'expérience »)">
        <textarea
          value={current.intro}
          onChange={(e) => setCurrent({ intro: e.target.value })}
          rows={4}
          className="w-full rounded-md border-2 border-aa-ink bg-white p-2"
        />
      </Section>

      <Section title="Inclus dans la prestation (liste à cocher)">
        <StringList
          items={current.inclus}
          onChange={(inclus) => setCurrent({ inclus })}
          placeholder="Ex: 1 animateur diplômé BAFA/BAFD"
        />
      </Section>

      <Section title="Activités possibles (emoji + nom)">
        <ActivityList
          items={current.activites}
          onChange={(activites) => setCurrent({ activites })}
        />
      </Section>

      <Section title="Déroulé type (étape, titre, description)">
        <TimelineList
          items={current.timeline}
          onChange={(timeline) => setCurrent({ timeline })}
        />
      </Section>

      <Section title="Options proposées (badges en bas de page)">
        <StringList
          items={current.options}
          onChange={(options) => setCurrent({ options })}
          placeholder="Ex: Décoration thématique"
        />
      </Section>

      <div className="mt-8 flex flex-wrap gap-3">
        <button onClick={save} className="nb-btn nb-btn--red">
          💾 Enregistrer
        </button>
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-6 rounded-md border-[3px] border-aa-ink bg-aa-paper p-5 shadow-pop">
      <h2 className="font-display text-base uppercase">{title}</h2>
      <div className="mt-3">{children}</div>
    </div>
  )
}

function StringList({
  items,
  onChange,
  placeholder,
}: {
  items: string[]
  onChange: (next: string[]) => void
  placeholder?: string
}) {
  return (
    <div className="space-y-2">
      {items.map((it, i) => (
        <div key={i} className="flex gap-2">
          <input
            type="text"
            value={it}
            placeholder={placeholder}
            onChange={(e) => onChange(items.map((x, j) => (i === j ? e.target.value : x)))}
            className="flex-1 rounded-md border-2 border-aa-ink bg-white p-2"
          />
          <button
            onClick={() => onChange(items.filter((_, j) => j !== i))}
            className="rounded-full border-2 border-aa-ink bg-aa-red px-3 text-xs font-bold text-white"
            aria-label="Supprimer"
          >
            ×
          </button>
        </div>
      ))}
      <button onClick={() => onChange([...items, ''])} className="nb-btn">
        + Ajouter
      </button>
    </div>
  )
}

function ActivityList({
  items,
  onChange,
}: {
  items: Activity[]
  onChange: (next: Activity[]) => void
}) {
  return (
    <div className="space-y-2">
      {items.map((it, i) => (
        <div key={i} className="grid grid-cols-[60px_1fr_auto] gap-2">
          <input
            type="text"
            value={it.emoji}
            maxLength={4}
            onChange={(e) =>
              onChange(items.map((x, j) => (i === j ? { ...x, emoji: e.target.value } : x)))
            }
            className="rounded-md border-2 border-aa-ink bg-white p-2 text-center text-xl"
          />
          <input
            type="text"
            value={it.nom}
            placeholder="Nom de l'activité"
            onChange={(e) =>
              onChange(items.map((x, j) => (i === j ? { ...x, nom: e.target.value } : x)))
            }
            className="rounded-md border-2 border-aa-ink bg-white p-2 font-bold"
          />
          <button
            onClick={() => onChange(items.filter((_, j) => j !== i))}
            className="rounded-full border-2 border-aa-ink bg-aa-red px-3 text-xs font-bold text-white"
            aria-label="Supprimer"
          >
            ×
          </button>
        </div>
      ))}
      <button onClick={() => onChange([...items, { emoji: '🎯', nom: 'Nouvelle activité' }])} className="nb-btn">
        + Ajouter
      </button>
    </div>
  )
}

function TimelineList({
  items,
  onChange,
}: {
  items: TimelineStep[]
  onChange: (next: TimelineStep[]) => void
}) {
  return (
    <div className="space-y-3">
      {items.map((it, i) => (
        <div key={i} className="rounded-md border-2 border-aa-ink/20 bg-white p-3">
          <div className="grid grid-cols-[120px_1fr_auto] gap-2">
            <input
              type="text"
              value={it.temps}
              placeholder="Ex: J-7"
              onChange={(e) =>
                onChange(items.map((x, j) => (i === j ? { ...x, temps: e.target.value } : x)))
              }
              className="rounded-md border-2 border-aa-ink bg-white p-2 font-mono text-sm"
            />
            <input
              type="text"
              value={it.titre}
              placeholder="Titre de l'étape"
              onChange={(e) =>
                onChange(items.map((x, j) => (i === j ? { ...x, titre: e.target.value } : x)))
              }
              className="rounded-md border-2 border-aa-ink bg-white p-2 font-bold"
            />
            <button
              onClick={() => onChange(items.filter((_, j) => j !== i))}
              className="rounded-full border-2 border-aa-ink bg-aa-red px-3 text-xs font-bold text-white"
              aria-label="Supprimer"
            >
              ×
            </button>
          </div>
          <textarea
            value={it.desc}
            placeholder="Description de l'étape"
            rows={2}
            onChange={(e) =>
              onChange(items.map((x, j) => (i === j ? { ...x, desc: e.target.value } : x)))
            }
            className="mt-2 w-full rounded-md border-2 border-aa-ink bg-white p-2 text-sm"
          />
        </div>
      ))}
      <button
        onClick={() =>
          onChange([...items, { temps: 'Étape', titre: 'Nouveau', desc: 'Description' }])
        }
        className="nb-btn"
      >
        + Ajouter une étape
      </button>
    </div>
  )
}

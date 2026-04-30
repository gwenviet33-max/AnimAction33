'use client'

import { useEffect, useState } from 'react'
import { aaStore, STORE_DEFAULTS, type Testimonial } from '@/lib/store'
import { showToast } from '@/lib/utils'

const ACTIVITES = ['Anniversaire', 'Mariage', 'EVG', 'EVF', 'Team Building', 'École', 'Autre']

const TEMPLATE = `Bonjour {prenom} ! Merci pour votre confiance lors de {evenement}.
Si vous avez été satisfait(e), un avis Google nous aiderait beaucoup 🙏
Lien direct : https://g.page/r/animaction33/review`

export default function TemoignagesAdmin() {
  const [list, setList] = useState<Testimonial[]>(STORE_DEFAULTS.testimonials)
  const [drawer, setDrawer] = useState(false)
  const [draft, setDraft] = useState<Testimonial>({
    stars: 5,
    text: '',
    prenom: '',
    ville: '',
    activite: ACTIVITES[0],
    affiche: true,
  })

  useEffect(() => {
    setList(aaStore.get('testimonials'))
  }, [])

  const persist = (next: Testimonial[]) => {
    setList(next)
    aaStore.set('testimonials', next)
  }

  const toggle = (i: number) => persist(list.map((t, j) => (i === j ? { ...t, affiche: !t.affiche } : t)))
  const remove = (i: number) => persist(list.filter((_, j) => j !== i))
  const add = () => {
    if (!draft.text.trim()) return showToast('Texte requis')
    persist([draft, ...list])
    setDraft({ stars: 5, text: '', prenom: '', ville: '', activite: ACTIVITES[0], affiche: true })
    setDrawer(false)
    showToast('✅ Témoignage ajouté')
  }

  const copyTemplate = async () => {
    await navigator.clipboard.writeText(TEMPLATE)
    showToast('📋 Template copié')
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl uppercase md:text-4xl">Témoignages</h1>
          <p className="mt-1 text-aa-ink/70">{list.filter((t) => t.affiche).length} affichés · {list.filter((t) => !t.affiche).length} masqués</p>
        </div>
        <button onClick={() => setDrawer(true)} className="nb-btn nb-btn--red">
          + Ajouter
        </button>
      </div>

      <div className="mt-6 rounded-md border-[3px] border-aa-ink bg-aa-yellow p-5 shadow-pop">
        <h3 className="font-display uppercase">📲 Template WhatsApp à envoyer</h3>
        <pre className="mt-3 whitespace-pre-wrap rounded-md border-2 border-aa-ink bg-white p-3 text-sm">
          {TEMPLATE}
        </pre>
        <div className="mt-3 flex flex-wrap gap-3">
          <button onClick={copyTemplate} className="nb-btn">
            Copier
          </button>
          <a
            href="https://wa.me/33677243675"
            target="_blank"
            rel="noopener noreferrer"
            className="nb-btn nb-btn--blue"
          >
            Ouvrir WhatsApp
          </a>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {list.map((t, i) => (
          <article key={i} className="rounded-md border-[3px] border-aa-ink bg-aa-paper p-5 shadow-pop">
            <div className="text-aa-yellow">{'★'.repeat(t.stars)}</div>
            <p className="mt-2 text-sm">“{t.text || '—'}”</p>
            <p className="mt-2 text-xs font-bold text-aa-ink/70">
              {t.prenom || 'Anonyme'} {t.ville && `· ${t.ville}`} {t.activite && `· ${t.activite}`}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                onClick={() => toggle(i)}
                className={
                  'rounded-full border-2 border-aa-ink px-3 py-1 text-xs font-bold ' +
                  (t.affiche ? 'bg-aa-blue text-white' : 'bg-white text-aa-ink')
                }
              >
                {t.affiche ? 'Affiché' : 'Masqué'}
              </button>
              <button onClick={() => remove(i)} className="rounded-full border-2 border-aa-ink bg-aa-red px-3 py-1 text-xs font-bold text-white">
                Supprimer
              </button>
            </div>
          </article>
        ))}
      </div>

      {drawer && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/50" onClick={() => setDrawer(false)}>
          <div
            className="h-full w-full max-w-md overflow-y-auto bg-white p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="font-display text-2xl uppercase">Nouveau témoignage</h2>
            <div className="mt-4 space-y-3">
              <Field label="Prénom">
                <input
                  type="text"
                  value={draft.prenom}
                  onChange={(e) => setDraft({ ...draft, prenom: e.target.value })}
                  className="w-full rounded-md border-2 border-aa-ink p-2"
                />
              </Field>
              <Field label="Ville">
                <input
                  type="text"
                  value={draft.ville}
                  onChange={(e) => setDraft({ ...draft, ville: e.target.value })}
                  className="w-full rounded-md border-2 border-aa-ink p-2"
                />
              </Field>
              <Field label="Activité">
                <select
                  value={draft.activite}
                  onChange={(e) => setDraft({ ...draft, activite: e.target.value })}
                  className="w-full rounded-md border-2 border-aa-ink bg-white p-2"
                >
                  {ACTIVITES.map((a) => (
                    <option key={a}>{a}</option>
                  ))}
                </select>
              </Field>
              <Field label="Étoiles">
                <div className="flex gap-1 text-2xl text-aa-yellow">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      type="button"
                      key={n}
                      onClick={() => setDraft({ ...draft, stars: n })}
                      className={n <= draft.stars ? '' : 'opacity-30'}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </Field>
              <Field label="Texte (max 500)">
                <textarea
                  rows={5}
                  maxLength={500}
                  value={draft.text}
                  onChange={(e) => setDraft({ ...draft, text: e.target.value })}
                  className="w-full rounded-md border-2 border-aa-ink p-2"
                />
              </Field>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={draft.affiche}
                  onChange={(e) => setDraft({ ...draft, affiche: e.target.checked })}
                />
                <span className="text-sm">Afficher sur le site</span>
              </label>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button onClick={add} className="nb-btn nb-btn--red">
                Enregistrer
              </button>
              <button onClick={() => setDrawer(false)} className="nb-btn">
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
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

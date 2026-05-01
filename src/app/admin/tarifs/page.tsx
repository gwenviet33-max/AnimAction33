'use client'

import { useEffect, useState } from 'react'
import { aaStore, STORE_DEFAULTS } from '@/lib/store'
import type { Formule } from '@/lib/store'
import { showToast } from '@/lib/utils'

const SECTIONS: { key: keyof typeof STORE_DEFAULTS.formules; label: string }[] = [
  { key: 'anniversaires', label: 'Anniversaires' },
  { key: 'mariages', label: 'Mariages' },
  { key: 'evg', label: 'EVG / EVF' },
  { key: 'teamBuilding', label: 'Team Building' },
]

export default function TarifsAdmin() {
  const [data, setData] = useState(STORE_DEFAULTS.formules)
  const [open, setOpen] = useState<string>('anniversaires')

  useEffect(() => {
    aaStore.get('formules').then(setData)
  }, [])

  const update = (sec: keyof typeof STORE_DEFAULTS.formules, idx: number, patch: Partial<Formule>) => {
    setData((prev) => ({
      ...prev,
      [sec]: prev[sec].map((f, i) => (i === idx ? { ...f, ...patch } : f)),
    }))
  }

  const save = () => {
    aaStore.set('formules', data)
    showToast('💾 Tarifs sauvegardés')
  }

  const reset = () => {
    aaStore.reset('formules')
    setData(STORE_DEFAULTS.formules)
    showToast('↺ Réinitialisé')
  }

  return (
    <div>
      <h1 className="font-display text-3xl uppercase md:text-4xl">Tarifs & prix</h1>
      <p className="mt-2 text-aa-ink/70">Édition inline — sauvegarde dans le navigateur (localStorage).</p>

      <div className="mt-6 flex flex-wrap gap-2">
        {SECTIONS.map((s) => (
          <button
            key={s.key}
            onClick={() => setOpen(s.key)}
            className={
              'rounded-full border-[3px] border-aa-ink px-4 py-1.5 font-bold transition ' +
              (open === s.key ? 'bg-aa-red text-white' : 'bg-white text-aa-ink hover:bg-aa-yellow')
            }
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="mt-6 rounded-md border-[3px] border-aa-ink bg-aa-paper p-6 shadow-pop">
        <h2 className="font-display text-xl uppercase">{SECTIONS.find((s) => s.key === open)?.label}</h2>
        <div className="mt-4 grid grid-cols-1 gap-4">
          {(data[open as keyof typeof data] as Formule[]).map((f, idx) => (
            <article key={idx} className="rounded-md border-2 border-aa-ink/20 bg-white p-4">
              <div className="grid grid-cols-1 gap-3 md:grid-cols-5">
                <label className="block">
                  <span className="text-xs font-bold uppercase">Nom</span>
                  <input
                    type="text"
                    value={f.nom}
                    onChange={(e) => update(open as keyof typeof data, idx, { nom: e.target.value })}
                    className="mt-1 w-full rounded-md border-2 border-aa-ink p-2"
                  />
                </label>
                <label className="block">
                  <span className="text-xs font-bold uppercase">Prix (€)</span>
                  <input
                    type="number"
                    value={f.prix ?? ''}
                    onChange={(e) =>
                      update(open as keyof typeof data, idx, {
                        prix: e.target.value === '' ? null : Number(e.target.value),
                      })
                    }
                    className="mt-1 w-full rounded-md border-2 border-aa-ink p-2"
                  />
                </label>
                <label className="block">
                  <span className="text-xs font-bold uppercase">Durée</span>
                  <input
                    type="text"
                    value={f.duree}
                    onChange={(e) => update(open as keyof typeof data, idx, { duree: e.target.value })}
                    className="mt-1 w-full rounded-md border-2 border-aa-ink p-2"
                  />
                </label>
                <label className="block">
                  <span className="text-xs font-bold uppercase">Max</span>
                  <input
                    type="text"
                    value={f.max}
                    onChange={(e) => update(open as keyof typeof data, idx, { max: e.target.value })}
                    className="mt-1 w-full rounded-md border-2 border-aa-ink p-2"
                  />
                </label>
                <label className="block">
                  <span className="text-xs font-bold uppercase">Badge</span>
                  <select
                    value={f.badge ?? ''}
                    onChange={(e) =>
                      update(open as keyof typeof data, idx, {
                        badge: e.target.value === '' ? null : e.target.value,
                      })
                    }
                    className="mt-1 w-full rounded-md border-2 border-aa-ink bg-white p-2"
                  >
                    <option value="">— aucun —</option>
                    <option value="Le + choisi">Le + choisi</option>
                    <option value="Premium">Premium</option>
                  </select>
                </label>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <button onClick={save} className="nb-btn nb-btn--red">
          💾 Enregistrer
        </button>
        <button onClick={reset} className="nb-btn">
          ↺ Réinitialiser
        </button>
      </div>
    </div>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { aaStore, STORE_DEFAULTS } from '@/lib/store'
import { showToast } from '@/lib/utils'

export default function PrestationsAdmin() {
  const [list, setList] = useState(STORE_DEFAULTS.prestations)

  useEffect(() => {
    setList(aaStore.get('prestations'))
  }, [])

  const update = (i: number, patch: Partial<(typeof STORE_DEFAULTS.prestations)[number]>) => {
    const next = list.map((p, j) => (i === j ? { ...p, ...patch } : p))
    setList(next)
    aaStore.set('prestations', next)
  }

  return (
    <div>
      <h1 className="font-display text-3xl uppercase md:text-4xl">Prestations</h1>
      <p className="mt-1 text-aa-ink/70">Activer / désactiver les cartes affichées sur le site.</p>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        {list.map((p, i) => (
          <article key={p.key} className="rounded-md border-[3px] border-aa-ink bg-aa-paper p-5 shadow-pop">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-3xl">{p.emoji}</div>
                <h3 className="mt-2 font-display text-xl uppercase">{p.title}</h3>
                <p className="mt-1 text-sm text-aa-ink/70">{p.desc}</p>
              </div>
              <label className="flex shrink-0 cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={p.active}
                  onChange={(e) => {
                    update(i, { active: e.target.checked })
                    showToast(e.target.checked ? '✅ Activée' : '⏸ Désactivée')
                  }}
                  className="h-5 w-5"
                />
                <span className="text-xs font-bold uppercase">{p.active ? 'Active' : 'Inactive'}</span>
              </label>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-2 md:grid-cols-2">
              <label className="block">
                <span className="text-xs font-bold uppercase">Titre</span>
                <input
                  type="text"
                  value={p.title}
                  onChange={(e) => update(i, { title: e.target.value })}
                  className="mt-1 w-full rounded-md border-2 border-aa-ink p-2"
                />
              </label>
              <label className="block">
                <span className="text-xs font-bold uppercase">Prix</span>
                <input
                  type="text"
                  value={p.price}
                  onChange={(e) => update(i, { price: e.target.value })}
                  className="mt-1 w-full rounded-md border-2 border-aa-ink p-2"
                />
              </label>
              <label className="col-span-full block">
                <span className="text-xs font-bold uppercase">Description</span>
                <input
                  type="text"
                  value={p.desc}
                  onChange={(e) => update(i, { desc: e.target.value })}
                  className="mt-1 w-full rounded-md border-2 border-aa-ink p-2"
                />
              </label>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}

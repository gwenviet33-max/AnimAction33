'use client'

import { useEffect, useState } from 'react'
import { aaStore, STORE_DEFAULTS } from '@/lib/store'
import { showToast } from '@/lib/utils'

export default function StatsAdmin() {
  const [data, setData] = useState(STORE_DEFAULTS.stats)

  useEffect(() => {
    setData(aaStore.get('stats'))
  }, [])

  const update = (group: 'hero' | 'block', i: number, patch: Partial<(typeof STORE_DEFAULTS.stats.hero)[number]>) => {
    setData((prev) => ({
      ...prev,
      [group]: prev[group].map((s, j) => (i === j ? { ...s, ...patch } : s)),
    }))
  }

  const save = () => {
    aaStore.set('stats', data)
    showToast('💾 Stats sauvegardées')
  }

  return (
    <div>
      <h1 className="font-display text-3xl uppercase md:text-4xl">Stats & chiffres</h1>

      <Block title="Stats du Hero (3 chiffres)" rows={data.hero} group="hero" update={update} />
      <Block title="Stats du bloc principal (4 chiffres)" rows={data.block} group="block" update={update} />

      <button onClick={save} className="nb-btn nb-btn--red mt-6">
        💾 Enregistrer
      </button>
    </div>
  )
}

function Block({
  title,
  rows,
  group,
  update,
}: {
  title: string
  rows: { value: string; suffix: string; label: string }[]
  group: 'hero' | 'block'
  update: (group: 'hero' | 'block', i: number, patch: Partial<{ value: string; suffix: string; label: string }>) => void
}) {
  return (
    <div className="mt-6 rounded-md border-[3px] border-aa-ink bg-aa-paper p-5 shadow-pop">
      <h2 className="font-display text-xl uppercase">{title}</h2>
      <div className="mt-4 space-y-3">
        {rows.map((s, i) => (
          <div key={i} className="grid grid-cols-1 gap-2 md:grid-cols-[1fr_120px_2fr]">
            <input
              type="text"
              value={s.value}
              onChange={(e) => update(group, i, { value: e.target.value })}
              className="rounded-md border-2 border-aa-ink p-2"
              placeholder="Valeur"
            />
            <input
              type="text"
              value={s.suffix}
              onChange={(e) => update(group, i, { suffix: e.target.value })}
              className="rounded-md border-2 border-aa-ink p-2"
              placeholder="Suffixe"
            />
            <input
              type="text"
              value={s.label}
              onChange={(e) => update(group, i, { label: e.target.value })}
              className="rounded-md border-2 border-aa-ink p-2"
              placeholder="Libellé"
            />
          </div>
        ))}
      </div>
    </div>
  )
}

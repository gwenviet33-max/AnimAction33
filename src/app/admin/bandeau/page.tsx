'use client'

import { useEffect, useState } from 'react'
import { aaStore, STORE_DEFAULTS } from '@/lib/store'
import { showToast } from '@/lib/utils'

export default function BandeauAdmin() {
  const [data, setData] = useState(STORE_DEFAULTS.bandeau)

  useEffect(() => {
    setData(aaStore.get('bandeau'))
  }, [])

  const save = () => {
    aaStore.set('bandeau', data)
    showToast('💾 Bandeau sauvegardé')
  }

  return (
    <div>
      <h1 className="font-display text-3xl uppercase md:text-4xl">Bandeau d'annonce</h1>

      <div className="mt-6 max-w-xl rounded-md border-[3px] border-aa-ink bg-aa-paper p-6 shadow-pop">
        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={data.actif}
            onChange={(e) => setData({ ...data, actif: e.target.checked })}
            className="h-5 w-5"
          />
          <span className="font-bold">Bandeau actif</span>
        </label>

        <label className="mt-4 block">
          <span className="text-xs font-bold uppercase">Texte</span>
          <input
            type="text"
            value={data.texte}
            onChange={(e) => setData({ ...data, texte: e.target.value })}
            className="mt-1 w-full rounded-md border-2 border-aa-ink p-2"
          />
        </label>

        <label className="mt-3 block">
          <span className="text-xs font-bold uppercase">Lien (optionnel)</span>
          <input
            type="text"
            placeholder="/contact"
            value={data.lien}
            onChange={(e) => setData({ ...data, lien: e.target.value })}
            className="mt-1 w-full rounded-md border-2 border-aa-ink p-2"
          />
        </label>

        <div className="mt-6 rounded-md border-2 border-dashed border-aa-ink/30 p-4">
          <p className="mb-2 text-xs font-bold uppercase text-aa-ink/60">Aperçu</p>
          <div className={'rounded-md py-2 text-center font-bold text-white ' + (data.actif ? 'bg-aa-red' : 'bg-aa-ink/30')}>
            {data.texte || '— vide —'}
          </div>
        </div>

        <button onClick={save} className="nb-btn nb-btn--red mt-6">
          💾 Enregistrer
        </button>
      </div>
    </div>
  )
}

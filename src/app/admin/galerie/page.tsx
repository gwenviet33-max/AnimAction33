'use client'

import { useState, useRef } from 'react'
import { showToast } from '@/lib/utils'

type Photo = { src: string; legende: string; categorie: string }

const CATS = ['Anniversaire', 'Mariage', 'EVG', 'Team Building', 'École', 'Autre']

export default function GalerieAdmin() {
  const [photos, setPhotos] = useState<Photo[]>(() => {
    if (typeof window === 'undefined') return []
    try {
      const raw = localStorage.getItem('aa_content:galerie')
      return raw ? (JSON.parse(raw) as Photo[]) : []
    } catch {
      return []
    }
  })
  const [filter, setFilter] = useState('Tous')
  const fileRef = useRef<HTMLInputElement>(null)

  const persist = (next: Photo[]) => {
    setPhotos(next)
    localStorage.setItem('aa_content:galerie', JSON.stringify(next))
  }

  const compress = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const img = new Image()
        img.onload = () => {
          const max = 1200
          let { width, height } = img
          if (width > max || height > max) {
            const r = Math.min(max / width, max / height)
            width *= r
            height *= r
          }
          const canvas = document.createElement('canvas')
          canvas.width = width
          canvas.height = height
          const ctx = canvas.getContext('2d')
          if (!ctx) return reject(new Error('canvas'))
          ctx.drawImage(img, 0, 0, width, height)
          resolve(canvas.toDataURL('image/jpeg', 0.8))
        }
        img.onerror = reject
        img.src = e.target?.result as string
      }
      reader.onerror = reject
      reader.readAsDataURL(file)
    })

  const upload = async (files: FileList | null) => {
    if (!files) return
    const compressed: Photo[] = []
    for (const file of Array.from(files)) {
      try {
        const src = await compress(file)
        compressed.push({ src, legende: file.name.replace(/\.[^.]+$/, ''), categorie: CATS[0] })
      } catch {}
    }
    persist([...compressed, ...photos])
    showToast(`📸 ${compressed.length} photo(s) ajoutée(s)`)
  }

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    upload(e.dataTransfer.files)
  }

  const remove = (i: number) => persist(photos.filter((_, j) => j !== i))

  const filtered = filter === 'Tous' ? photos : photos.filter((p) => p.categorie === filter)

  return (
    <div>
      <h1 className="font-display text-3xl uppercase md:text-4xl">Galerie</h1>
      <p className="mt-1 text-aa-ink/70">Glissez-déposez vos photos — compression automatique.</p>

      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
        className="mt-6 grid h-64 cursor-pointer place-items-center rounded-md border-[3px] border-dashed border-aa-ink bg-aa-cream text-center"
        onClick={() => fileRef.current?.click()}
      >
        <div>
          <div className="text-5xl">📁</div>
          <p className="mt-2 font-bold">Glissez vos photos ici ou cliquez pour parcourir</p>
          <p className="mt-1 text-sm text-aa-ink/60">JPEG, PNG · max 1200px · 80% quality</p>
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => upload(e.target.files)}
        />
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {['Tous', ...CATS].map((c) => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            className={
              'rounded-full border-[3px] border-aa-ink px-3 py-1 text-sm font-bold ' +
              (filter === c ? 'bg-aa-red text-white' : 'bg-white text-aa-ink')
            }
          >
            {c}
          </button>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
        {filtered.map((p, i) => (
          <div key={i} className="group relative aspect-square overflow-hidden rounded-md border-[3px] border-aa-ink shadow-pop-sm">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={p.src} alt={p.legende} className="h-full w-full object-cover" />
            <div className="absolute inset-0 grid place-items-center bg-black/0 transition group-hover:bg-black/60">
              <button
                onClick={() => remove(i)}
                className="opacity-0 group-hover:opacity-100 nb-btn nb-btn--red"
                style={{ padding: '0.4rem 0.9rem', fontSize: '0.85rem' }}
              >
                Supprimer
              </button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="col-span-full text-center text-aa-ink/60">Aucune photo dans cette catégorie.</p>
        )}
      </div>
    </div>
  )
}

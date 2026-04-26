import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Galerie — photos d\'événements',
  description: 'Aperçu des animations AnimAction33 : anniversaires, mariages, EVG, team building, écoles.',
}

const PLACEHOLDERS = [
  { c: '#FFC91F', e: '🎂', l: 'Anniversaire' },
  { c: '#1C5FD8', e: '💍', l: 'Mariage' },
  { c: '#E8252C', e: '🥂', l: 'EVG' },
  { c: '#0F1B3D', e: '🏢', l: 'Team Building' },
  { c: '#FFC91F', e: '🎯', l: 'Grands jeux' },
  { c: '#1C5FD8', e: '🏫', l: 'École' },
  { c: '#E8252C', e: '🎤', l: 'Karaoké' },
  { c: '#0F1B3D', e: '🏝️', l: 'Koh-Lanta' },
]

export default function GalleryPage() {
  return (
    <>
      <section className="bg-aa-cream py-20 md:py-24">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <span className="nb-pill">📸 Galerie</span>
          <h1 className="mt-6 font-display uppercase leading-[0.95]" style={{ fontSize: 'clamp(44px, 7vw, 80px)' }}>
            Quelques <span className="accent-red">moments</span>
          </h1>
        </div>
      </section>
      <section className="bg-white py-16">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-4 px-5 md:grid-cols-4 md:px-8">
          {PLACEHOLDERS.map((p, i) => (
            <div
              key={i}
              className="aspect-square rounded-md border-[3px] border-aa-ink shadow-pop-sm"
              style={{ background: p.c }}
            >
              <div className="grid h-full place-items-center text-center text-white">
                <div>
                  <div className="text-5xl">{p.e}</div>
                  <div className="mt-2 font-display text-sm uppercase">{p.l}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <p className="mx-auto mt-10 max-w-md text-center text-aa-ink/60">
          La galerie photo est en cours de constitution — les premières photos d'événements seront ajoutées prochainement.
        </p>
      </section>
    </>
  )
}

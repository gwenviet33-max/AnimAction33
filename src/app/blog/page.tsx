import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Blog — conseils événement & animation',
  description: 'Conseils pratiques pour organiser anniversaires, mariages, team building et événements en Gironde.',
}

const POSTS = [
  { slug: 'organiser-anniversaire-koh-lanta', title: 'Comment organiser un anniversaire Koh-Lanta', excerpt: 'Le pas-à-pas pour transformer un jardin en arène d\'aventure.' },
  { slug: 'evg-evf-libourne-bordeaux', title: 'EVG / EVF à Libourne et Bordeaux : 5 idées', excerpt: 'Au-delà du karting et de la dégustation, des animations qui marquent.' },
  { slug: 'team-building-petite-equipe', title: 'Team building pour petite équipe (5-15 pers)', excerpt: 'Quels formats fonctionnent vraiment quand on est peu nombreux.' },
]

export default function BlogIndex() {
  return (
    <>
      <section className="bg-aa-cream py-20 md:py-24">
        <div className="mx-auto max-w-5xl px-5 md:px-8">
          <span className="nb-pill">✍️ Blog</span>
          <h1 className="mt-6 font-display uppercase leading-[0.95]" style={{ fontSize: 'clamp(44px, 7vw, 80px)' }}>
            Conseils & <span className="accent-red">idées</span>
          </h1>
        </div>
      </section>
      <section className="bg-white py-16">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-5 md:grid-cols-3 md:px-8">
          {POSTS.map((p) => (
            <Link key={p.slug} href={`/blog/${p.slug}`} className="nb-card block p-6">
              <h2 className="font-display text-xl uppercase">{p.title}</h2>
              <p className="mt-2 text-aa-ink/70">{p.excerpt}</p>
              <span className="mt-4 inline-block font-bold text-aa-red">Lire →</span>
            </Link>
          ))}
        </div>
      </section>
    </>
  )
}

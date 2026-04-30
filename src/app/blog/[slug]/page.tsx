import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

const POSTS: Record<string, { title: string; intro: string; body: string[] }> = {
  'organiser-anniversaire-koh-lanta': {
    title: 'Comment organiser un anniversaire Koh-Lanta',
    intro: 'Le pas-à-pas pour transformer un jardin (ou un parc public) en arène d\'aventure.',
    body: [
      "Choisir un thème accrocheur (jungle, île déserte, pirates) et adapter au nombre d'enfants.",
      "Préparer 4 à 6 ateliers tournants : adresse, équilibre, énigme, mémoire.",
      "Constituer 2 à 4 équipes équilibrées pour favoriser la coopération.",
      "Prévoir un final fort : poteaux, totem, photo de groupe.",
    ],
  },
  'evg-evf-libourne-bordeaux': {
    title: 'EVG / EVF à Libourne et Bordeaux : 5 idées',
    intro: 'Au-delà du karting et de la dégustation, des animations qui marquent vraiment.',
    body: [
      'Koh-Lanta adulte au bord du lac.',
      "City game urbain à Saint-Émilion ou Bordeaux centre.",
      "Murder party privatisée dans un château.",
      "Pékin Express version vignoble.",
      "Soirée enquête + dîner mystère.",
    ],
  },
  'team-building-petite-equipe': {
    title: 'Team building pour petite équipe (5-15 pers)',
    intro: 'Quels formats fonctionnent vraiment quand on est peu nombreux.',
    body: [
      "Escape game scénarisé : court, intense, valorise la communication.",
      "Olympiades 'maison' avec 4 ateliers tournants.",
      "Atelier coopératif (construction, cuisine, énigmes).",
      "Le format 'mini-Murder Party' fonctionne très bien à partir de 6.",
    ],
  },
}

export function generateStaticParams() {
  return Object.keys(POSTS).map((slug) => ({ slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const post = POSTS[params.slug]
  if (!post) return {}
  return { title: post.title, description: post.intro }
}

export default function BlogPost({ params }: { params: { slug: string } }) {
  const post = POSTS[params.slug]
  if (!post) return notFound()

  return (
    <>
      <section className="bg-aa-cream py-20">
        <div className="mx-auto max-w-3xl px-5 md:px-8">
          <Link href="/blog" className="text-sm font-bold text-aa-blue">
            ← Tous les articles
          </Link>
          <h1 className="mt-4 font-display uppercase leading-[0.95]" style={{ fontSize: 'clamp(36px, 6vw, 60px)' }}>
            {post.title}
          </h1>
          <p className="mt-4 text-lg text-aa-ink/80">{post.intro}</p>
        </div>
      </section>
      <section className="bg-white py-16">
        <div className="mx-auto max-w-3xl px-5 md:px-8">
          <ul className="space-y-3 text-aa-ink/80">
            {post.body.map((para, i) => (
              <li key={i} className="rounded-md border-2 border-aa-ink/20 bg-aa-paper p-4">
                {para}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}

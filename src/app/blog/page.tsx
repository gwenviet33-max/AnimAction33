import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getContent } from '@/lib/content-server'

export const metadata: Metadata = {
  title: 'Blog — conseils événement & animation',
  description:
    'Conseils pratiques pour organiser anniversaires, mariages, team building et événements en Gironde.',
}

export default async function BlogIndex() {
  const blog = await getContent('blog')
  if (!blog.enabled) notFound()

  const posts = blog.posts.filter((p) => p.published)

  return (
    <>
      <section className="bg-aa-cream py-20 md:py-24">
        <div className="mx-auto max-w-5xl px-5 md:px-8">
          <span className="nb-pill">✍️ Blog</span>
          <h1
            className="mt-6 font-display uppercase leading-[0.95]"
            style={{ fontSize: 'clamp(44px, 7vw, 80px)' }}
          >
            Conseils & <span className="accent-red">idées</span>
          </h1>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          {posts.length === 0 ? (
            <p className="mx-auto max-w-md text-center text-aa-ink/60">
              Aucun article publié pour le moment — revenez bientôt.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {posts.map((p) => (
                <Link key={p.slug} href={`/blog/${p.slug}`} className="nb-card block p-6">
                  <h2 className="font-display text-xl uppercase">{p.title}</h2>
                  <p className="mt-2 text-aa-ink/70">{p.intro}</p>
                  <span className="mt-4 inline-block font-bold text-aa-red">Lire →</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}

import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getContent } from '@/lib/content-server'

export async function generateStaticParams() {
  // Blog is dynamic content — no static params at build time. Pages are
  // rendered on-demand via ISR.
  return []
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const blog = await getContent('blog')
  if (!blog.enabled) return {}
  const post = blog.posts.find((p) => p.slug === params.slug && p.published)
  if (!post) return {}
  return { title: post.title, description: post.intro }
}

export default async function BlogPost({ params }: { params: { slug: string } }) {
  const blog = await getContent('blog')
  if (!blog.enabled) notFound()

  const post = blog.posts.find((p) => p.slug === params.slug && p.published)
  if (!post) notFound()

  const paragraphs = post.body
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean)

  return (
    <>
      <section className="bg-aa-cream py-20">
        <div className="mx-auto max-w-3xl px-5 md:px-8">
          <Link href="/blog" className="text-sm font-bold text-aa-blue">
            ← Tous les articles
          </Link>
          <h1
            className="mt-4 font-display uppercase leading-[0.95]"
            style={{ fontSize: 'clamp(36px, 6vw, 60px)' }}
          >
            {post.title}
          </h1>
          <p className="mt-4 text-lg text-aa-ink/80">{post.intro}</p>
        </div>
      </section>
      <section className="bg-white py-16">
        <div className="mx-auto max-w-3xl px-5 md:px-8">
          <ul className="space-y-3 text-aa-ink/80">
            {paragraphs.map((para, i) => (
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

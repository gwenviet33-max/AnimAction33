import type { MetadataRoute } from 'next'
import { getContent } from '@/lib/content-server'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://animaction33.netlify.app'

const STATIC_ROUTES: { path: string; priority: number }[] = [
  { path: '/', priority: 1 },
  { path: '/prestations', priority: 0.9 },
  { path: '/contact', priority: 0.9 },
  { path: '/a-propos', priority: 0.7 },
  { path: '/galerie', priority: 0.7 },
  { path: '/temoignages', priority: 0.7 },
  { path: '/faq', priority: 0.7 },
  { path: '/mentions-legales', priority: 0.3 },
  { path: '/cgv', priority: 0.3 },
  { path: '/politique-confidentialite', priority: 0.3 },
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const prestations = await getContent('prestations')
  const blog = await getContent('blog')

  const items: MetadataRoute.Sitemap = STATIC_ROUTES.map((r) => ({
    url: `${SITE_URL}${r.path}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: r.priority,
  }))

  // Only include active prestation pages
  for (const p of prestations.filter((x) => x.active)) {
    items.push({
      url: `${SITE_URL}${p.href}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    })
  }

  // Blog: only if globally enabled, and only published articles
  if (blog.enabled) {
    items.push({
      url: `${SITE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    })
    for (const post of blog.posts.filter((p) => p.published)) {
      items.push({
        url: `${SITE_URL}/blog/${post.slug}`,
        lastModified: new Date(post.date),
        changeFrequency: 'monthly',
        priority: 0.5,
      })
    }
  }

  return items
}

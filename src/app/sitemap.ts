import type { MetadataRoute } from 'next'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://animaction33.netlify.app'

const ROUTES: { path: string; priority: number }[] = [
  { path: '/', priority: 1 },
  { path: '/prestations', priority: 0.9 },
  { path: '/prestations/anniversaires', priority: 0.9 },
  { path: '/prestations/mariages', priority: 0.9 },
  { path: '/prestations/evg-evf', priority: 0.9 },
  { path: '/prestations/team-building', priority: 0.9 },
  { path: '/prestations/grands-jeux', priority: 0.9 },
  { path: '/prestations/ecoles-loisirs', priority: 0.9 },
  { path: '/contact', priority: 0.9 },
  { path: '/a-propos', priority: 0.7 },
  { path: '/galerie', priority: 0.7 },
  { path: '/temoignages', priority: 0.7 },
  { path: '/faq', priority: 0.7 },
  { path: '/blog', priority: 0.6 },
  { path: '/mentions-legales', priority: 0.3 },
  { path: '/cgv', priority: 0.3 },
  { path: '/politique-confidentialite', priority: 0.3 },
]

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map((r) => ({
    url: `${SITE_URL}${r.path}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: r.priority,
  }))
}

import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Mentions légales' }

export default function MentionsLegalesPage() {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-3xl px-5 md:px-8 prose prose-neutral">
        <h1 className="font-display text-4xl uppercase">Mentions légales</h1>
        <h2>Éditeur du site</h2>
        <p>AnimAction33 — SIRET 99048354700016 — Libourne (33500). Contact : contact@animaction33.fr.</p>
        <h2>Hébergeur</h2>
        <p>Netlify, Inc. — 44 Montgomery Street, Suite 300, San Francisco, CA 94104, USA.</p>
        <h2>Propriété intellectuelle</h2>
        <p>L'ensemble des contenus du site (textes, photos, logo) est protégé par le droit d'auteur.</p>
      </div>
    </section>
  )
}

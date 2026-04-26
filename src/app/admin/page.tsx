'use client'

import Link from 'next/link'
import { useStoreSection } from '@/lib/store'

const QUICK_ACTIONS = [
  { href: '/admin/tarifs', label: 'Modifier les tarifs', emoji: '💰', bg: '#FFC91F', text: '#0F1B3D' },
  { href: '/admin/temoignages', label: 'Ajouter un témoignage', emoji: '💬', bg: '#1C5FD8', text: '#fff' },
  { href: '/admin/galerie', label: 'Charger des photos', emoji: '🖼️', bg: '#E8252C', text: '#fff' },
  { href: '/admin/bandeau', label: 'Activer un bandeau', emoji: '📣', bg: '#0F1B3D', text: '#FFC91F' },
  { href: '/admin/prestations', label: 'Activer/désactiver une prestation', emoji: '🎯', bg: '#FDE3E4', text: '#0F1B3D' },
  { href: '/admin/parametres', label: 'Mettre à jour les contacts', emoji: '⚙️', bg: '#DAF0DE', text: '#0F1B3D' },
]

export default function AdminDashboard() {
  const testimonials = useStoreSection('testimonials')
  const prestations = useStoreSection('prestations')

  const visibleTestimonials = testimonials.filter((t) => t.affiche).length
  const activePrestations = prestations.filter((p) => p.active).length

  return (
    <div>
      <h1 className="font-display text-3xl uppercase md:text-4xl">Bienvenue Gwen 👋</h1>
      <p className="mt-2 text-aa-ink/70">Vue d'ensemble du contenu du site.</p>

      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        <Stat n={visibleTestimonials} l="Témoignages affichés" bg="#FFC91F" />
        <Stat n={activePrestations} l="Prestations actives" bg="#1C5FD8" text="#fff" />
        <Stat n={'—'} l="Photos en galerie" bg="#E8252C" text="#fff" />
        <Stat n={'OK'} l="Store synchronisé" bg="#0F1B3D" text="#FFC91F" />
      </div>

      <h2 className="mt-12 font-display text-2xl uppercase">Actions rapides</h2>
      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
        {QUICK_ACTIONS.map((a) => (
          <Link
            key={a.href}
            href={a.href}
            className="rounded-md border-[3px] border-aa-ink p-5 shadow-pop transition hover:-translate-x-1 hover:-translate-y-1 hover:shadow-pop-lg"
            style={{ background: a.bg, color: a.text }}
          >
            <div className="text-3xl">{a.emoji}</div>
            <p className="mt-3 font-bold">{a.label}</p>
          </Link>
        ))}
      </div>

      <div className="mt-12 rounded-md border-[3px] border-aa-ink bg-aa-cream p-6 shadow-pop">
        <h3 className="font-display text-xl uppercase">💡 Conseil du jour</h3>
        <p className="mt-2 text-aa-ink/80">
          Demandez systématiquement un avis Google après chaque prestation — c'est le levier n°1 pour le référencement local.
          Template prêt dans <Link href="/admin/temoignages" className="font-bold text-aa-blue">Témoignages</Link>.
        </p>
      </div>
    </div>
  )
}

function Stat({ n, l, bg, text = '#0F1B3D' }: { n: number | string; l: string; bg: string; text?: string }) {
  return (
    <div
      className="rounded-md border-[3px] border-aa-ink p-5 shadow-pop"
      style={{ background: bg, color: text }}
    >
      <div className="font-display text-3xl">{n}</div>
      <div className="mt-1 text-sm font-bold uppercase tracking-wide opacity-80">{l}</div>
    </div>
  )
}

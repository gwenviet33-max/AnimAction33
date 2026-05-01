import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { AdminLogout } from '@/components/admin/AdminLogout'
import { AutoMigrate } from '@/components/admin/AutoMigrate'

export const metadata: Metadata = {
  title: 'Admin · AnimAction33',
  robots: { index: false, follow: false },
}

const NAV = [
  { href: '/admin', label: '🏠 Tableau de bord' },
  { href: '/admin/tarifs', label: '💰 Tarifs & prix' },
  { href: '/admin/bandeau', label: '📣 Bandeau' },
  { href: '/admin/temoignages', label: '💬 Témoignages' },
  { href: '/admin/galerie', label: '🖼️ Galerie' },
  { href: '/admin/coupons', label: '🎁 Bons de réduction' },
  { href: '/admin/prestations', label: '🎯 Prestations' },
  { href: '/admin/stats', label: '📊 Stats & chiffres' },
  { href: '/admin/parametres', label: '⚙️ Paramètres' },
  { href: '/admin/migration', label: '🚚 Migration localStorage' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-aa-paper">
      <AutoMigrate />
      <div className="flex min-h-screen flex-col md:flex-row">
        <aside className="md:w-60 md:shrink-0 bg-aa-ink text-aa-paper">
          <div className="border-b border-aa-paper/15 p-5">
            <Link href="/admin" className="flex items-center gap-2">
              <Image
                src="/logo-final.png"
                alt="AnimAction33"
                width={42}
                height={42}
                className="h-10 w-10 rounded-full border-2 border-aa-paper object-cover"
              />
              <span className="font-display text-sm uppercase">AnimAction33</span>
              <span className="rounded-full border-2 border-aa-paper bg-aa-red px-2 py-0.5 text-[10px] font-bold uppercase text-white">
                Admin
              </span>
            </Link>
          </div>
          <nav className="flex flex-col gap-1 p-3">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className="rounded-md border-2 border-transparent px-3 py-2 text-sm font-bold text-aa-paper/85 transition hover:border-aa-yellow hover:bg-aa-yellow/10 hover:text-aa-yellow"
              >
                {n.label}
              </Link>
            ))}
          </nav>
          <div className="mt-6 border-t border-aa-paper/15 p-3">
            <Link href="/" className="block rounded-md px-3 py-2 text-sm text-aa-paper/70 hover:text-aa-yellow">
              Voir le site ↗
            </Link>
            <AdminLogout />
          </div>
        </aside>

        <main className="flex-1 p-6 md:p-10">{children}</main>
      </div>
    </div>
  )
}

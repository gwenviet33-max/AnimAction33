'use client'

import Link from 'next/link'
import { useStoreSection } from '@/lib/store'

export function Bandeau() {
  const bandeau = useStoreSection('bandeau')
  if (!bandeau.actif) return null
  return (
    <Link
      href={bandeau.lien || '/contact'}
      className="block bg-aa-red py-2 text-center font-bold text-white"
    >
      {bandeau.texte}
    </Link>
  )
}

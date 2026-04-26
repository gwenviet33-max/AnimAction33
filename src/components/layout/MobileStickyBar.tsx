'use client'

import Link from 'next/link'
import { aaStore } from '@/lib/store'

export function MobileStickyBar() {
  const number = aaStore.DEFAULTS.contact.whatsapp
  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 grid grid-cols-3 border-t-4 border-aa-yellow bg-aa-ink md:hidden">
      <a
        href="tel:+33677243675"
        className="flex items-center justify-center gap-2 py-3 font-bold text-white"
        style={{ background: '#1C5FD8' }}
      >
        📞 Appeler
      </a>
      <a
        href={`https://wa.me/${number}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 py-3 font-bold text-white"
        style={{ background: '#25D366' }}
      >
        💬 WhatsApp
      </a>
      <Link
        href="/contact"
        className="flex items-center justify-center gap-2 py-3 font-bold text-white"
        style={{ background: '#E8252C' }}
      >
        📋 Devis
      </Link>
    </div>
  )
}

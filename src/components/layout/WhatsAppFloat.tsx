'use client'

import { useState } from 'react'
import { aaStore } from '@/lib/store'

export function WhatsAppFloat() {
  const [open, setOpen] = useState(false)
  const [msg, setMsg] = useState(
    "Bonjour Gwen ! Je suis intéressé(e) par une animation, pouvez-vous me rappeler ?"
  )
  const number = aaStore.DEFAULTS.contact.whatsapp
  const link = `https://wa.me/${number}?text=${encodeURIComponent(msg)}`

  return (
    <>
      <button
        aria-label="WhatsApp"
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-6 right-6 z-40 flex h-16 w-16 items-center justify-center rounded-full border-[3px] border-aa-ink shadow-pop md:bottom-8 md:right-8"
        style={{ background: '#25D366' }}
      >
        <span
          className="absolute inset-0 animate-pulse-ring rounded-full"
          style={{ background: '#25D36633', boxShadow: '0 0 0 4px #25D36633' }}
          aria-hidden
        />
        <span className="relative text-2xl">💬</span>
      </button>

      {open && (
        <div className="fixed bottom-24 right-6 z-40 w-[300px] rounded-md border-[3px] border-aa-ink bg-aa-paper p-4 shadow-pop md:bottom-28 md:right-8">
          <h4 className="font-display text-lg uppercase">Discutons sur WhatsApp</h4>
          <textarea
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            rows={4}
            className="mt-2 w-full rounded-md border-2 border-aa-ink bg-white p-2 text-sm focus:outline-none"
          />
          <a href={link} target="_blank" rel="noopener noreferrer" className="nb-btn nb-btn--red mt-3 w-full">
            Envoyer →
          </a>
        </div>
      )}
    </>
  )
}

'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { fireConfetti, showToast } from '@/lib/utils'

const NAV = [
  { href: '/prestations', label: 'Prestations' },
  { href: '/galerie', label: 'Galerie' },
  { href: '/a-propos', label: 'À propos' },
  { href: '/contact', label: 'Contact' },
]

export function Header() {
  const [shrunk, setShrunk] = useState(false)
  const [open, setOpen] = useState(false)
  const clicks = useRef(0)
  const clickTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const onScroll = () => setShrunk(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleLogoClick = () => {
    clicks.current += 1
    if (clickTimer.current) clearTimeout(clickTimer.current)
    if (clicks.current >= 5) {
      fireConfetti(undefined, undefined, 40)
      showToast('🐵 Bien joué 😉')
      clicks.current = 0
    }
    clickTimer.current = setTimeout(() => (clicks.current = 0), 1500)
  }

  return (
    <header
      className={
        'sticky top-0 z-50 w-full border-b-4 border-aa-ink transition-all duration-200 ' +
        (shrunk ? 'bg-white/88 backdrop-blur-md' : 'bg-aa-yellow')
      }
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3 md:px-8">
        <Link
          href="/"
          onClick={handleLogoClick}
          className="flex items-center gap-3"
          data-logo-click
        >
          <Image
            src="/logo-final.png"
            alt="AnimAction33"
            width={58}
            height={58}
            priority
            className="h-12 w-12 rounded-full border-2 border-aa-ink object-cover md:h-[58px] md:w-[58px]"
          />
          <span className="font-display text-xl uppercase tracking-tight md:text-2xl">
            <span className="text-aa-blue">ANIM</span>
            <span className="text-aa-red">ACTION33</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group relative font-bold text-aa-ink transition-colors hover:text-aa-red"
            >
              {item.label}
              <span className="absolute -bottom-1 left-0 h-1 w-full origin-left scale-x-0 bg-aa-red transition-transform duration-200 group-hover:scale-x-100" />
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="tel:+33677243675"
            className="hidden font-bold text-aa-ink hover:text-aa-red md:block"
          >
            📞 06 77 24 36 75
          </a>
          <Link
            href="/contact"
            className="nb-btn nb-btn--red hidden md:inline-flex"
            style={{ padding: '0.7rem 1.2rem', fontSize: '0.95rem' }}
          >
            Devis gratuit
          </Link>
          <button
            aria-label="Menu"
            className="nb-btn md:hidden"
            style={{ padding: '0.5rem 0.85rem', fontSize: '0.95rem' }}
            onClick={() => setOpen((v) => !v)}
          >
            ☰
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t-4 border-aa-ink bg-aa-paper md:hidden">
          <nav className="flex flex-col px-5 py-4">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="border-b border-aa-ink/10 py-3 font-bold"
              >
                {item.label}
              </Link>
            ))}
            <a
              href="tel:+33677243675"
              className="border-b border-aa-ink/10 py-3 font-bold text-aa-blue"
            >
              📞 06 77 24 36 75
            </a>
            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className="nb-btn nb-btn--red mt-3 w-full"
            >
              Devis gratuit
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}

'use client'

import Link from 'next/link'
import { useEffect } from 'react'

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <section className="grid min-h-[60vh] place-items-center bg-aa-cream px-5 py-16">
      <div className="max-w-md text-center">
        <div className="text-7xl">😬</div>
        <h2 className="mt-4 font-display text-3xl uppercase">Petit pépin</h2>
        <p className="mt-2 text-aa-ink/70">{error.message || 'Une erreur est survenue.'}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button onClick={reset} className="nb-btn nb-btn--red">
            Réessayer
          </button>
          <Link href="/" className="nb-btn">
            Retour à l'accueil
          </Link>
        </div>
      </div>
    </section>
  )
}

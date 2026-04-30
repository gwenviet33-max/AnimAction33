import Link from 'next/link'

export default function NotFound() {
  return (
    <section className="grid min-h-[60vh] place-items-center bg-aa-cream px-5 py-16">
      <div className="max-w-md text-center">
        <div className="font-display text-7xl text-aa-red">404</div>
        <h2 className="mt-3 font-display text-2xl uppercase">Page introuvable</h2>
        <p className="mt-2 text-aa-ink/70">
          Oups — cette page n'existe pas (ou plus). Retour à la maison ?
        </p>
        <Link href="/" className="nb-btn nb-btn--red mt-6 inline-flex">
          Retour à l'accueil
        </Link>
      </div>
    </section>
  )
}

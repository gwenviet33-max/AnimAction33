import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'CGV — Conditions générales de vente' }

export default function CGVPage() {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-3xl px-5 md:px-8 prose prose-neutral">
        <h1 className="font-display text-4xl uppercase">Conditions générales de vente</h1>
        <p>
          Les présentes CGV s'appliquent à toute prestation d'animation événementielle commandée auprès d'AnimAction33,
          micro-entreprise immatriculée sous le SIRET 99048354700016, dont le siège social est situé à Libourne (33500).
        </p>
        <h2>1. Devis et commande</h2>
        <p>Tout devis est valable 30 jours. La commande est ferme à réception d'un acompte de 30%.</p>
        <h2>2. Annulation</h2>
        <p>Annulation à plus de 30 jours : remboursement intégral. Moins de 30 jours : acompte conservé.</p>
        <h2>3. Responsabilité</h2>
        <p>AnimAction33 dispose d'une RC Pro. La responsabilité du client demeure pour les dommages causés par les participants.</p>
      </div>
    </section>
  )
}

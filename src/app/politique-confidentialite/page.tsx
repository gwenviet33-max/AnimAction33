import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Politique de confidentialité' }

export default function PrivacyPage() {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-3xl px-5 md:px-8 prose prose-neutral">
        <h1 className="font-display text-4xl uppercase">Politique de confidentialité</h1>
        <h2>Données collectées</h2>
        <p>Les données collectées via le formulaire de contact (nom, prénom, email, téléphone, message) sont utilisées uniquement pour traiter votre demande.</p>
        <h2>Conservation</h2>
        <p>Les données sont conservées pendant 3 ans après le dernier contact, puis supprimées.</p>
        <h2>Vos droits</h2>
        <p>Conformément au RGPD, vous disposez d'un droit d'accès, de rectification et de suppression. Contact : contact@animaction33.fr.</p>
        <h2>Cookies</h2>
        <p>Le site utilise uniquement des cookies techniques nécessaires au bon fonctionnement (session admin) et le stockage local pour les préférences d'affichage.</p>
      </div>
    </section>
  )
}

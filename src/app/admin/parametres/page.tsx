'use client'

import { useEffect, useState } from 'react'
import { aaStore, STORE_DEFAULTS } from '@/lib/store'
import { showToast } from '@/lib/utils'

export default function ParametresAdmin() {
  const [contact, setContact] = useState(STORE_DEFAULTS.contact)
  const [config, setConfig] = useState(STORE_DEFAULTS.config)

  useEffect(() => {
    aaStore.get('contact').then(setContact)
    aaStore.get('config').then(setConfig)
  }, [])

  const save = () => {
    aaStore.set('contact', contact)
    aaStore.set('config', config)
    showToast('💾 Paramètres sauvegardés')
  }

  const exportJson = async () => {
    const [stats, hero, marquee, prestations, games, testimonials, faq, bandeau, formules] =
      await Promise.all([
        aaStore.get('stats'),
        aaStore.get('hero'),
        aaStore.get('marquee'),
        aaStore.get('prestations'),
        aaStore.get('games'),
        aaStore.get('testimonials'),
        aaStore.get('faq'),
        aaStore.get('bandeau'),
        aaStore.get('formules'),
      ])
    const data = {
      stats,
      hero,
      marquee,
      prestations,
      games,
      testimonials,
      faq,
      contact,
      bandeau,
      config,
      formules,
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `animaction33-config-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const reset = () => {
    if (!confirm('Réinitialiser TOUTES les valeurs aux défauts ?')) return
    ;(Object.keys(STORE_DEFAULTS) as Array<keyof typeof STORE_DEFAULTS>).forEach((k) => aaStore.reset(k))
    setContact(STORE_DEFAULTS.contact)
    setConfig(STORE_DEFAULTS.config)
    showToast('↺ Tout réinitialisé')
  }

  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-3xl uppercase md:text-4xl">Paramètres</h1>

      <Section title="Informations générales">
        <Field label="Nom du site" value={config.siteName} on={(v) => setConfig({ ...config, siteName: v })} />
        <Field label="Baseline" value={config.baseline} on={(v) => setConfig({ ...config, baseline: v })} />
        <Field label="Téléphone (lisible)" value={contact.phone} on={(v) => setContact({ ...contact, phone: v })} />
        <Field label="Téléphone (raw)" value={contact.phone_raw} on={(v) => setContact({ ...contact, phone_raw: v })} />
        <Field label="Email" value={contact.email} on={(v) => setContact({ ...contact, email: v })} />
        <Field label="WhatsApp (international)" value={contact.whatsapp} on={(v) => setContact({ ...contact, whatsapp: v })} />
        <Field label="SIRET" value={config.siret} on={(v) => setConfig({ ...config, siret: v })} />
        <Field label="Zone" value={contact.zone} on={(v) => setContact({ ...contact, zone: v })} />
        <Field label="Délai devis" value={config.delaiDevis} on={(v) => setConfig({ ...config, delaiDevis: v })} />
      </Section>

      <Section title="Réseaux sociaux">
        <Field label="Instagram" value={config.instagram} on={(v) => setConfig({ ...config, instagram: v })} />
        <Field label="Facebook" value={config.facebook} on={(v) => setConfig({ ...config, facebook: v })} />
        <Field label="YouTube" value={config.youtube} on={(v) => setConfig({ ...config, youtube: v })} />
        <Field label="TikTok" value={config.tiktok} on={(v) => setConfig({ ...config, tiktok: v })} />
      </Section>

      <Section title="Google">
        <Field label="Lien Google Maps" value={config.googleMapsLink} on={(v) => setConfig({ ...config, googleMapsLink: v })} />
        <Field label="Lien avis Google" value={config.googleReviewLink} on={(v) => setConfig({ ...config, googleReviewLink: v })} />
      </Section>

      <div className="mt-8 flex flex-wrap gap-3">
        <button onClick={save} className="nb-btn nb-btn--red">
          💾 Enregistrer tout
        </button>
        <button onClick={exportJson} className="nb-btn nb-btn--blue">
          ⬇ Exporter en JSON
        </button>
        <button onClick={reset} className="nb-btn">
          ↺ Réinitialiser
        </button>
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-6 rounded-md border-[3px] border-aa-ink bg-aa-paper p-5 shadow-pop">
      <h2 className="font-display text-xl uppercase">{title}</h2>
      <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">{children}</div>
    </div>
  )
}

function Field({ label, value, on }: { label: string; value: string; on: (v: string) => void }) {
  return (
    <label className="block">
      <span className="text-xs font-bold uppercase">{label}</span>
      <input
        type="text"
        value={value}
        onChange={(e) => on(e.target.value)}
        className="mt-1 w-full rounded-md border-2 border-aa-ink p-2"
      />
    </label>
  )
}

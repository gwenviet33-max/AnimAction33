'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { fireConfetti } from '@/lib/utils'
import { useStoreSection } from '@/lib/store'

const Schema = z.object({
  type: z.string().min(1, 'Choisissez un type'),
  date: z.string().optional(),
  participants: z.string().optional(),
  lieu: z.string().optional(),
  budget: z.string().optional(),
  prenom: z.string().min(1, 'Prénom requis'),
  nom: z.string().optional(),
  telephone: z
    .string()
    .min(8, 'Téléphone invalide')
    .regex(/^[0-9 +()\-]+$/, 'Téléphone invalide'),
  email: z.string().email('Email invalide'),
  message: z.string().optional(),
  code: z.string().optional(),
  typeLabel: z.string().optional(),
  rgpd: z.literal(true, { errorMap: () => ({ message: 'Consentement requis' }) }),
})

type FormData = z.infer<typeof Schema>

const STEPS = ['Type', 'Détails', 'Coordonnées', 'Confirmation']

export function ContactForm() {
  const TYPES = useStoreSection('contactTypes')
  const [step, setStep] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [codeStatus, setCodeStatus] = useState<{ state: 'idle' | 'checking' | 'valid' | 'invalid'; reason?: string }>(
    { state: 'idle' }
  )
  const [couponStatus, setCouponStatus] = useState<'valid' | 'invalid' | 'none'>('none')

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(Schema),
    mode: 'onTouched',
  })

  const type = watch('type')
  const code = watch('code')

  useEffect(() => {
    if (typeof window === 'undefined') return
    const url = new URL(window.location.href)
    const fromUrl = url.searchParams.get('code')
    if (fromUrl) setValue('code', fromUrl)
  }, [setValue])

  useEffect(() => {
    const trimmed = (code || '').trim()
    if (!trimmed) {
      setCodeStatus({ state: 'idle' })
      return
    }
    setCodeStatus({ state: 'checking' })
    const controller = new AbortController()
    const t = setTimeout(async () => {
      try {
        const res = await fetch('/api/coupons/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code: trimmed }),
          signal: controller.signal,
        })
        const json = await res.json()
        if (json.valid) setCodeStatus({ state: 'valid' })
        else setCodeStatus({ state: 'invalid', reason: json.reason })
      } catch {}
    }, 400)
    return () => {
      clearTimeout(t)
      controller.abort()
    }
  }, [code])

  const next = async () => {
    let ok = true
    if (step === 0) ok = await trigger(['type'])
    if (step === 1) ok = true
    if (ok) setStep((s) => Math.min(s + 1, STEPS.length - 1))
  }
  const prev = () => setStep((s) => Math.max(0, s - 1))

  const onSubmit = async (data: FormData) => {
    setServerError(null)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const j = await res.json().catch(() => ({}))
      if (!res.ok) {
        throw new Error(j.error || 'Erreur serveur')
      }
      setCouponStatus(j.couponStatus || 'none')
      setSubmitted(true)
      fireConfetti(window.innerWidth / 2, window.innerHeight / 3, 120)
    } catch (e: any) {
      setServerError(e.message || 'Erreur inconnue')
    }
  }

  if (submitted) {
    return (
      <div className="rounded-md border-[3px] border-aa-ink bg-aa-yellow p-8 text-center shadow-pop">
        <div className="text-6xl">🎉</div>
        <h2 className="mt-3 font-display text-3xl uppercase">Demande reçue !</h2>
        <p className="mt-3 text-aa-ink/80">
          On revient vers vous sous 48h avec un devis détaillé. Merci !
        </p>
        {couponStatus === 'valid' && (
          <p className="mt-4 inline-block rounded-full border-[3px] border-aa-ink bg-aa-blue px-4 py-1.5 font-bold text-white">
            🎁 Code validé · -15€ dès 200€
          </p>
        )}
        {couponStatus === 'invalid' && (
          <p className="mt-4 inline-block rounded-full border-[3px] border-aa-ink bg-white px-4 py-1.5 text-sm text-aa-ink/70">
            Code non valide ou déjà utilisé — pas d'inquiétude, on traite votre demande quand même.
          </p>
        )}
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="rounded-md border-[3px] border-aa-ink bg-aa-paper p-6 shadow-pop md:p-8">
      <div className="mb-5 flex items-center gap-2">
        {STEPS.map((s, i) => (
          <div key={s} className="flex flex-1 items-center gap-2">
            <span
              className={
                'grid h-8 w-8 place-items-center rounded-full border-[3px] border-aa-ink font-display text-sm ' +
                (i <= step ? 'bg-aa-red text-white' : 'bg-white text-aa-ink')
              }
            >
              {i + 1}
            </span>
            {i < STEPS.length - 1 && <div className="h-1 flex-1 bg-aa-ink/20" />}
          </div>
        ))}
      </div>

      {step === 0 && (
        <div>
          <h2 className="font-display text-xl uppercase">1 · Type d'événement</h2>
          <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3">
            {TYPES.map((t) => (
              <button
                type="button"
                key={t.value}
                onClick={() => {
                  setValue('type', t.value, { shouldValidate: true })
                  setValue('typeLabel', t.label)
                }}
                className={
                  'rounded-md border-[3px] border-aa-ink p-4 text-center font-bold transition ' +
                  (type === t.value ? 'bg-aa-red text-white' : 'bg-white text-aa-ink hover:bg-aa-yellow')
                }
              >
                {t.label}
              </button>
            ))}
          </div>
          {errors.type && <p className="mt-2 text-sm text-aa-red">{errors.type.message}</p>}
          <input type="hidden" {...register('type')} />
        </div>
      )}

      {step === 1 && (
        <div>
          <h2 className="font-display text-xl uppercase">2 · Détails</h2>
          <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
            <label className="block">
              <span className="text-sm font-bold">Date envisagée</span>
              <input
                type="date"
                className="mt-1 w-full rounded-md border-2 border-aa-ink bg-white p-3"
                {...register('date')}
              />
            </label>
            <label className="block">
              <span className="text-sm font-bold">Participants</span>
              <input
                type="text"
                placeholder="Ex: 15 enfants"
                className="mt-1 w-full rounded-md border-2 border-aa-ink bg-white p-3"
                {...register('participants')}
              />
            </label>
            <label className="block">
              <span className="text-sm font-bold">Lieu</span>
              <input
                type="text"
                placeholder="Ville, code postal"
                className="mt-1 w-full rounded-md border-2 border-aa-ink bg-white p-3"
                {...register('lieu')}
              />
            </label>
            <label className="block">
              <span className="text-sm font-bold">Budget approximatif</span>
              <input
                type="text"
                placeholder="Ex: 250–400€"
                className="mt-1 w-full rounded-md border-2 border-aa-ink bg-white p-3"
                {...register('budget')}
              />
            </label>
            <label className="col-span-full block">
              <span className="text-sm font-bold">
                🎁 Code promo (optionnel — gagné via le mini-jeu)
              </span>
              <input
                type="text"
                placeholder="ANIM-XXXX-XXXX"
                className={
                  'mt-1 w-full rounded-md border-2 bg-white p-3 font-mono uppercase tracking-widest ' +
                  (codeStatus.state === 'valid'
                    ? 'border-emerald-600'
                    : codeStatus.state === 'invalid'
                      ? 'border-aa-red'
                      : 'border-aa-ink')
                }
                {...register('code')}
              />
              {codeStatus.state === 'checking' && (
                <p className="mt-1 text-xs text-aa-ink/60">Vérification…</p>
              )}
              {codeStatus.state === 'valid' && (
                <p className="mt-1 text-xs font-bold text-emerald-700">
                  ✓ Code valide — 15€ de réduction dès 200€ d'achat.
                </p>
              )}
              {codeStatus.state === 'invalid' && (
                <p className="mt-1 text-xs text-aa-red">
                  {codeStatus.reason === 'already_used'
                    ? 'Ce code a déjà été utilisé.'
                    : 'Code introuvable.'}
                </p>
              )}
            </label>
          </div>
        </div>
      )}

      {step === 2 && (
        <div>
          <h2 className="font-display text-xl uppercase">3 · Coordonnées</h2>
          <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
            <label className="block">
              <span className="text-sm font-bold">Prénom *</span>
              <input
                type="text"
                className="mt-1 w-full rounded-md border-2 border-aa-ink bg-white p-3"
                {...register('prenom')}
              />
              {errors.prenom && <p className="mt-1 text-sm text-aa-red">{errors.prenom.message}</p>}
            </label>
            <label className="block">
              <span className="text-sm font-bold">Nom</span>
              <input
                type="text"
                className="mt-1 w-full rounded-md border-2 border-aa-ink bg-white p-3"
                {...register('nom')}
              />
            </label>
            <label className="block">
              <span className="text-sm font-bold">Téléphone *</span>
              <input
                type="tel"
                className="mt-1 w-full rounded-md border-2 border-aa-ink bg-white p-3"
                {...register('telephone')}
              />
              {errors.telephone && <p className="mt-1 text-sm text-aa-red">{errors.telephone.message}</p>}
            </label>
            <label className="block">
              <span className="text-sm font-bold">Email *</span>
              <input
                type="email"
                className="mt-1 w-full rounded-md border-2 border-aa-ink bg-white p-3"
                {...register('email')}
              />
              {errors.email && <p className="mt-1 text-sm text-aa-red">{errors.email.message}</p>}
            </label>
          </div>
          <label className="mt-3 block">
            <span className="text-sm font-bold">Message</span>
            <textarea
              rows={4}
              className="mt-1 w-full rounded-md border-2 border-aa-ink bg-white p-3"
              {...register('message')}
            />
          </label>
          <label className="mt-4 flex items-start gap-2">
            <input type="checkbox" className="mt-1.5" {...register('rgpd')} />
            <span className="text-sm">
              J'accepte que mes données soient utilisées pour traiter ma demande de devis. Aucune publicité, aucune
              revente.
            </span>
          </label>
          {errors.rgpd && <p className="mt-1 text-sm text-aa-red">{errors.rgpd.message}</p>}
        </div>
      )}

      {step === 3 && (
        <div>
          <h2 className="font-display text-xl uppercase">4 · Confirmation</h2>
          <p className="mt-3 text-aa-ink/80">
            Vérifiez vos infos puis cliquez sur <strong>Envoyer</strong>. Vous recevrez une confirmation immédiate.
          </p>
          <div className="mt-4 rounded-md border-2 border-aa-ink bg-white p-4 text-sm">
            <div><strong>Type :</strong> {watch('type')}</div>
            <div><strong>Date :</strong> {watch('date') || '—'}</div>
            <div><strong>Lieu :</strong> {watch('lieu') || '—'}</div>
            <div><strong>Contact :</strong> {watch('prenom')} · {watch('telephone')} · {watch('email')}</div>
          </div>
          {serverError && <p className="mt-3 text-sm text-aa-red">⚠️ {serverError}</p>}
        </div>
      )}

      <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={prev}
          disabled={step === 0}
          className="nb-btn disabled:opacity-40"
        >
          ← Retour
        </button>
        {step < STEPS.length - 1 ? (
          <button type="button" onClick={next} className="nb-btn nb-btn--red">
            Suivant →
          </button>
        ) : (
          <button type="submit" disabled={isSubmitting} className="nb-btn nb-btn--red">
            {isSubmitting ? 'Envoi…' : 'Envoyer ma demande 🎉'}
          </button>
        )}
      </div>
    </form>
  )
}

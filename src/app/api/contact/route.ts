import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { z } from 'zod'

const Schema = z.object({
  type: z.string().min(1),
  date: z.string().optional(),
  participants: z.string().optional(),
  lieu: z.string().optional(),
  budget: z.string().optional(),
  prenom: z.string().min(1),
  nom: z.string().optional(),
  telephone: z.string().min(8),
  email: z.string().email(),
  message: z.string().optional(),
  rgpd: z.literal(true),
})

const TYPE_LABELS: Record<string, string> = {
  anniv: 'Anniversaire',
  mariage: 'Mariage',
  evg: 'EVG / EVF',
  team: 'Team Building',
  ecole: 'École / Loisirs',
  autre: 'Autre',
}

const renderEmail = (d: z.infer<typeof Schema>) => `
<div style="font-family: 'Helvetica Neue', sans-serif; background:#FFFDF6; padding:24px; color:#0F1B3D;">
  <h1 style="font-family:'Archivo Black', Arial Black, sans-serif; text-transform:uppercase; color:#E8252C;">Nouvelle demande</h1>
  <table cellpadding="6" style="border-collapse:collapse; font-size:14px;">
    <tr><td><b>Type</b></td><td>${TYPE_LABELS[d.type] || d.type}</td></tr>
    <tr><td><b>Date</b></td><td>${d.date || '—'}</td></tr>
    <tr><td><b>Participants</b></td><td>${d.participants || '—'}</td></tr>
    <tr><td><b>Lieu</b></td><td>${d.lieu || '—'}</td></tr>
    <tr><td><b>Budget</b></td><td>${d.budget || '—'}</td></tr>
    <tr><td><b>Contact</b></td><td>${d.prenom} ${d.nom || ''}</td></tr>
    <tr><td><b>Téléphone</b></td><td>${d.telephone}</td></tr>
    <tr><td><b>Email</b></td><td>${d.email}</td></tr>
    <tr><td valign="top"><b>Message</b></td><td>${(d.message || '').replace(/\n/g, '<br/>') || '—'}</td></tr>
  </table>
</div>
`

const renderClientEmail = (d: z.infer<typeof Schema>) => `
<div style="font-family: 'Helvetica Neue', sans-serif; background:#FFFDF6; padding:24px; color:#0F1B3D;">
  <h1 style="font-family:'Archivo Black', Arial Black, sans-serif; text-transform:uppercase; color:#1C5FD8;">Merci ${d.prenom} !</h1>
  <p>Votre demande de devis a bien été reçue. On revient vers vous sous 48h ouvrées avec une proposition détaillée.</p>
  <p>En attendant, vous pouvez nous joindre directement :</p>
  <ul>
    <li>📞 <a href="tel:+33677243675">06 77 24 36 75</a></li>
    <li>💬 <a href="https://wa.me/33677243675">WhatsApp</a></li>
  </ul>
  <p style="margin-top:24px; color:#0F1B3D;">À très vite,<br/><b>Gwen — AnimAction33</b></p>
</div>
`

export async function POST(request: Request) {
  const json = await request.json().catch(() => null)
  const parsed = Schema.safeParse(json)
  if (!parsed.success) {
    return NextResponse.json({ error: 'invalid', issues: parsed.error.issues }, { status: 400 })
  }
  const data = parsed.data

  const apiKey = process.env.RESEND_API_KEY
  const to = process.env.EMAIL_TO || 'contact@animaction33.fr'
  const from = process.env.EMAIL_FROM || 'AnimAction33 <noreply@animaction33.fr>'

  if (!apiKey) {
    console.warn('Contact form submitted but RESEND_API_KEY is missing')
    return NextResponse.json({ ok: true, queued: false, message: 'reçu (mode local)' })
  }

  try {
    const resend = new Resend(apiKey)
    await resend.emails.send({
      from,
      to,
      subject: `Demande ${TYPE_LABELS[data.type] || data.type} — ${data.prenom}`,
      html: renderEmail(data),
      replyTo: data.email,
    })
    await resend.emails.send({
      from,
      to: data.email,
      subject: 'Votre demande AnimAction33 — bien reçue',
      html: renderClientEmail(data),
    })
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    console.error('Resend error', e)
    return NextResponse.json({ error: 'send_failed', detail: e?.message }, { status: 500 })
  }
}

import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  let body: { password?: string } = {}
  try {
    body = await request.json()
  } catch {}

  const expected = process.env.ADMIN_PASSWORD
  if (!expected) {
    // Fail closed: if the env var isn't set, refuse all logins.
    // This prevents accidental open-admin if the variable is wiped.
    console.error('ADMIN_PASSWORD env var missing — refusing all admin logins')
    return NextResponse.json({ error: 'server_misconfigured' }, { status: 500 })
  }

  if (!body.password || body.password !== expected) {
    return NextResponse.json({ error: 'invalid' }, { status: 401 })
  }

  const res = NextResponse.json({ ok: true })
  res.cookies.set('aa_admin_session', 'authenticated', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  })
  return res
}

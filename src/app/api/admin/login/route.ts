import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  let body: { password?: string } = {}
  try {
    body = await request.json()
  } catch {}

  const expected = process.env.ADMIN_PASSWORD || 'dzha-zb34-7hk9'
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

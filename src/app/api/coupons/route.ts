import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { readCoupons, deleteCoupon, setCouponUsed } from '@/lib/coupons-server'

export const runtime = 'nodejs'

function isAuthed() {
  const session = cookies().get('aa_admin_session')
  return session?.value === 'authenticated'
}

export async function GET() {
  if (!isAuthed()) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  const list = await readCoupons()
  return NextResponse.json({ coupons: list.sort((a, b) => b.createdAt.localeCompare(a.createdAt)) })
}

export async function PATCH(request: Request) {
  if (!isAuthed()) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  let body: { code?: string; used?: boolean } = {}
  try {
    body = await request.json()
  } catch {}
  if (!body.code || typeof body.used !== 'boolean') {
    return NextResponse.json({ error: 'invalid' }, { status: 400 })
  }
  const ok = await setCouponUsed(body.code, body.used)
  if (!ok) return NextResponse.json({ error: 'not_found' }, { status: 404 })
  return NextResponse.json({ ok: true })
}

export async function DELETE(request: Request) {
  if (!isAuthed()) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  let body: { code?: string } = {}
  try {
    body = await request.json()
  } catch {}
  if (!body.code) return NextResponse.json({ error: 'invalid' }, { status: 400 })
  const ok = await deleteCoupon(body.code)
  if (!ok) return NextResponse.json({ error: 'not_found' }, { status: 404 })
  return NextResponse.json({ ok: true })
}

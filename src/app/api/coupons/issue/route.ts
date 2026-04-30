import { NextResponse } from 'next/server'
import { issueCoupon } from '@/lib/coupons-server'

export const runtime = 'nodejs'

function getIp(request: Request): string | null {
  const xff = request.headers.get('x-forwarded-for')
  if (xff) return xff.split(',')[0].trim()
  const real = request.headers.get('x-real-ip')
  if (real) return real
  return null
}

export async function POST(request: Request) {
  let body: { token?: string; perfect?: boolean } = {}
  try {
    body = await request.json()
  } catch {}

  if (!body.perfect) {
    return NextResponse.json({ error: 'must_be_perfect' }, { status: 400 })
  }

  try {
    const ip = getIp(request)
    const coupon = await issueCoupon(ip)
    return NextResponse.json({
      code: coupon.code,
      amount: coupon.amount,
      minOrder: coupon.minOrder,
      createdAt: coupon.createdAt,
    })
  } catch (e: any) {
    if (e?.message === 'rate_limited') {
      return NextResponse.json({ error: 'rate_limited' }, { status: 429 })
    }
    return NextResponse.json({ error: 'server_error' }, { status: 500 })
  }
}

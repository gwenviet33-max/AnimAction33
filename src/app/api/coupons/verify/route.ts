import { NextResponse } from 'next/server'
import { verifyCoupon } from '@/lib/coupons-server'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  let body: { code?: string } = {}
  try {
    body = await request.json()
  } catch {}

  if (!body.code) return NextResponse.json({ valid: false, reason: 'missing' }, { status: 400 })

  const result = await verifyCoupon(body.code)
  if (!result.valid) {
    return NextResponse.json({ valid: false, reason: result.reason || 'invalid' })
  }
  return NextResponse.json({
    valid: true,
    code: result.coupon!.code,
    amount: result.coupon!.amount,
    minOrder: result.coupon!.minOrder,
  })
}

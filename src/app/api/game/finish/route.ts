import { NextResponse } from 'next/server'
import { recordGameFinish } from '@/lib/game-server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function getIp(req: Request): string | null {
  const xff = req.headers.get('x-forwarded-for')
  if (xff) return xff.split(',')[0].trim()
  const real = req.headers.get('x-real-ip')
  if (real) return real
  return null
}

/**
 * Called by the mini-game when a session ends (won or lost).
 * Returns coupon eligibility (only granted on the FIRST attempt of the day per
 * IP, and only if won) plus a flag the client uses to ask for a leaderboard
 * pseudo if the time qualifies for top 10.
 */
export async function POST(req: Request) {
  let body: { won?: boolean; time?: number } = {}
  try {
    body = await req.json()
  } catch {}

  if (typeof body.won !== 'boolean' || typeof body.time !== 'number' || body.time < 0) {
    return NextResponse.json({ error: 'invalid_body' }, { status: 400 })
  }

  const ip = getIp(req)
  const result = await recordGameFinish(ip, body.won, body.time)

  return NextResponse.json({
    ...result,
    eligibleForLeaderboard: body.won && body.time >= 8000 && body.time <= 5 * 60 * 1000,
  })
}

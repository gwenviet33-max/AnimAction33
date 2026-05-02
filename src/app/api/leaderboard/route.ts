import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import {
  deleteLeaderboardEntry,
  getLeaderboard,
  submitLeaderboardEntry,
} from '@/lib/game-server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function getIp(req: Request): string | null {
  const xff = req.headers.get('x-forwarded-for')
  if (xff) return xff.split(',')[0].trim()
  return req.headers.get('x-real-ip')
}

function isAuthed() {
  return cookies().get('aa_admin_session')?.value === 'authenticated'
}

export async function GET() {
  const entries = await getLeaderboard()
  // Strip IPs from public response
  return NextResponse.json({
    entries: entries.map((e) => ({
      id: e.id,
      name: e.name,
      timeMs: e.timeMs,
      date: e.date,
    })),
  })
}

export async function POST(req: Request) {
  let body: { name?: string; time?: number } = {}
  try {
    body = await req.json()
  } catch {}

  if (typeof body.name !== 'string' || typeof body.time !== 'number') {
    return NextResponse.json({ error: 'invalid_body' }, { status: 400 })
  }

  const ip = getIp(req)
  const result = await submitLeaderboardEntry(ip, body.name, body.time)
  if (!result.ok) {
    const status =
      result.error === 'inappropriate' || result.error === 'name_too_short'
        ? 400
        : 422
    return NextResponse.json({ error: result.error }, { status })
  }
  return NextResponse.json({ ok: true })
}

export async function DELETE(req: Request) {
  if (!isAuthed()) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }
  let body: { id?: string } = {}
  try {
    body = await req.json()
  } catch {}
  if (!body.id) {
    return NextResponse.json({ error: 'invalid' }, { status: 400 })
  }
  const ok = await deleteLeaderboardEntry(body.id)
  if (!ok) {
    return NextResponse.json({ error: 'not_found' }, { status: 404 })
  }
  return NextResponse.json({ ok: true })
}

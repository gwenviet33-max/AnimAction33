import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getContent, setContent, isValidSection } from '@/lib/content-server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function isAuthed() {
  return cookies().get('aa_admin_session')?.value === 'authenticated'
}

export async function GET(
  _request: Request,
  { params }: { params: { section: string } }
) {
  if (!isValidSection(params.section)) {
    return NextResponse.json({ error: 'invalid_section' }, { status: 400 })
  }
  const value = await getContent(params.section)
  return NextResponse.json(
    { section: params.section, value },
    {
      headers: {
        // Short edge cache — admin updates use revalidateTag, but a CDN-friendly fallback helps
        'Cache-Control': 'public, max-age=10, stale-while-revalidate=60',
      },
    }
  )
}

export async function PUT(
  request: Request,
  { params }: { params: { section: string } }
) {
  if (!isAuthed()) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }
  if (!isValidSection(params.section)) {
    return NextResponse.json({ error: 'invalid_section' }, { status: 400 })
  }

  let body: { value?: unknown } = {}
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'invalid_body' }, { status: 400 })
  }
  if (!('value' in body)) {
    return NextResponse.json({ error: 'missing_value' }, { status: 400 })
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await setContent(params.section, body.value as any)
    return NextResponse.json({ ok: true })
  } catch (e: unknown) {
    console.error(`PUT /api/content/${params.section} failed:`, e)
    return NextResponse.json({ error: 'write_failed' }, { status: 500 })
  }
}

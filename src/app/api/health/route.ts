import { NextResponse } from 'next/server'
import { firebaseInitDiagnostic, getDb } from '@/lib/firebase-admin'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * Diagnostic endpoint. Returns whether Firestore is configured and reachable
 * from the Netlify function instance. No secret values are exposed — only
 * boolean flags.
 *
 * Open https://animaction33.fr/api/health to verify config.
 */
export async function GET() {
  const env = {
    FIREBASE_PROJECT_ID: !!process.env.FIREBASE_PROJECT_ID,
    FIREBASE_CLIENT_EMAIL: !!process.env.FIREBASE_CLIENT_EMAIL,
    FIREBASE_PRIVATE_KEY: !!process.env.FIREBASE_PRIVATE_KEY,
    ADMIN_PASSWORD: !!process.env.ADMIN_PASSWORD,
    RESEND_API_KEY: !!process.env.RESEND_API_KEY,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || null,
  }

  const db = getDb()
  let firestoreReachable = false
  let firestoreError: string | null = null
  let contentDocCount = 0
  if (db) {
    try {
      const snap = await db.collection('content').limit(20).get()
      firestoreReachable = true
      contentDocCount = snap.size
    } catch (e) {
      firestoreError = (e as Error).message
    }
  }

  const diag = firebaseInitDiagnostic()

  return NextResponse.json({
    ts: new Date().toISOString(),
    firestore: {
      configured: !!db,
      reachable: firestoreReachable,
      error: firestoreError,
      contentDocCount,
    },
    init: diag,
    env,
    backend: db ? 'firestore' : 'filesystem (NOT persistent on Netlify)',
  })
}

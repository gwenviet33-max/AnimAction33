import 'server-only'
import { cert, getApps, initializeApp } from 'firebase-admin/app'
import { getFirestore, type Firestore } from 'firebase-admin/firestore'

let _db: Firestore | null = null
let _initialized = false
let _initError: string | null = null
let _privateKeyDiag: { length: number; head: string; tail: string; hadLiteralBackslashN: boolean } | null = null

export function getDb(): Firestore | null {
  if (_initialized) return _db

  const projectId = process.env.FIREBASE_PROJECT_ID
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL
  const rawKey = process.env.FIREBASE_PRIVATE_KEY

  if (!projectId || !clientEmail || !rawKey) {
    _initialized = true
    _db = null
    _initError = `Missing env: ${!projectId ? 'FIREBASE_PROJECT_ID ' : ''}${!clientEmail ? 'FIREBASE_CLIENT_EMAIL ' : ''}${!rawKey ? 'FIREBASE_PRIVATE_KEY' : ''}`.trim()
    return null
  }

  const hadLiteralBackslashN = rawKey.includes('\\n')
  // Strip surrounding quotes if the user accidentally copied them from the JSON
  const cleanedKey = rawKey.replace(/^"+|"+$/g, '')
  const privateKey = cleanedKey.replace(/\\n/g, '\n')

  _privateKeyDiag = {
    length: privateKey.length,
    head: privateKey.slice(0, 30),
    tail: privateKey.slice(-30),
    hadLiteralBackslashN,
  }

  try {
    if (getApps().length === 0) {
      initializeApp({
        credential: cert({ projectId, clientEmail, privateKey }),
      })
    }
    _db = getFirestore()
    _db.settings({ ignoreUndefinedProperties: true })
  } catch (e) {
    const msg = (e as Error).message || String(e)
    console.error('Firebase Admin init failed:', msg)
    _initError = msg
    _db = null
  }
  _initialized = true
  return _db
}

export function isFirestoreEnabled() {
  return getDb() !== null
}

export function firebaseInitDiagnostic() {
  // Force init attempt so diagnostic fields are populated
  getDb()
  return {
    initError: _initError,
    privateKeyShape: _privateKeyDiag,
  }
}

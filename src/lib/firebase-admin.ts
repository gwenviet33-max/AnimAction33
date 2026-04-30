import 'server-only'
import { cert, getApps, initializeApp } from 'firebase-admin/app'
import { getFirestore, type Firestore } from 'firebase-admin/firestore'

let _db: Firestore | null = null
let _initialized = false

export function getDb(): Firestore | null {
  if (_initialized) return _db

  const projectId = process.env.FIREBASE_PROJECT_ID
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL
  const rawKey = process.env.FIREBASE_PRIVATE_KEY

  if (!projectId || !clientEmail || !rawKey) {
    _initialized = true
    _db = null
    return null
  }

  const privateKey = rawKey.replace(/\\n/g, '\n')

  try {
    if (getApps().length === 0) {
      initializeApp({
        credential: cert({ projectId, clientEmail, privateKey }),
      })
    }
    _db = getFirestore()
    _db.settings({ ignoreUndefinedProperties: true })
  } catch (e) {
    console.error('Firebase Admin init failed:', e)
    _db = null
  }
  _initialized = true
  return _db
}

export function isFirestoreEnabled() {
  return getDb() !== null
}

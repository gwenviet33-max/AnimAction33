import 'server-only'
import { promises as fs } from 'fs'
import path from 'path'
import { getDb } from './firebase-admin'

export type Coupon = {
  code: string
  amount: number
  minOrder: number
  createdAt: string
  used: boolean
  usedAt: string | null
  usedBy: string | null
  ip: string | null
}

const COLLECTION = 'coupons'
const DATA_DIR = path.join(process.cwd(), '.data')
const FILE = path.join(DATA_DIR, 'coupons.json')

async function ensureFile() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true })
    await fs.access(FILE)
  } catch {
    await fs.writeFile(FILE, '[]', 'utf8')
  }
}

async function fsRead(): Promise<Coupon[]> {
  await ensureFile()
  try {
    const raw = await fs.readFile(FILE, 'utf8')
    return JSON.parse(raw) as Coupon[]
  } catch {
    return []
  }
}

async function fsWrite(list: Coupon[]) {
  await ensureFile()
  await fs.writeFile(FILE, JSON.stringify(list, null, 2), 'utf8')
}

function randomSegment(len: number) {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let out = ''
  for (let i = 0; i < len; i++) {
    out += alphabet[Math.floor(Math.random() * alphabet.length)]
  }
  return out
}

export function generateCode() {
  return `ANIM-${randomSegment(4)}-${randomSegment(4)}`
}

export async function readCoupons(): Promise<Coupon[]> {
  const db = getDb()
  if (db) {
    const snap = await db.collection(COLLECTION).get()
    return snap.docs.map((d) => d.data() as Coupon)
  }
  return fsRead()
}

export async function writeCoupons(list: Coupon[]) {
  const db = getDb()
  if (db) {
    const batch = db.batch()
    const existing = await db.collection(COLLECTION).get()
    existing.forEach((doc) => batch.delete(doc.ref))
    list.forEach((c) => {
      batch.set(db.collection(COLLECTION).doc(c.code), c)
    })
    await batch.commit()
    return
  }
  await fsWrite(list)
}

async function findByCode(code: string): Promise<Coupon | null> {
  const norm = code.trim().toUpperCase()
  const db = getDb()
  if (db) {
    const doc = await db.collection(COLLECTION).doc(norm).get()
    return doc.exists ? (doc.data() as Coupon) : null
  }
  const list = await fsRead()
  return list.find((c) => c.code.toUpperCase() === norm) || null
}

async function persistCoupon(c: Coupon) {
  const db = getDb()
  if (db) {
    await db.collection(COLLECTION).doc(c.code).set(c)
    return
  }
  const list = await fsRead()
  const idx = list.findIndex((x) => x.code === c.code)
  if (idx >= 0) list[idx] = c
  else list.push(c)
  await fsWrite(list)
}

export async function issueCoupon(ip: string | null): Promise<Coupon> {
  const db = getDb()

  if (ip) {
    const since = Date.now() - 24 * 60 * 60 * 1000
    let recent = 0
    if (db) {
      const snap = await db.collection(COLLECTION).where('ip', '==', ip).get()
      recent = snap.docs.filter((d) => {
        const c = d.data() as Coupon
        return new Date(c.createdAt).getTime() > since
      }).length
    } else {
      const list = await fsRead()
      recent = list.filter((c) => c.ip === ip && new Date(c.createdAt).getTime() > since).length
    }
    if (recent >= 5) throw new Error('rate_limited')
  }

  let code = generateCode()
  while (await findByCode(code)) {
    code = generateCode()
  }

  const coupon: Coupon = {
    code,
    amount: 15,
    minOrder: 200,
    createdAt: new Date().toISOString(),
    used: false,
    usedAt: null,
    usedBy: null,
    ip,
  }
  await persistCoupon(coupon)
  return coupon
}

export async function verifyCoupon(
  code: string
): Promise<{ valid: boolean; coupon?: Coupon; reason?: string }> {
  const c = await findByCode(code)
  if (!c) return { valid: false, reason: 'not_found' }
  if (c.used) return { valid: false, reason: 'already_used', coupon: c }
  return { valid: true, coupon: c }
}

export async function redeemCoupon(code: string, usedBy: string): Promise<boolean> {
  const c = await findByCode(code)
  if (!c) return false
  if (c.used) return false
  const updated: Coupon = {
    ...c,
    used: true,
    usedAt: new Date().toISOString(),
    usedBy,
  }
  await persistCoupon(updated)
  return true
}

export async function setCouponUsed(code: string, used: boolean): Promise<boolean> {
  const c = await findByCode(code)
  if (!c) return false
  const updated: Coupon = {
    ...c,
    used,
    usedAt: used ? new Date().toISOString() : null,
    usedBy: used ? c.usedBy : null,
  }
  await persistCoupon(updated)
  return true
}

export async function deleteCoupon(code: string): Promise<boolean> {
  const norm = code.trim().toUpperCase()
  const db = getDb()
  if (db) {
    const ref = db.collection(COLLECTION).doc(norm)
    const doc = await ref.get()
    if (!doc.exists) return false
    await ref.delete()
    return true
  }
  const list = await fsRead()
  const next = list.filter((c) => c.code.toUpperCase() !== norm)
  if (next.length === list.length) return false
  await fsWrite(next)
  return true
}

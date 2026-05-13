import 'server-only'
import { getDb } from './firebase-admin'
import { issueCoupon, type Coupon } from './coupons-server'

const ATTEMPTS_COL = 'gameAttempts'
const LEADERBOARD_COL = 'leaderboard'
const MAX_LEADERBOARD_ENTRIES = 10
// Reasonable bounds for a Breakout-like game with the AnimAction33 layout:
// fastest realistic clear is ~15-25s, slowest acceptable ~5min.
const MIN_GAME_TIME_MS = 8000
const MAX_GAME_TIME_MS = 5 * 60 * 1000

export type LeaderboardEntry = {
  id: string
  name: string
  timeMs: number
  date: string
  ip: string
}

export type PublicLeaderboardEntry = {
  id: string
  name: string
  timeMs: number
  date: string
}

// Substring matching: triggers if any of these appears anywhere in the
// normalized pseudo. Reserved for unambiguous insults that have no chance of
// being a legitimate first-name substring.
const BAD_WORDS_SUBSTRING = [
  // FR
  'putain', 'merde', 'connard', 'connasse', 'salope', 'enculer', 'enculee',
  'enculé', 'enculée', 'niquer', 'enfoire', 'enfoiré', 'tarlouze', 'gouine',
  'batard', 'bâtard', 'pétasse', 'petasse', 'pédé', 'pede',
  // EN
  'fuck', 'shit', 'bitch', 'asshole', 'cunt', 'whore', 'slut', 'nigger',
  'faggot',
]

// Exact match (after normalization) — short or ambiguous words that would
// false-positive as substrings. The pseudo must equal one of these exactly.
const BAD_WORDS_EXACT = [
  'admin', 'admins', 'modo', 'modos', 'moderator', 'moderateur',
  'animaction', 'animaction33', 'animactin', 'root', 'system',
  'fdp', 'ntm', 'tg', 'pd', 'pute', 'putes',
  'nique', 'bite', 'couille', 'couilles',
]

function normalize(s: string) {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // strip combining diacritics
    .replace(/[^a-z0-9]/g, '')
}

export function containsBadWord(text: string): boolean {
  const n = normalize(text)
  if (!n) return false
  // Exact match
  if (BAD_WORDS_EXACT.some((w) => n === normalize(w))) return true
  // Substring match — only for unambiguous insults
  return BAD_WORDS_SUBSTRING.some((w) => n.includes(normalize(w)))
}

function todayKey() {
  // UTC YYYY-MM-DD — server-side definition of "today"
  return new Date().toISOString().slice(0, 10)
}

function attemptDocId(ip: string, date: string) {
  return `${ip}_${date}`.replace(/[^a-zA-Z0-9_-]/g, '_')
}

export type GameFinishResult = {
  isFirstAttemptToday: boolean
  wonOnFirstAttempt: boolean
  alreadyHasCouponToday: boolean
  coupon: Pick<Coupon, 'code' | 'amount' | 'minOrder'> | null
}

/**
 * Records a finished game attempt for the given IP. The first attempt of the
 * day per IP is the only one that can earn a coupon — and only if won. All
 * subsequent attempts are recorded but never trigger a new coupon.
 *
 * Time is informational here (the leaderboard endpoint does its own check).
 */
export async function recordGameFinish(
  ip: string | null,
  won: boolean,
  timeMs: number
): Promise<GameFinishResult> {
  if (!ip) {
    return {
      isFirstAttemptToday: false,
      wonOnFirstAttempt: false,
      alreadyHasCouponToday: false,
      coupon: null,
    }
  }

  const db = getDb()
  if (!db) {
    return {
      isFirstAttemptToday: true,
      wonOnFirstAttempt: won,
      alreadyHasCouponToday: false,
      coupon: null,
    }
  }

  const date = todayKey()
  const id = attemptDocId(ip, date)
  const ref = db.collection(ATTEMPTS_COL).doc(id)

  const snap = await ref.get()
  const isFirstAttemptToday = !snap.exists
  const data = snap.exists ? snap.data() : null
  const previouslyHadCoupon = !!data?.couponCode

  let couponData: Pick<Coupon, 'code' | 'amount' | 'minOrder'> | null = null
  let wonOnFirst = data?.wonOnFirstAttempt === true

  if (isFirstAttemptToday && won) {
    wonOnFirst = true
    try {
      const c = await issueCoupon(ip)
      couponData = { code: c.code, amount: c.amount, minOrder: c.minOrder }
    } catch {
      // rate-limited or other — record anyway, just no coupon
    }
  }

  const newAttempt = {
    ts: new Date().toISOString(),
    won,
    timeMs,
  }
  const existing = (data?.attempts as { ts: string; won: boolean; timeMs: number }[]) || []

  await ref.set({
    ip,
    date,
    attempts: [...existing, newAttempt],
    wonOnFirstAttempt: wonOnFirst,
    couponCode: data?.couponCode || couponData?.code || null,
    updatedAt: new Date().toISOString(),
  })

  return {
    isFirstAttemptToday,
    wonOnFirstAttempt: wonOnFirst,
    alreadyHasCouponToday: previouslyHadCoupon,
    coupon: couponData,
  }
}

export async function getLeaderboard(): Promise<LeaderboardEntry[]> {
  const db = getDb()
  if (!db) return []
  const snap = await db
    .collection(LEADERBOARD_COL)
    .orderBy('timeMs', 'asc')
    .limit(MAX_LEADERBOARD_ENTRIES)
    .get()
  return snap.docs.map((d) => ({
    id: d.id,
    name: (d.data().name as string) || '?',
    timeMs: (d.data().timeMs as number) || 0,
    date: (d.data().date as string) || '',
    ip: (d.data().ip as string) || '',
  }))
}

export type SubmitResult = { ok: boolean; error?: string }

/**
 * Submits a leaderboard entry. Validation:
 *  - Name 2-20 chars, no profanity / impersonation
 *  - Time within plausible bounds
 *  - Per-IP dedup: only the fastest entry from a given IP survives
 *  - Top-10 cap: entry must beat the slowest of the existing top 10
 */
export async function submitLeaderboardEntry(
  ip: string | null,
  name: string,
  timeMs: number
): Promise<SubmitResult> {
  if (!ip) return { ok: false, error: 'no_ip' }

  const trimmed = name.trim().slice(0, 20)
  if (trimmed.length < 2) return { ok: false, error: 'name_too_short' }
  if (containsBadWord(trimmed)) return { ok: false, error: 'inappropriate' }
  if (timeMs < MIN_GAME_TIME_MS || timeMs > MAX_GAME_TIME_MS) {
    return { ok: false, error: 'invalid_time' }
  }

  const db = getDb()
  if (!db) return { ok: false, error: 'no_db' }

  // Reject if this IP already has a faster (or equal) entry
  const existing = await db.collection(LEADERBOARD_COL).where('ip', '==', ip).get()
  for (const doc of existing.docs) {
    const t = (doc.data().timeMs as number) || Infinity
    if (t <= timeMs) {
      return { ok: false, error: 'slower_than_your_best' }
    }
  }

  // Reject if not fast enough for top 10
  const top = await getLeaderboard()
  if (top.length >= MAX_LEADERBOARD_ENTRIES) {
    const slowest = top[top.length - 1]
    if (timeMs >= slowest.timeMs) {
      return { ok: false, error: 'not_top10' }
    }
  }

  // Replace this IP's older slower entries
  const batch = db.batch()
  existing.docs.forEach((d) => batch.delete(d.ref))
  const newRef = db.collection(LEADERBOARD_COL).doc()
  batch.set(newRef, {
    name: trimmed,
    timeMs,
    date: new Date().toISOString(),
    ip,
  })
  await batch.commit()

  // Trim collection back to top 10 across all IPs
  const all = await db.collection(LEADERBOARD_COL).orderBy('timeMs', 'asc').get()
  if (all.size > MAX_LEADERBOARD_ENTRIES) {
    const trim = db.batch()
    all.docs.slice(MAX_LEADERBOARD_ENTRIES).forEach((d) => trim.delete(d.ref))
    await trim.commit()
  }

  return { ok: true }
}

export async function deleteLeaderboardEntry(id: string): Promise<boolean> {
  const db = getDb()
  if (!db) return false
  const ref = db.collection(LEADERBOARD_COL).doc(id)
  const snap = await ref.get()
  if (!snap.exists) return false
  await ref.delete()
  return true
}

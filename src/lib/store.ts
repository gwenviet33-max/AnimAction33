'use client'

import { useEffect, useState } from 'react'
import { STORE_DEFAULTS, type StoreSection } from './defaults'

export { STORE_DEFAULTS } from './defaults'
export type {
  Stat,
  Prestation,
  Game,
  Testimonial,
  FaqItem,
  Formule,
  StoreSection,
} from './defaults'

// =============================================================================
// In-memory cache + inflight de-dup. Hydrated by:
//   - getInitialContent() injection from Server Components (StoreHydrator)
//   - first useStoreSection() that triggers a fetch
// Backed by /api/content/[section] which reads/writes Firestore.
// =============================================================================

const cache = new Map<StoreSection, unknown>()
const inflight = new Map<StoreSection, Promise<unknown>>()
const debounceTimers = new Map<StoreSection, ReturnType<typeof setTimeout>>()
const DEBOUNCE_MS = 800

function emit(section: StoreSection, value: unknown) {
  if (typeof window === 'undefined') return
  window.dispatchEvent(
    new CustomEvent('aa-store-change', { detail: { section, value } })
  )
}

async function fetchSection<K extends StoreSection>(
  section: K
): Promise<(typeof STORE_DEFAULTS)[K]> {
  if (cache.has(section)) return cache.get(section) as (typeof STORE_DEFAULTS)[K]
  if (inflight.has(section)) {
    return inflight.get(section) as Promise<(typeof STORE_DEFAULTS)[K]>
  }

  if (typeof window === 'undefined') {
    return STORE_DEFAULTS[section]
  }

  const p = (async () => {
    try {
      const res = await fetch(`/api/content/${section}`, { cache: 'no-store' })
      if (!res.ok) throw new Error(`status ${res.status}`)
      const json = (await res.json()) as { value: (typeof STORE_DEFAULTS)[K] }
      cache.set(section, json.value)
      return json.value
    } catch (e) {
      console.warn(`[aaStore] fetch ${section} failed, using defaults:`, e)
      cache.set(section, STORE_DEFAULTS[section])
      return STORE_DEFAULTS[section]
    } finally {
      inflight.delete(section)
    }
  })()
  inflight.set(section, p)
  return p
}

async function writeSectionRemote<K extends StoreSection>(
  section: K,
  value: (typeof STORE_DEFAULTS)[K]
): Promise<boolean> {
  try {
    const res = await fetch(`/api/content/${section}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ value }),
    })
    if (!res.ok) {
      const j = await res.json().catch(() => ({}))
      throw new Error(j.error || `status ${res.status}`)
    }
    return true
  } catch (e) {
    console.error(`[aaStore] write ${section} failed:`, e)
    return false
  }
}

function scheduleDebouncedWrite<K extends StoreSection>(
  section: K,
  value: (typeof STORE_DEFAULTS)[K]
) {
  const existing = debounceTimers.get(section)
  if (existing) clearTimeout(existing)
  debounceTimers.set(
    section,
    setTimeout(() => {
      writeSectionRemote(section, value).catch(() => {})
      debounceTimers.delete(section)
    }, DEBOUNCE_MS)
  )
}

// =============================================================================
// Public API — same shape as before so admin pages don't change
// =============================================================================

export const aaStore = {
  /** Get current value (cached or fetched). Returns DEFAULTS during SSR. */
  get<K extends StoreSection>(section: K): Promise<(typeof STORE_DEFAULTS)[K]> {
    return fetchSection(section)
  },

  /** Synchronous accessor for code that already loaded the value (or wants defaults). */
  getCached<K extends StoreSection>(section: K): (typeof STORE_DEFAULTS)[K] {
    return (cache.get(section) ?? STORE_DEFAULTS[section]) as (typeof STORE_DEFAULTS)[K]
  },

  /**
   * Persist a section. Updates local cache + emits event immediately so the UI
   * stays reactive, then debounces the network write to avoid spamming Firestore
   * during continuous edits (sliders, typing).
   */
  set<K extends StoreSection>(section: K, value: (typeof STORE_DEFAULTS)[K]) {
    cache.set(section, value)
    emit(section, value)
    scheduleDebouncedWrite(section, value)
  },

  /** Force an immediate write, flushing any pending debounce. */
  async flush<K extends StoreSection>(
    section: K,
    value?: (typeof STORE_DEFAULTS)[K]
  ): Promise<boolean> {
    const existing = debounceTimers.get(section)
    if (existing) {
      clearTimeout(existing)
      debounceTimers.delete(section)
    }
    const v = (value ?? cache.get(section) ?? STORE_DEFAULTS[section]) as (typeof STORE_DEFAULTS)[K]
    cache.set(section, v)
    emit(section, v)
    return writeSectionRemote(section, v)
  },

  /** Reset to defaults (writes defaults to Firestore). */
  reset<K extends StoreSection>(section: K) {
    cache.set(section, STORE_DEFAULTS[section])
    emit(section, STORE_DEFAULTS[section])
    scheduleDebouncedWrite(section, STORE_DEFAULTS[section])
  },

  /** Pre-seed the in-memory cache from server-injected initial values. */
  hydrate<K extends StoreSection>(section: K, value: (typeof STORE_DEFAULTS)[K]) {
    cache.set(section, value)
  },

  DEFAULTS: STORE_DEFAULTS,
}

// =============================================================================
// React hook — used by both public site and admin
// =============================================================================

export function useStoreSection<K extends StoreSection>(
  section: K,
  initial?: (typeof STORE_DEFAULTS)[K]
): (typeof STORE_DEFAULTS)[K] {
  const [value, setValue] = useState<(typeof STORE_DEFAULTS)[K]>(() => {
    if (initial !== undefined) {
      cache.set(section, initial)
      return initial
    }
    return (cache.get(section) ?? STORE_DEFAULTS[section]) as (typeof STORE_DEFAULTS)[K]
  })

  useEffect(() => {
    let alive = true

    if (initial !== undefined) {
      // Already hydrated from server, no need to refetch immediately
    } else if (!cache.has(section)) {
      fetchSection(section).then((v) => {
        if (alive) setValue(v)
      })
    }

    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail as {
        section: string
        value: unknown
      }
      if (detail?.section === section) {
        setValue(
          (detail.value ?? cache.get(section) ?? STORE_DEFAULTS[section]) as (typeof STORE_DEFAULTS)[K]
        )
      }
    }
    window.addEventListener('aa-store-change', handler)
    return () => {
      alive = false
      window.removeEventListener('aa-store-change', handler)
    }
  }, [section, initial])

  return value
}

/**
 * Helper for migration page: read raw localStorage values that the OLD store
 * wrote (key prefix `aa_content:`). Returns null if no legacy data found.
 */
export function readLegacyLocalStorage<K extends StoreSection>(
  section: K
): (typeof STORE_DEFAULTS)[K] | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(`aa_content:${section}`)
    if (!raw) return null
    return JSON.parse(raw) as (typeof STORE_DEFAULTS)[K]
  } catch {
    return null
  }
}

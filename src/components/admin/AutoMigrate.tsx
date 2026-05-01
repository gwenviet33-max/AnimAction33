'use client'

import { useEffect, useRef } from 'react'
import { STORE_DEFAULTS, type StoreSection } from '@/lib/defaults'
import { showToast } from '@/lib/utils'

const FLAG = 'aa_migration_v1_done'
const SECTIONS = Object.keys(STORE_DEFAULTS) as StoreSection[]

/**
 * Mounted in /admin layout. On first load after the localStorage→Firestore
 * migration shipped, silently scans for any `aa_content:*` keys still in
 * localStorage on this device and pushes them to Firestore via the content
 * API. Sets a flag so it never runs twice on the same browser.
 *
 * Designed to be invisible in the happy path (no toast if nothing to migrate),
 * and informative if it actually finds and migrates data.
 */
export function AutoMigrate() {
  const ran = useRef(false)

  useEffect(() => {
    if (ran.current) return
    ran.current = true

    if (typeof window === 'undefined') return
    if (window.localStorage.getItem(FLAG)) return

    // Find any legacy keys
    const pending: { section: StoreSection; value: unknown }[] = []
    for (const section of SECTIONS) {
      const raw = window.localStorage.getItem(`aa_content:${section}`)
      if (!raw) continue
      try {
        pending.push({ section, value: JSON.parse(raw) })
      } catch {
        // ignore corrupted entry
      }
    }

    if (pending.length === 0) {
      // Nothing to migrate — just mark as done so we don't re-scan every load
      window.localStorage.setItem(FLAG, new Date().toISOString())
      return
    }

    let cancelled = false
    ;(async () => {
      let ok = 0
      let fail = 0
      for (const { section, value } of pending) {
        try {
          const res = await fetch(`/api/content/${section}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ value }),
          })
          if (res.ok) ok++
          else fail++
        } catch {
          fail++
        }
      }
      if (cancelled) return

      if (fail === 0) {
        // All sections migrated — wipe the legacy keys to keep localStorage clean
        for (const { section } of pending) {
          window.localStorage.removeItem(`aa_content:${section}`)
        }
        window.localStorage.setItem(FLAG, new Date().toISOString())
        showToast(
          `✅ ${ok} section${ok > 1 ? 's' : ''} migrée${ok > 1 ? 's' : ''} vers Firestore`
        )
      } else {
        showToast(
          `⚠️ ${ok} OK, ${fail} échec — ouvre /admin/migration pour réessayer`
        )
      }
    })()

    return () => {
      cancelled = true
    }
  }, [])

  return null
}

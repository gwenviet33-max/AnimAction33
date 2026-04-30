'use client'

import { useRef } from 'react'
import { aaStore, type StoreSection } from '@/lib/store'
import { STORE_DEFAULTS } from '@/lib/defaults'

type Initial = Partial<{
  [K in StoreSection]: (typeof STORE_DEFAULTS)[K]
}>

/**
 * Renders nothing. Seeds the client store cache synchronously on first render
 * with values fetched server-side. After this, `useStoreSection` returns the
 * Firestore value on the very first paint (no flash from defaults).
 */
export function StoreHydrator({ initial }: { initial: Initial }) {
  const done = useRef(false)
  if (!done.current) {
    for (const key of Object.keys(initial) as StoreSection[]) {
      const v = initial[key]
      if (v !== undefined) aaStore.hydrate(key, v as never)
    }
    done.current = true
  }
  return null
}

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

const KEY_PREFIX = 'aa_content:'

function readSection<K extends StoreSection>(section: K): (typeof STORE_DEFAULTS)[K] {
  if (typeof window === 'undefined') return STORE_DEFAULTS[section]
  try {
    const raw = window.localStorage.getItem(`${KEY_PREFIX}${section}`)
    if (!raw) return STORE_DEFAULTS[section]
    return JSON.parse(raw) as (typeof STORE_DEFAULTS)[K]
  } catch {
    return STORE_DEFAULTS[section]
  }
}

function writeSection<K extends StoreSection>(section: K, value: (typeof STORE_DEFAULTS)[K]) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(`${KEY_PREFIX}${section}`, JSON.stringify(value))
  window.dispatchEvent(new CustomEvent('aa-store-change', { detail: { section, value } }))
}

function resetSection(section: StoreSection) {
  if (typeof window === 'undefined') return
  window.localStorage.removeItem(`${KEY_PREFIX}${section}`)
  window.dispatchEvent(new CustomEvent('aa-store-change', { detail: { section } }))
}

export const aaStore = {
  get: readSection,
  set: writeSection,
  reset: resetSection,
  DEFAULTS: STORE_DEFAULTS,
}

export function useStoreSection<K extends StoreSection>(section: K): (typeof STORE_DEFAULTS)[K] {
  const [value, setValue] = useState<(typeof STORE_DEFAULTS)[K]>(STORE_DEFAULTS[section])

  useEffect(() => {
    setValue(readSection(section))
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail as { section: string }
      if (detail?.section === section) setValue(readSection(section))
    }
    window.addEventListener('aa-store-change', handler)
    window.addEventListener('storage', () => setValue(readSection(section)))
    return () => {
      window.removeEventListener('aa-store-change', handler)
    }
  }, [section])

  return value
}

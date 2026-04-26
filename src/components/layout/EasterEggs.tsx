'use client'

import { useEffect } from 'react'
import { fireConfetti, showToast } from '@/lib/utils'

const KONAMI = [
  'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
  'b', 'a',
]

export function EasterEggs() {
  useEffect(() => {
    let buffer: string[] = []

    const onKey = (e: KeyboardEvent) => {
      buffer.push(e.key)
      if (buffer.length > KONAMI.length) buffer = buffer.slice(-KONAMI.length)
      if (buffer.join(',').toLowerCase() === KONAMI.join(',').toLowerCase()) {
        fireConfetti(window.innerWidth / 2, window.innerHeight / 2, 200)
        showToast('🐵 Konami unlocked !')
        buffer = []
      }
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return null
}

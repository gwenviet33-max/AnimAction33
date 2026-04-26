'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { fireConfetti } from '@/lib/utils'

export function SplashScreen() {
  const [visible, setVisible] = useState(false)
  const [fading, setFading] = useState(false)

  useEffect(() => {
    if (sessionStorage.getItem('aa_splash_seen')) return
    setVisible(true)
    sessionStorage.setItem('aa_splash_seen', '1')
    setTimeout(() => fireConfetti(window.innerWidth / 2, window.innerHeight / 3, 50), 200)
    const fadeTimer = setTimeout(() => setFading(true), 2400)
    const hideTimer = setTimeout(() => setVisible(false), 2800)
    return () => {
      clearTimeout(fadeTimer)
      clearTimeout(hideTimer)
    }
  }, [])

  if (!visible) return null

  return (
    <div
      className="fixed inset-0 z-[100] grid place-items-center bg-aa-ink text-aa-paper transition-opacity duration-500"
      style={{ opacity: fading ? 0 : 1 }}
    >
      <div className="flex flex-col items-center gap-4">
        <Image
          src="/logo-final.png"
          alt="AnimAction33"
          width={320}
          height={320}
          priority
          className="h-56 w-56 animate-pop-in rounded-full border-4 border-aa-yellow object-cover md:h-72 md:w-72"
        />
        <p className="font-hand text-3xl text-aa-yellow md:text-5xl">Vivez l'animation autrement</p>
      </div>
    </div>
  )
}

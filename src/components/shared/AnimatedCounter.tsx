'use client'

import { useEffect, useRef, useState } from 'react'

export function AnimatedCounter({
  value,
  suffix = '',
  duration = 1400,
}: {
  value: string | number
  suffix?: string
  duration?: number
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const [display, setDisplay] = useState<string>(typeof value === 'number' ? '0' : String(value))

  useEffect(() => {
    const node = ref.current
    if (!node) return
    const numeric = typeof value === 'number' ? value : Number(String(value).replace(/\D+/g, ''))
    if (!isFinite(numeric) || numeric === 0) {
      setDisplay(String(value))
      return
    }
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return
          const start = performance.now()
          const tick = (now: number) => {
            const t = Math.min(1, (now - start) / duration)
            const eased = 1 - Math.pow(1 - t, 3)
            setDisplay(String(Math.round(eased * numeric)))
            if (t < 1) requestAnimationFrame(tick)
            else setDisplay(String(value))
          }
          requestAnimationFrame(tick)
          obs.unobserve(node)
        })
      },
      { threshold: 0.4 }
    )
    obs.observe(node)
    return () => obs.disconnect()
  }, [value, duration])

  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  )
}

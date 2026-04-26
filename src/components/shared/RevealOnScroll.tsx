'use client'

import { useEffect, useRef, useState, ReactNode } from 'react'
import { cn } from '@/lib/utils'

export function RevealOnScroll({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode
  delay?: 0 | 1 | 2 | 3
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setShown(true)
            obs.unobserve(node)
          }
        })
      },
      { threshold: 0.15 }
    )
    obs.observe(node)
    return () => obs.disconnect()
  }, [])

  const delayClass = delay > 0 ? `d${delay}` : ''
  return (
    <div ref={ref} className={cn('reveal', delayClass, shown && 'in', className)}>
      {children}
    </div>
  )
}

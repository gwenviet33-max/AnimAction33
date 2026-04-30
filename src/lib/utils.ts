import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function fireConfetti(x?: number, y?: number, n = 60) {
  if (typeof window === 'undefined') return
  const colors = ['#1C5FD8', '#E8252C', '#FFC91F', '#0F1B3D']
  const cx = typeof x === 'number' ? x : window.innerWidth / 2
  const cy = typeof y === 'number' ? y : window.innerHeight / 3
  for (let i = 0; i < n; i++) {
    const piece = document.createElement('div')
    piece.className = 'confetti-piece'
    piece.style.background = colors[Math.floor(Math.random() * colors.length)]
    piece.style.left = `${cx}px`
    piece.style.top = `${cy}px`
    piece.style.transform = `rotate(${Math.random() * 360}deg)`
    document.body.appendChild(piece)
    const angle = Math.random() * Math.PI * 2
    const velocity = 4 + Math.random() * 6
    const dx = Math.cos(angle) * velocity * 30
    const dy = Math.sin(angle) * velocity * 30 + 200
    piece.animate(
      [
        { transform: piece.style.transform, opacity: 1 },
        {
          transform: `translate(${dx}px, ${dy}px) rotate(${Math.random() * 720}deg)`,
          opacity: 0,
        },
      ],
      { duration: 1200 + Math.random() * 600, easing: 'cubic-bezier(0.2, 0.7, 0.3, 1)' }
    )
    setTimeout(() => piece.remove(), 2000)
  }
}

export function showToast(message: string, duration = 2400) {
  if (typeof window === 'undefined') return
  const toast = document.createElement('div')
  toast.className = 'toast'
  toast.textContent = message
  document.body.appendChild(toast)
  setTimeout(() => {
    toast.style.transition = 'opacity .4s ease, transform .4s ease'
    toast.style.opacity = '0'
    toast.style.transform = 'translateX(-50%) translateY(20px)'
    setTimeout(() => toast.remove(), 400)
  }, duration)
}

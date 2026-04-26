'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { fireConfetti } from '@/lib/utils'

const ITEMS = ['🎈', '🎤', '🏆', '⭐', '🎁']

type Floater = { id: number; emoji: string; x: number; t: number }

export function MiniGame() {
  const [score, setScore] = useState(0)
  const [time, setTime] = useState(15)
  const [running, setRunning] = useState(false)
  const [done, setDone] = useState(false)
  const [floaters, setFloaters] = useState<Floater[]>([])
  const idRef = useRef(0)
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const start = () => {
    setScore(0)
    setTime(15)
    setRunning(true)
    setDone(false)
    setFloaters([])
  }

  useEffect(() => {
    if (!running) return
    tickRef.current = setInterval(() => {
      setTime((t) => {
        if (t <= 1) {
          if (tickRef.current) clearInterval(tickRef.current)
          setRunning(false)
          setDone(true)
          return 0
        }
        return t - 1
      })
    }, 1000)
    return () => {
      if (tickRef.current) clearInterval(tickRef.current)
    }
  }, [running])

  useEffect(() => {
    if (!running) return
    const spawn = setInterval(() => {
      const id = ++idRef.current
      const emoji = ITEMS[Math.floor(Math.random() * ITEMS.length)]
      setFloaters((prev) => [...prev, { id, emoji, x: Math.random() * 90 + 5, t: Date.now() }])
      setTimeout(() => setFloaters((prev) => prev.filter((f) => f.id !== id)), 2400)
    }, 600)
    return () => clearInterval(spawn)
  }, [running])

  useEffect(() => {
    if (done) {
      fireConfetti(undefined, undefined, 90)
    }
  }, [done])

  const tap = (id: number, e: React.MouseEvent) => {
    setFloaters((prev) => prev.filter((f) => f.id !== id))
    setScore((s) => s + 1)
    fireConfetti(e.clientX, e.clientY, 12)
  }

  const unlocked = score > 50

  return (
    <section className="relative overflow-hidden py-20 md:py-28" style={{ background: 'linear-gradient(180deg, #0F1B3D 0%, #081024 100%)' }}>
      <div className="mx-auto max-w-5xl px-5 text-center text-aa-paper md:px-8">
        <h2 className="font-display uppercase leading-tight" style={{ fontSize: 'clamp(36px, 5vw, 60px)' }}>
          Joue avec <span className="accent-yellow">Gwen !</span>
        </h2>
        <p className="mt-3 text-aa-paper/70">Attrape un maximum d'objets en 15 secondes.</p>

        <div
          className="relative mx-auto mt-10 h-[460px] max-w-3xl overflow-hidden rounded-lg border-[3px] border-aa-paper shadow-pop-lg"
          style={{ background: 'linear-gradient(180deg, #6cc961 0%, #4a9c41 100%)' }}
        >
          <div className="absolute left-4 top-4 rounded-full border-[3px] border-aa-ink bg-aa-yellow px-4 py-1 font-display text-aa-ink">
            Score : {score}
          </div>
          <div className="absolute right-4 top-4 rounded-full border-[3px] border-aa-ink bg-aa-red px-4 py-1 font-display text-white">
            ⏱ {time}s
          </div>

          {floaters.map((f) => (
            <button
              key={f.id}
              onClick={(e) => tap(f.id, e)}
              className="absolute text-4xl transition hover:scale-125"
              style={{
                left: `${f.x}%`,
                bottom: '0%',
                animation: 'floatUp 2.4s linear forwards',
              }}
            >
              {f.emoji}
            </button>
          ))}

          {!running && !done && (
            <div className="absolute inset-0 grid place-items-center bg-black/30">
              <button onClick={start} className="nb-btn nb-btn--yellow">
                ▶ Démarrer
              </button>
            </div>
          )}

          {done && (
            <div className="absolute inset-0 grid place-items-center bg-black/50 px-6 text-center">
              <div>
                <div className="font-display text-3xl text-aa-yellow md:text-5xl">Score : {score}</div>
                <p className="mt-3 text-white/90">
                  {unlocked ? '🎁 Bon FIRSTTIME10 débloqué !' : 'Réserve une vraie animation !'}
                </p>
                <div className="mt-5 flex flex-wrap justify-center gap-3">
                  <button onClick={start} className="nb-btn">
                    Rejouer
                  </button>
                  <Link href="/contact" className="nb-btn nb-btn--red">
                    Demander un devis
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes floatUp {
          0% {
            transform: translateY(0);
            opacity: 1;
          }
          100% {
            transform: translateY(-460px);
            opacity: 0;
          }
        }
      `}</style>
    </section>
  )
}

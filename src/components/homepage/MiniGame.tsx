'use client'

import Link from 'next/link'
import { useCallback, useEffect, useRef, useState } from 'react'
import { fireConfetti, showToast } from '@/lib/utils'

const BG = '#0F1B3D'
const PAPER = '#FFFDF6'
const YELLOW = '#FFC91F'
const RED = '#E8252C'
const BLUE = '#1C5FD8'
const INK_LIGHT = 'rgba(255, 253, 246, 0.06)'

const LETTER_SPACING = 1
const WORD_SPACING = 3
const START_LIVES = 2

const PIXEL_MAP: Record<string, number[][]> = {
  A: [
    [0, 1, 1, 0],
    [1, 0, 0, 1],
    [1, 1, 1, 1],
    [1, 0, 0, 1],
    [1, 0, 0, 1],
  ],
  N: [
    [1, 0, 0, 0, 1],
    [1, 1, 0, 0, 1],
    [1, 0, 1, 0, 1],
    [1, 0, 0, 1, 1],
    [1, 0, 0, 0, 1],
  ],
  I: [
    [1, 1, 1],
    [0, 1, 0],
    [0, 1, 0],
    [0, 1, 0],
    [1, 1, 1],
  ],
  M: [
    [1, 0, 0, 0, 1],
    [1, 1, 0, 1, 1],
    [1, 0, 1, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
  ],
  C: [
    [1, 1, 1, 1],
    [1, 0, 0, 0],
    [1, 0, 0, 0],
    [1, 0, 0, 0],
    [1, 1, 1, 1],
  ],
  T: [
    [1, 1, 1, 1, 1],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
  ],
  O: [
    [1, 1, 1, 1],
    [1, 0, 0, 1],
    [1, 0, 0, 1],
    [1, 0, 0, 1],
    [1, 1, 1, 1],
  ],
  '3': [
    [1, 1, 1, 0],
    [0, 0, 0, 1],
    [0, 1, 1, 0],
    [0, 0, 0, 1],
    [1, 1, 1, 0],
  ],
}

type Brick = {
  x: number
  y: number
  w: number
  h: number
  hit: boolean
  color: string
}

type Ball = { x: number; y: number; dx: number; dy: number; r: number }
type Paddle = { x: number; y: number; w: number; h: number }

type GameState = 'idle' | 'launched' | 'won' | 'lost'

export function MiniGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const bricksRef = useRef<Brick[]>([])
  const ballRef = useRef<Ball>({ x: 0, y: 0, dx: 0, dy: 0, r: 6 })
  const paddleRef = useRef<Paddle>({ x: 0, y: 0, w: 100, h: 14 })
  const sizeRef = useRef({ w: 0, h: 0, scale: 1 })
  const stateRef = useRef<GameState>('idle')
  const livesRef = useRef(START_LIVES)
  const scoreRef = useRef(0)
  const totalRef = useRef(0)
  const lostLifeRef = useRef(false)
  const rafRef = useRef<number | null>(null)
  const mouseRef = useRef<number | null>(null)

  const [uiState, setUiState] = useState<GameState>('idle')
  const [score, setScore] = useState(0)
  const [lives, setLives] = useState(START_LIVES)
  const [coupon, setCoupon] = useState<{ code: string; amount: number; minOrder: number } | null>(
    null
  )
  const [issuing, setIssuing] = useState(false)
  const [issueError, setIssueError] = useState<string | null>(null)
  const [perfect, setPerfect] = useState(true)

  const layout = useCallback(() => {
    const canvas = canvasRef.current
    const wrap = wrapRef.current
    if (!canvas || !wrap) return

    const dpr = window.devicePixelRatio || 1
    const rect = wrap.getBoundingClientRect()
    const cssW = rect.width
    const cssH = rect.height
    canvas.width = Math.round(cssW * dpr)
    canvas.height = Math.round(cssH * dpr)
    canvas.style.width = `${cssW}px`
    canvas.style.height = `${cssH}px`
    const ctx = canvas.getContext('2d')!
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

    const scale = Math.min(cssW / 900, cssH / 500)
    sizeRef.current = { w: cssW, h: cssH, scale }

    const PIXEL = Math.max(6, 10 * scale)

    const lines: { word: string; color: string }[][] = [
      [
        { word: 'ANIM', color: BLUE },
        { word: 'ACTION', color: RED },
      ],
      [{ word: '33', color: YELLOW }],
    ]

    const widthOf = (word: string, px: number) => {
      let w = 0
      for (let i = 0; i < word.length; i++) {
        const map = PIXEL_MAP[word[i]]
        if (!map) continue
        w += map[0].length * px + (i < word.length - 1 ? LETTER_SPACING * px : 0)
      }
      return w
    }
    const lineWidth = (parts: { word: string }[], px: number) =>
      parts.reduce(
        (acc, p, idx) => acc + widthOf(p.word, px) + (idx > 0 ? WORD_SPACING * px : 0),
        0
      )

    const targetWidth = cssW * 0.86
    const widestLine = Math.max(...lines.map((parts) => lineWidth(parts, PIXEL)))
    const fitScale = Math.min(1, targetWidth / widestLine)
    const px = PIXEL * fitScale

    const lineHeight = 5 * px
    const gap = 1.2 * px
    const totalHeight = lines.length * lineHeight + (lines.length - 1) * gap
    let cursorY = cssH * 0.18 + (cssH * 0.42 - totalHeight) / 2

    bricksRef.current = []

    lines.forEach((parts) => {
      const w = lineWidth(parts, px)
      let cursorX = (cssW - w) / 2
      parts.forEach((part, partIdx) => {
        if (partIdx > 0) cursorX += WORD_SPACING * px
        for (let li = 0; li < part.word.length; li++) {
          const map = PIXEL_MAP[part.word[li]]
          if (!map) continue
          for (let row = 0; row < map.length; row++) {
            for (let col = 0; col < map[row].length; col++) {
              if (map[row][col]) {
                bricksRef.current.push({
                  x: cursorX + col * px,
                  y: cursorY + row * px,
                  w: px - 1,
                  h: px - 1,
                  hit: false,
                  color: part.color,
                })
              }
            }
          }
          cursorX += map[0].length * px + LETTER_SPACING * px
        }
      })
      cursorY += lineHeight + gap
    })

    totalRef.current = bricksRef.current.length

    const paddleW = Math.max(80, 140 * scale)
    const paddleH = Math.max(12, 16 * scale)
    paddleRef.current = {
      x: (cssW - paddleW) / 2,
      y: cssH - paddleH - 16,
      w: paddleW,
      h: paddleH,
    }

    const radius = Math.max(7, 9 * scale)
    ballRef.current = {
      x: cssW / 2,
      y: paddleRef.current.y - radius - 2,
      dx: 0,
      dy: 0,
      r: radius,
    }
  }, [])

  const reset = useCallback(() => {
    bricksRef.current.forEach((b) => (b.hit = false))
    livesRef.current = START_LIVES
    scoreRef.current = 0
    totalRef.current = bricksRef.current.length
    lostLifeRef.current = false
    stateRef.current = 'idle'
    setLives(START_LIVES)
    setScore(0)
    setUiState('idle')
    setPerfect(true)
    setCoupon(null)
    setIssueError(null)
    const { w } = sizeRef.current
    paddleRef.current.x = (w - paddleRef.current.w) / 2
    ballRef.current.x = w / 2
    ballRef.current.y = paddleRef.current.y - ballRef.current.r - 2
    ballRef.current.dx = 0
    ballRef.current.dy = 0
  }, [])

  const launch = useCallback(() => {
    const { scale } = sizeRef.current
    const speed = Math.max(4.5, 6.5 * scale)
    ballRef.current.dx = (Math.random() < 0.5 ? -1 : 1) * speed * 0.7
    ballRef.current.dy = -speed
    stateRef.current = 'launched'
    setUiState('launched')
  }, [])

  const loseLife = useCallback(() => {
    livesRef.current -= 1
    lostLifeRef.current = true
    setLives(livesRef.current)
    setPerfect(false)
    if (livesRef.current <= 0) {
      stateRef.current = 'lost'
      setUiState('lost')
      return
    }
    const { w } = sizeRef.current
    paddleRef.current.x = (w - paddleRef.current.w) / 2
    ballRef.current.x = w / 2
    ballRef.current.y = paddleRef.current.y - ballRef.current.r - 2
    ballRef.current.dx = 0
    ballRef.current.dy = 0
    stateRef.current = 'idle'
    setUiState('idle')
  }, [])

  const issueCoupon = useCallback(async () => {
    setIssuing(true)
    setIssueError(null)
    try {
      const res = await fetch('/api/coupons/issue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ perfect: true }),
      })
      const json = await res.json()
      if (!res.ok) {
        if (json.error === 'rate_limited') {
          setIssueError('Trop de codes générés depuis ton appareil. Reviens demain !')
        } else {
          setIssueError('Impossible de générer le code — réessaie plus tard.')
        }
        return
      }
      setCoupon({ code: json.code, amount: json.amount, minOrder: json.minOrder })
      try {
        const local = JSON.parse(localStorage.getItem('aa_my_coupons') || '[]')
        local.unshift({ code: json.code, amount: json.amount, minOrder: json.minOrder, createdAt: json.createdAt })
        localStorage.setItem('aa_my_coupons', JSON.stringify(local.slice(0, 5)))
      } catch {}
    } catch {
      setIssueError('Erreur réseau — réessaie plus tard.')
    } finally {
      setIssuing(false)
    }
  }, [])

  useEffect(() => {
    layout()
    const onResize = () => {
      layout()
      reset()
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [layout, reset])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const tick = () => {
      const ctx = canvas.getContext('2d')
      if (!ctx) return
      const { w, h } = sizeRef.current
      const ball = ballRef.current
      const paddle = paddleRef.current

      const targetX = mouseRef.current
      if (targetX !== null) {
        const desired = Math.max(0, Math.min(w - paddle.w, targetX - paddle.w / 2))
        paddle.x += (desired - paddle.x) * 0.35
      }

      if (stateRef.current === 'idle') {
        ball.x = paddle.x + paddle.w / 2
        ball.y = paddle.y - ball.r - 2
      }

      if (stateRef.current === 'launched') {
        ball.x += ball.dx
        ball.y += ball.dy

        if (ball.x - ball.r < 0) {
          ball.x = ball.r
          ball.dx = Math.abs(ball.dx)
        } else if (ball.x + ball.r > w) {
          ball.x = w - ball.r
          ball.dx = -Math.abs(ball.dx)
        }
        if (ball.y - ball.r < 0) {
          ball.y = ball.r
          ball.dy = Math.abs(ball.dy)
        }
        if (ball.y - ball.r > h) {
          loseLife()
        }

        if (
          ball.y + ball.r > paddle.y &&
          ball.y - ball.r < paddle.y + paddle.h &&
          ball.x > paddle.x &&
          ball.x < paddle.x + paddle.w &&
          ball.dy > 0
        ) {
          const hitPos = (ball.x - (paddle.x + paddle.w / 2)) / (paddle.w / 2)
          const speed = Math.hypot(ball.dx, ball.dy)
          const angle = hitPos * (Math.PI / 3)
          ball.dx = speed * Math.sin(angle)
          ball.dy = -Math.abs(speed * Math.cos(angle))
          ball.y = paddle.y - ball.r - 1
        }

        for (let i = 0; i < bricksRef.current.length; i++) {
          const b = bricksRef.current[i]
          if (b.hit) continue
          if (
            ball.x + ball.r > b.x &&
            ball.x - ball.r < b.x + b.w &&
            ball.y + ball.r > b.y &&
            ball.y - ball.r < b.y + b.h
          ) {
            b.hit = true
            scoreRef.current += 1
            setScore(scoreRef.current)
            const cx = b.x + b.w / 2
            const cy = b.y + b.h / 2
            if (Math.abs(ball.x - cx) > Math.abs(ball.y - cy)) {
              ball.dx = -ball.dx
            } else {
              ball.dy = -ball.dy
            }
            if (scoreRef.current === totalRef.current) {
              stateRef.current = 'won'
              setUiState('won')
              fireConfetti(undefined, undefined, 160)
              if (!lostLifeRef.current) {
                issueCoupon()
              }
            }
            break
          }
        }
      }

      ctx.fillStyle = BG
      ctx.fillRect(0, 0, w, h)

      ctx.strokeStyle = 'rgba(255,253,246,0.08)'
      ctx.lineWidth = 1
      for (let x = 0; x < w; x += 32) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, h)
        ctx.stroke()
      }

      bricksRef.current.forEach((b) => {
        if (b.hit) {
          ctx.fillStyle = INK_LIGHT
        } else {
          ctx.fillStyle = b.color
        }
        ctx.fillRect(b.x, b.y, b.w, b.h)
        if (!b.hit) {
          ctx.strokeStyle = BG
          ctx.lineWidth = 1.5
          ctx.strokeRect(b.x + 0.5, b.y + 0.5, b.w - 1, b.h - 1)
        }
      })

      ctx.fillStyle = PAPER
      ctx.fillRect(paddle.x, paddle.y, paddle.w, paddle.h)
      ctx.fillStyle = YELLOW
      ctx.fillRect(paddle.x + 4, paddle.y + 4, paddle.w - 8, paddle.h - 8)

      ctx.fillStyle = YELLOW
      ctx.beginPath()
      ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2)
      ctx.fill()
      ctx.strokeStyle = BG
      ctx.lineWidth = 2
      ctx.stroke()

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [loseLife, issueCoupon])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const setMouse = (clientX: number) => {
      const rect = canvas.getBoundingClientRect()
      mouseRef.current = clientX - rect.left
    }

    const onMouseMove = (e: MouseEvent) => setMouse(e.clientX)
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches[0]) {
        e.preventDefault()
        setMouse(e.touches[0].clientX)
      }
    }
    const onClick = () => {
      if (stateRef.current === 'idle') launch()
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'Space' && stateRef.current === 'idle') {
        e.preventDefault()
        launch()
      }
    }

    canvas.addEventListener('mousemove', onMouseMove)
    canvas.addEventListener('touchmove', onTouchMove, { passive: false })
    canvas.addEventListener('click', onClick)
    window.addEventListener('keydown', onKey)
    return () => {
      canvas.removeEventListener('mousemove', onMouseMove)
      canvas.removeEventListener('touchmove', onTouchMove)
      canvas.removeEventListener('click', onClick)
      window.removeEventListener('keydown', onKey)
    }
  }, [launch])

  const copyCode = async () => {
    if (!coupon) return
    try {
      await navigator.clipboard.writeText(coupon.code)
      showToast('📋 Code copié')
    } catch {}
  }

  return (
    <section
      className="relative overflow-hidden py-20 md:py-28"
      style={{ background: 'linear-gradient(180deg, #0F1B3D 0%, #081024 100%)' }}
    >
      <div className="mx-auto max-w-5xl px-5 text-center text-aa-paper md:px-8">
        <h2
          className="font-display uppercase leading-tight"
          style={{ fontSize: 'clamp(36px, 5vw, 60px)' }}
        >
          Casse les briques <span className="accent-yellow">AnimAction33</span>
        </h2>
        <p className="mt-3 text-aa-paper/70">
          Termine sans perdre <strong>aucune</strong> vie pour gagner un bon de{' '}
          <strong className="text-aa-yellow">15€</strong> dès 200€ d'achat.
        </p>

        <div
          ref={wrapRef}
          className="relative mx-auto mt-10 aspect-[16/10] w-full max-w-3xl overflow-hidden rounded-lg border-[3px] border-aa-paper shadow-pop-lg"
        >
          <canvas
            ref={canvasRef}
            className="block h-full w-full cursor-none touch-none select-none"
            aria-label="Casse-briques AnimAction33"
          />

          <div className="pointer-events-none absolute left-3 top-3 rounded-full border-[3px] border-aa-ink bg-aa-yellow px-3 py-1 font-display text-sm text-aa-ink">
            {score}/{totalRef.current || '…'}
          </div>
          <div className="pointer-events-none absolute right-3 top-3 rounded-full border-[3px] border-aa-ink bg-aa-red px-3 py-1 font-display text-sm text-white">
            {Array.from({ length: lives })
              .map(() => '❤')
              .join(' ') || '✗'}
          </div>

          {uiState === 'idle' && (
            <div className="pointer-events-none absolute bottom-20 left-1/2 -translate-x-1/2 transform rounded-full border-[3px] border-aa-ink bg-aa-paper px-4 py-1.5 font-display text-sm text-aa-ink">
              Clique pour lancer ▶
            </div>
          )}

          {uiState === 'lost' && (
            <div className="absolute inset-0 grid place-items-center bg-black/70 p-6 text-center">
              <div>
                <div className="font-display text-3xl text-aa-red md:text-5xl">Game Over</div>
                <p className="mt-2 text-white/90">
                  Score : {score}/{totalRef.current}
                </p>
                <p className="mt-1 text-sm text-white/70">
                  Pas de code aujourd'hui — il fallait gagner sans perdre une vie.
                </p>
                <div className="mt-5 flex flex-wrap justify-center gap-3">
                  <button onClick={reset} className="nb-btn nb-btn--yellow">
                    Rejouer
                  </button>
                  <Link href="/contact" className="nb-btn nb-btn--red">
                    Demander un devis
                  </Link>
                </div>
              </div>
            </div>
          )}

          {uiState === 'won' && (
            <div className="absolute inset-0 grid place-items-center bg-black/75 p-6 text-center">
              <div className="max-w-md">
                <div className="font-display text-3xl text-aa-yellow md:text-5xl">
                  🏆 Tout cassé !
                </div>

                {perfect ? (
                  <>
                    {issuing && <p className="mt-3 text-white/80">Génération du code…</p>}
                    {issueError && <p className="mt-3 text-aa-red">{issueError}</p>}
                    {coupon && (
                      <div className="mt-4 rounded-md border-[3px] border-aa-yellow bg-aa-paper p-4 text-aa-ink">
                        <p className="text-xs font-bold uppercase text-aa-ink/60">
                          Ton code (à usage unique)
                        </p>
                        <p className="mt-1 select-all font-display text-2xl tracking-widest text-aa-blue md:text-3xl">
                          {coupon.code}
                        </p>
                        <p className="mt-2 text-sm">
                          <strong>{coupon.amount}€</strong> de réduction dès{' '}
                          <strong>{coupon.minOrder}€</strong> d'achat.
                        </p>
                        <button onClick={copyCode} className="nb-btn nb-btn--yellow mt-3">
                          📋 Copier
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <p className="mt-3 text-white/80">
                    Bravo ! Mais tu as perdu une vie — le code est réservé aux victoires sans faute.
                  </p>
                )}

                <div className="mt-5 flex flex-wrap justify-center gap-3">
                  <button onClick={reset} className="nb-btn nb-btn--yellow">
                    Rejouer
                  </button>
                  <Link
                    href={coupon ? `/contact?code=${coupon.code}` : '/contact'}
                    className="nb-btn nb-btn--red"
                  >
                    {coupon ? 'Utiliser mon code' : 'Demander un devis'}
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>

        <p className="mt-4 text-xs text-aa-paper/50">
          Astuce : touche <kbd className="rounded border border-aa-paper/40 px-1.5 py-0.5">Espace</kbd> pour lancer · raquette = souris/doigt · 2 vies max
        </p>
      </div>
    </section>
  )
}

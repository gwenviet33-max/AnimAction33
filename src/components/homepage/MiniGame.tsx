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
  A: [[0,1,1,0],[1,0,0,1],[1,1,1,1],[1,0,0,1],[1,0,0,1]],
  N: [[1,0,0,0,1],[1,1,0,0,1],[1,0,1,0,1],[1,0,0,1,1],[1,0,0,0,1]],
  I: [[1,1,1],[0,1,0],[0,1,0],[0,1,0],[1,1,1]],
  M: [[1,0,0,0,1],[1,1,0,1,1],[1,0,1,0,1],[1,0,0,0,1],[1,0,0,0,1]],
  C: [[1,1,1,1],[1,0,0,0],[1,0,0,0],[1,0,0,0],[1,1,1,1]],
  T: [[1,1,1,1,1],[0,0,1,0,0],[0,0,1,0,0],[0,0,1,0,0],[0,0,1,0,0]],
  O: [[1,1,1,1],[1,0,0,1],[1,0,0,1],[1,0,0,1],[1,1,1,1]],
  '3': [[1,1,1,0],[0,0,0,1],[0,1,1,0],[0,0,0,1],[1,1,1,0]],
}

type Brick = { x: number; y: number; w: number; h: number; hit: boolean; color: string }
type Ball = { x: number; y: number; dx: number; dy: number; r: number }
type Paddle = { x: number; y: number; w: number; h: number }
type GameState = 'idle' | 'launched' | 'won' | 'lost'

type LeaderboardEntry = { id: string; name: string; timeMs: number; date: string }

type FinishResponse = {
  isFirstAttemptToday: boolean
  wonOnFirstAttempt: boolean
  alreadyHasCouponToday: boolean
  coupon: { code: string; amount: number; minOrder: number } | null
  eligibleForLeaderboard: boolean
}

const fmtTime = (ms: number) => {
  const totalSec = ms / 1000
  const m = Math.floor(totalSec / 60)
  const s = totalSec - m * 60
  return m > 0 ? `${m}m${s.toFixed(2).padStart(5, '0')}s` : `${s.toFixed(2)}s`
}

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
  const startedAtRef = useRef<number | null>(null)
  const finalTimeRef = useRef<number>(0)
  const finishedRef = useRef(false)
  const rafRef = useRef<number | null>(null)
  const mouseRef = useRef<number | null>(null)

  const [uiState, setUiState] = useState<GameState>('idle')
  const [score, setScore] = useState(0)
  const [lives, setLives] = useState(START_LIVES)
  const [finishResult, setFinishResult] = useState<FinishResponse | null>(null)
  const [submittingFinish, setSubmittingFinish] = useState(false)

  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [loadingLb, setLoadingLb] = useState(true)

  const [pseudo, setPseudo] = useState('')
  const [submittingName, setSubmittingName] = useState(false)
  const [nameError, setNameError] = useState<string | null>(null)
  const [nameSubmitted, setNameSubmitted] = useState(false)

  const fetchLeaderboard = useCallback(async () => {
    try {
      const res = await fetch('/api/leaderboard', { cache: 'no-store' })
      const json = await res.json()
      setLeaderboard(json.entries || [])
    } catch {}
    setLoadingLb(false)
  }, [])

  useEffect(() => {
    fetchLeaderboard()
  }, [fetchLeaderboard])

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
      [{ word: 'ANIM', color: BLUE }, { word: 'ACTION', color: RED }],
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
    finishedRef.current = false
    startedAtRef.current = null
    finalTimeRef.current = 0
    stateRef.current = 'idle'
    setLives(START_LIVES)
    setScore(0)
    setUiState('idle')
    setFinishResult(null)
    setNameSubmitted(false)
    setNameError(null)
    setPseudo('')
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
    if (startedAtRef.current === null) startedAtRef.current = performance.now()
  }, [])

  const reportFinish = useCallback(async (won: boolean, time: number) => {
    if (finishedRef.current) return
    finishedRef.current = true
    setSubmittingFinish(true)
    try {
      const res = await fetch('/api/game/finish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ won, time }),
      })
      const json = (await res.json()) as FinishResponse
      setFinishResult(json)
    } catch {
      setFinishResult({
        isFirstAttemptToday: false,
        wonOnFirstAttempt: false,
        alreadyHasCouponToday: false,
        coupon: null,
        eligibleForLeaderboard: false,
      })
    } finally {
      setSubmittingFinish(false)
    }
    fetchLeaderboard()
  }, [fetchLeaderboard])

  const loseLife = useCallback(() => {
    livesRef.current -= 1
    setLives(livesRef.current)
    if (livesRef.current <= 0) {
      stateRef.current = 'lost'
      setUiState('lost')
      const time = startedAtRef.current ? performance.now() - startedAtRef.current : 0
      finalTimeRef.current = time
      reportFinish(false, time)
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
  }, [reportFinish])

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

        if (ball.x - ball.r < 0) { ball.x = ball.r; ball.dx = Math.abs(ball.dx) }
        else if (ball.x + ball.r > w) { ball.x = w - ball.r; ball.dx = -Math.abs(ball.dx) }
        if (ball.y - ball.r < 0) { ball.y = ball.r; ball.dy = Math.abs(ball.dy) }
        if (ball.y - ball.r > h) loseLife()

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
            if (Math.abs(ball.x - cx) > Math.abs(ball.y - cy)) ball.dx = -ball.dx
            else ball.dy = -ball.dy
            if (scoreRef.current === totalRef.current) {
              stateRef.current = 'won'
              setUiState('won')
              const time = startedAtRef.current ? performance.now() - startedAtRef.current : 0
              finalTimeRef.current = time
              fireConfetti(undefined, undefined, 160)
              reportFinish(true, time)
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
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke()
      }
      bricksRef.current.forEach((b) => {
        ctx.fillStyle = b.hit ? INK_LIGHT : b.color
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
  }, [loseLife, reportFinish])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const setMouse = (clientX: number) => {
      const rect = canvas.getBoundingClientRect()
      mouseRef.current = clientX - rect.left
    }
    const onMouseMove = (e: MouseEvent) => setMouse(e.clientX)
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches[0]) { e.preventDefault(); setMouse(e.touches[0].clientX) }
    }
    const onClick = () => { if (stateRef.current === 'idle') launch() }
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'Space' && stateRef.current === 'idle') { e.preventDefault(); launch() }
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

  const submitName = async () => {
    setSubmittingName(true)
    setNameError(null)
    try {
      const res = await fetch('/api/leaderboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: pseudo, time: finalTimeRef.current }),
      })
      const json = await res.json()
      if (!res.ok) {
        const map: Record<string, string> = {
          inappropriate: 'Pseudo non autorisé.',
          name_too_short: 'Pseudo trop court (2 caractères mini).',
          slower_than_your_best: 'Tu as déjà un meilleur temps au classement.',
          not_top10: 'Pas assez rapide pour le top 10 — réessaye !',
          invalid_time: 'Temps invalide.',
          no_db: 'Erreur serveur, réessaye plus tard.',
        }
        setNameError(map[json.error] || 'Erreur — réessaye.')
        return
      }
      setNameSubmitted(true)
      showToast('🏆 Tu es au classement !')
      fetchLeaderboard()
    } catch {
      setNameError('Erreur réseau — réessaye.')
    } finally {
      setSubmittingName(false)
    }
  }

  const copyCode = async () => {
    if (!finishResult?.coupon) return
    try {
      await navigator.clipboard.writeText(finishResult.coupon.code)
      showToast('📋 Code copié')
    } catch {}
  }

  const won = uiState === 'won'
  const lost = uiState === 'lost'
  const showCoupon = won && finishResult?.coupon
  const couponMessage = (() => {
    if (!won || !finishResult) return null
    if (finishResult.coupon) return null
    if (finishResult.alreadyHasCouponToday) return "Tu as déjà gagné ton bon aujourd'hui — reviens demain !"
    if (!finishResult.isFirstAttemptToday) return "Bravo ! Mais le bon promo n'est gagné qu'à la 1re partie de la journée."
    return 'Bravo ! Bon promo non disponible pour le moment.'
  })()

  return (
    <section
      className="relative overflow-hidden py-20 md:py-28"
      style={{ background: 'linear-gradient(180deg, #0F1B3D 0%, #081024 100%)' }}
    >
      <div className="mx-auto max-w-6xl px-5 text-center text-aa-paper md:px-8">
        <h2 className="font-display uppercase leading-tight" style={{ fontSize: 'clamp(36px, 5vw, 60px)' }}>
          Casse les briques <span className="accent-yellow">AnimAction33</span>
        </h2>
        <p className="mt-3 text-aa-paper/70">
          Le plus rapide entre dans le top 10. La <strong>1<sup>re</sup> victoire du jour</strong> gagne un bon de{' '}
          <strong className="text-aa-yellow">15€ dès 200€ d'achat</strong>.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-[1fr_280px]">
          <div
            ref={wrapRef}
            className="relative aspect-[16/10] w-full overflow-hidden rounded-lg border-[3px] border-aa-paper shadow-pop-lg"
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
              {Array.from({ length: lives }).map(() => '❤').join(' ') || '✗'}
            </div>

            {uiState === 'idle' && (
              <div className="pointer-events-none absolute bottom-20 left-1/2 -translate-x-1/2 transform rounded-full border-[3px] border-aa-ink bg-aa-paper px-4 py-1.5 font-display text-sm text-aa-ink">
                Clique pour lancer ▶
              </div>
            )}

            {lost && (
              <div className="absolute inset-0 grid place-items-center bg-black/70 p-6 text-center">
                <div>
                  <div className="font-display text-3xl text-aa-red md:text-5xl">Game Over</div>
                  <p className="mt-2 text-white/90">Score : {score}/{totalRef.current}</p>
                  {finishResult?.isFirstAttemptToday && (
                    <p className="mt-2 text-sm text-white/70">
                      Pas de bon promo aujourd&apos;hui — il fallait gagner ta 1re partie.
                    </p>
                  )}
                  <div className="mt-5 flex flex-wrap justify-center gap-3">
                    <button onClick={reset} className="nb-btn nb-btn--yellow">Rejouer</button>
                    <Link href="/contact" className="nb-btn nb-btn--red">Demander un devis</Link>
                  </div>
                </div>
              </div>
            )}

            {won && (
              <div className="absolute inset-0 grid place-items-center bg-black/75 p-4 text-center">
                <div className="max-w-md">
                  <div className="font-display text-2xl text-aa-yellow md:text-4xl">🏆 Tout cassé !</div>
                  <p className="mt-2 text-white/90">
                    Temps : <strong className="text-aa-yellow">{fmtTime(finalTimeRef.current)}</strong>
                  </p>

                  {submittingFinish && <p className="mt-3 text-white/70">Calcul…</p>}

                  {showCoupon && finishResult.coupon && (
                    <div className="mt-3 rounded-md border-[3px] border-aa-yellow bg-aa-paper p-3 text-aa-ink">
                      <p className="text-xs font-bold uppercase text-aa-ink/60">Ton code (à usage unique)</p>
                      <p className="mt-1 select-all font-display text-xl tracking-widest text-aa-blue md:text-2xl">
                        {finishResult.coupon.code}
                      </p>
                      <p className="mt-2 text-sm">
                        <strong>{finishResult.coupon.amount}€</strong> dès{' '}
                        <strong>{finishResult.coupon.minOrder}€</strong> d&apos;achat.
                      </p>
                      <button
                        onClick={copyCode}
                        className="nb-btn nb-btn--yellow mt-2"
                        style={{ padding: '0.4rem 0.9rem', fontSize: '0.85rem' }}
                      >
                        📋 Copier
                      </button>
                    </div>
                  )}

                  {!showCoupon && couponMessage && (
                    <p className="mt-3 text-sm text-white/70">{couponMessage}</p>
                  )}

                  {finishResult?.eligibleForLeaderboard && !nameSubmitted && (
                    <div className="mt-3 rounded-md border-2 border-white/20 bg-white/5 p-3 text-left">
                      <p className="text-center text-sm font-bold text-aa-yellow">Top 10 — entre ton prénom !</p>
                      <input
                        type="text"
                        value={pseudo}
                        onChange={(e) => setPseudo(e.target.value.slice(0, 20))}
                        placeholder="Ton prénom"
                        className="mt-2 w-full rounded-md border-2 border-aa-ink bg-white p-2 text-center text-aa-ink"
                        maxLength={20}
                      />
                      {nameError && <p className="mt-1 text-center text-xs text-aa-red">{nameError}</p>}
                      <button
                        onClick={submitName}
                        disabled={submittingName || pseudo.trim().length < 2}
                        className="nb-btn nb-btn--red mt-2 w-full disabled:opacity-50"
                        style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
                      >
                        {submittingName ? 'Envoi…' : 'Valider 🏆'}
                      </button>
                    </div>
                  )}

                  {nameSubmitted && (
                    <p className="mt-3 inline-block rounded-full border-2 border-aa-yellow bg-aa-yellow/20 px-3 py-1 text-sm font-bold text-aa-yellow">
                      ✓ Tu es au classement !
                    </p>
                  )}

                  <div className="mt-4 flex flex-wrap justify-center gap-3">
                    <button
                      onClick={reset}
                      className="nb-btn nb-btn--yellow"
                      style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
                    >
                      Rejouer
                    </button>
                    <Link
                      href={finishResult?.coupon ? `/contact?code=${finishResult.coupon.code}` : '/contact'}
                      className="nb-btn nb-btn--red"
                      style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
                    >
                      {finishResult?.coupon ? 'Utiliser mon code' : 'Demander un devis'}
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>

          <aside className="rounded-md border-[3px] border-aa-paper bg-aa-paper p-4 text-aa-ink shadow-pop md:p-5">
            <h3 className="font-display text-lg uppercase">🏆 Top 10</h3>
            <p className="mt-1 text-xs text-aa-ink/60">Le plus rapide gagne</p>
            {loadingLb ? (
              <p className="mt-4 text-sm text-aa-ink/60">Chargement…</p>
            ) : leaderboard.length === 0 ? (
              <p className="mt-4 text-sm text-aa-ink/60">
                Personne encore. Sois le 1<sup>er</sup> !
              </p>
            ) : (
              <ol className="mt-4 space-y-1.5 text-left text-sm">
                {leaderboard.map((e, i) => (
                  <li
                    key={e.id}
                    className={
                      'flex items-center gap-2 rounded-md border-2 border-aa-ink/20 px-2 py-1.5 ' +
                      (i === 0 ? 'bg-aa-yellow/40' : i < 3 ? 'bg-aa-cream' : 'bg-white')
                    }
                  >
                    <span className="w-6 font-display text-aa-ink">
                      {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}.`}
                    </span>
                    <span className="flex-1 truncate font-bold">{e.name}</span>
                    <span className="font-mono text-xs text-aa-ink/70">{fmtTime(e.timeMs)}</span>
                  </li>
                ))}
              </ol>
            )}
          </aside>
        </div>

        <p className="mt-4 text-xs text-aa-paper/50">
          <kbd className="rounded border border-aa-paper/40 px-1.5 py-0.5">Espace</kbd> pour lancer · raquette = souris/doigt · 2 vies · 1 chance de bon promo par jour par appareil
        </p>
      </div>
    </section>
  )
}

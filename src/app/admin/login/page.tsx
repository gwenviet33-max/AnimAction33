'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function AdminLogin() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(false)
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      if (!res.ok) {
        setError(true)
        setLoading(false)
        return
      }
      router.push('/admin')
    } catch {
      setError(true)
      setLoading(false)
    }
  }

  return (
    <div className="grid min-h-screen place-items-center bg-aa-ink p-6">
      <form
        onSubmit={submit}
        className={
          'w-full max-w-md rounded-md border-[3px] border-aa-paper bg-aa-paper p-8 text-aa-ink shadow-pop ' +
          (error ? 'animate-[shake_0.4s_ease-in-out]' : '')
        }
      >
        <div className="flex flex-col items-center">
          <Image
            src="/logo-final.png"
            alt="AnimAction33"
            width={88}
            height={88}
            className="h-20 w-20 rounded-full border-2 border-aa-ink object-cover"
          />
          <h1 className="mt-4 font-display text-2xl uppercase">Admin · AnimAction33</h1>
        </div>

        <label className="mt-6 block">
          <span className="text-sm font-bold">Mot de passe</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-md border-2 border-aa-ink bg-white p-3 focus:outline-none"
            autoFocus
          />
        </label>

        {error && <p className="mt-3 text-sm text-aa-red">Mot de passe incorrect</p>}

        <button type="submit" disabled={loading} className="nb-btn nb-btn--red mt-6 w-full">
          {loading ? 'Connexion…' : "Accéder à l'admin"}
        </button>
      </form>
      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-6px); }
          80% { transform: translateX(6px); }
        }
      `}</style>
    </div>
  )
}

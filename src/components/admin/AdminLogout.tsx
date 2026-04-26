'use client'

import { useRouter } from 'next/navigation'

export function AdminLogout() {
  const router = useRouter()
  const logout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin/login')
    router.refresh()
  }
  return (
    <button onClick={logout} className="block w-full rounded-md px-3 py-2 text-left text-sm text-aa-paper/70 hover:text-aa-red">
      Déconnecter
    </button>
  )
}

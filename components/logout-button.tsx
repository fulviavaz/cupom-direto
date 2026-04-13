'use client'

import { useRouter } from 'next/navigation'

export default function LogoutButton() {
  const router = useRouter()

  async function handleLogout() {
    try {
      await fetch('/api/logout', {
        method: 'POST',
      })

      router.push('/login')
      router.refresh()
    } catch (error) {
      console.error('Erro ao sair:', error)
    }
  }

  return (
    <button
      onClick={handleLogout}
      className="mt-6 rounded-lg border border-red-400 px-4 py-2 text-left text-sm text-red-400 transition hover:bg-red-500/10 hover:text-red-300"
    >
      Sair
    </button>
  )
}
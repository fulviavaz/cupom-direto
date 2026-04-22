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
      className="block w-full rounded-2xl bg-[#ef233c] px-4 py-3 text-left text-sm font-semibold text-white transition hover:opacity-90 cursor-pointer"
    >
      Sair
    </button>
  )
}
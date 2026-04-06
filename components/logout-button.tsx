'use client'

import { useRouter } from 'next/navigation'

export default function LogoutButton() {
  const router = useRouter()

  function handleLogout() {
    document.cookie = 'auth=false; path=/'
    router.push('/login')
  }

  return (
    <button
      onClick={handleLogout}
      className="mt-6 text-red-400 hover:text-red-300"
    >
      Sair
    </button>
  )
}
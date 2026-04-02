'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  function handleLogin(e: React.FormEvent) {
    e.preventDefault()

    if (email === 'admin@cupom.com' && password === '123456') {
      document.cookie = 'auth=true; path=/'
      router.push('/admin')
    } else {
      alert('Credenciais inválidas')
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-sm"
      >
        <h1 className="text-xl font-bold mb-6 text-center">
          Login Admin
        </h1>

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-3 rounded-lg border px-3 py-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Senha"
          className="w-full mb-4 rounded-lg border px-3 py-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="w-full bg-red-600 text-white py-2 rounded-lg">
          Entrar
        </button>
      </form>
    </main>
  )
}
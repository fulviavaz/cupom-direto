'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Header() {
  const [search, setSearch] = useState('')
  const router = useRouter()

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()

    if (!search.trim()) return

    router.push(`/coupons?search=${search}`)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">

        {/* LOGO */}
        <Link href="/" className="text-xl font-bold text-red-600">
          Cupom Direto
        </Link>

        {/* BUSCA */}
        <form onSubmit={handleSearch} className="hidden flex-1 md:flex">
          <input
            type="text"
            placeholder="Buscar cupons, lojas..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-gray-300 px-4 py-2 text-sm outline-none focus:border-red-500"
          />
        </form>

        {/* NAV */}
        <div className="flex items-center gap-3">

          <Link
            href="/coupons"
            className="text-sm font-medium text-gray-700 hover:text-red-600"
          >
            Cupons
          </Link>

          <Link
            href="/admin/coupons"
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
          >
            Admin
          </Link>

        </div>
      </div>
    </header>
  )
}
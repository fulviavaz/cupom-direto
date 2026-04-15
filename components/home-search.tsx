'use client'

import { Search } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import type { FormEvent } from 'react'

export default function HomeSearch() {
  const [search, setSearch] = useState('')
  const router = useRouter()

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const term = search.trim()

    if (!term) {
      router.push('/coupons')
      return
    }

    router.push(`/coupons?search=${encodeURIComponent(term)}`)
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex items-center gap-3">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar Cupons, Lojas, Categorias ou Produtos"
          className="h-[54px] w-full rounded-[14px] bg-[#e9e9e9] px-5 text-[13px] text-[#222] placeholder:text-[#666] outline-none"
        />

        <button
          type="submit"
          className="flex h-[54px] min-w-[150px] items-center justify-center gap-2 rounded-[14px] border border-[#ddd] bg-white px-6 text-[13px] font-extrabold uppercase text-[#ef233c] transition hover:opacity-90"
        >
          Buscar
          <Search className="h-4 w-4" />
        </button>
      </div>
    </form>
  )
}
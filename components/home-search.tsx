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
      <div className="flex items-center gap-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar Cupons, Lojas, Categorias ou Produtos"
          className="h-[58px] w-full rounded-[18px] bg-[#ececec] px-9 text-[16px] font-medium text-[#333] placeholder:text-[#666] outline-none"
        />
<button
  type="submit"
  className="font-title flex h-[58px] min-w-[178px] items-center justify-center gap-2 rounded-[18px] bg-[#ececec] px-8 text-[26px] uppercase leading-none text-[#ef233c] border border-[#dcdcdc] transition hover:opacity-90"
>
  <span className="translate-y-px">Buscar</span>
  <Search className="h-[26px] w-[26px]" strokeWidth={2.2} />
</button>
      </div>
    </form>
  )
}
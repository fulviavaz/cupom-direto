'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { FormEvent } from 'react'

type SearchCoupon = {
  id: number
  title: string
  discountText: string | null
  discountValue: number | null
  store: {
    id: number
    name: string
    slug: string
    logoUrl: string | null
  }
}

type SearchStore = {
  id: number
  name: string
  slug: string
  logoUrl: string | null
}

type SearchResults = {
  coupons: SearchCoupon[]
  stores: SearchStore[]
}

export default function HomeSearch() {
  const [search, setSearch] = useState('')
  const [results, setResults] = useState<SearchResults | null>(null)
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)

  const router = useRouter()
  const wrapperRef = useRef<HTMLDivElement | null>(null)

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const term = search.trim()

    if (!term) {
      router.push('/coupons')
      return
    }

    setOpen(false)
    router.push(`/coupons?search=${encodeURIComponent(term)}`)
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    const term = search.trim()

    if (!term) {
      setResults(null)
      setOpen(false)
      setLoading(false)
      return
    }

    const delay = setTimeout(async () => {
      try {
        setLoading(true)
        setOpen(true)

        const res = await fetch(`/api/search?q=${encodeURIComponent(term)}`)
        const data = await res.json()

        setResults(data)
      } catch (error) {
        console.error('Erro ao buscar sugestões:', error)
        setResults({ coupons: [], stores: [] })
      } finally {
        setLoading(false)
      }
    }, 250)

    return () => clearTimeout(delay)
  }, [search])

  function goToCouponsSearch() {
    const term = search.trim()
    if (!term) return

    setOpen(false)
    router.push(`/coupons?search=${encodeURIComponent(term)}`)
  }

  return (
    <div ref={wrapperRef} className="relative mx-auto mt-6 max-w-2xl">
      <form onSubmit={handleSubmit}>
        <div className="flex overflow-hidden rounded-2xl border border-white/20 bg-white shadow-lg">
          <div className="flex flex-1 items-center gap-3 px-4">
            <span className="text-gray-400">🔍</span>

            <input
              type="text"
              placeholder="Buscar cupons, lojas ou ofertas"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onFocus={() => {
                if (results || search.trim()) setOpen(true)
              }}
              className="w-full bg-transparent py-3 text-sm text-gray-800 placeholder:text-gray-500 outline-none"
            />
          </div>

          <button
            type="submit"
            className="bg-red-700 px-5 text-sm font-semibold text-white transition hover:bg-red-800"
          >
            Buscar
          </button>
        </div>
      </form>

      {open && (
        <div className="absolute z-50 mt-3 w-full overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl">
          {loading ? (
            <div className="p-4 text-sm text-gray-500">Buscando resultados...</div>
          ) : (
            <>
              {results?.coupons?.length ? (
                <div className="border-b border-gray-100">
                  <div className="px-4 pt-4 pb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Cupons
                  </div>

                  <div className="space-y-1 px-2 pb-3">
                    {results.coupons.map((coupon) => (
                      <button
                        key={coupon.id}
                        type="button"
                        onClick={goToCouponsSearch}
                        className="flex w-full items-center justify-between rounded-xl px-3 py-3 text-left transition hover:bg-gray-50"
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="flex h-12 w-14 shrink-0 items-center justify-center rounded-lg border border-gray-100 bg-gray-50">
                            {coupon.store.logoUrl ? (
                              <img
                                src={coupon.store.logoUrl}
                                alt={coupon.store.name}
                                className="h-8 w-10 object-contain"
                              />
                            ) : (
                              <span className="text-xs text-gray-400">Loja</span>
                            )}
                          </div>

                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-gray-900">
                              {coupon.title}
                            </p>
                            <p className="truncate text-xs text-gray-500">
                              {coupon.store.name}
                            </p>
                          </div>
                        </div>

                        <div className="ml-4 shrink-0 text-right">
                          {coupon.discountText && (
                            <p className="text-xs text-gray-500">
                              {coupon.discountText}
                            </p>
                          )}

                          {coupon.discountValue !== null && (
                            <p className="text-sm font-bold text-red-600">
                              {coupon.discountValue}%
                            </p>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}

              {results?.stores?.length ? (
                <div className={results?.coupons?.length ? 'border-b border-gray-100' : ''}>
                  <div className="px-4 pt-4 pb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Lojas
                  </div>

                  <div className="space-y-1 px-2 pb-3">
                    {results.stores.map((store) => (
                      <button
                        key={store.id}
                        type="button"
                        onClick={() => {
                          setOpen(false)
                          router.push(`/loja/${store.slug}`)
                        }}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition hover:bg-gray-50"
                      >
                        <div className="flex h-12 w-14 shrink-0 items-center justify-center rounded-lg border border-gray-100 bg-gray-50">
                          {store.logoUrl ? (
                            <img
                              src={store.logoUrl}
                              alt={store.name}
                              className="h-8 w-10 object-contain"
                            />
                          ) : (
                            <span className="text-xs text-gray-400">Loja</span>
                          )}
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-gray-900">
                            {store.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            Ver página da loja
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}

              {!results?.coupons?.length && !results?.stores?.length ? (
                <div className="p-4 text-sm text-gray-500">
                  Nenhum resultado encontrado.
                </div>
              ) : null}

              <div className="bg-gray-50 px-4 py-3">
                <button
                  type="button"
                  onClick={goToCouponsSearch}
                  className="text-sm font-semibold text-red-600 transition hover:text-red-700"
                >
                  Ver todos os resultados
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
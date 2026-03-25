'use client'

import { useEffect, useState } from 'react'

type Store = {
  id: number
  name: string
  slug: string
  logoUrl: string | null
  affiliateUrl: string | null
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export default function AdminStoresPage() {
  const [stores, setStores] = useState<Store[]>([])
  const [name, setName] = useState('')
  const [logoUrl, setLogoUrl] = useState('')
  const [affiliateUrl, setAffiliateUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  async function handleDelete(id: number) {
    const confirmed = window.confirm('Tem certeza que deseja excluir esta loja?')

    if (!confirmed) return

    try {
      const res = await fetch(`/api/stores/${id}`, {
        method: 'DELETE',
      })

      const data = await res.json()

      if (!res.ok) {
        setMessage(data.error || 'Erro ao excluir loja')
        return
      }

      setMessage('Loja excluída com sucesso!')
      await loadStores()
    } catch (error) {
      console.error('Erro ao excluir loja:', error)
      setMessage('Erro ao excluir loja')
    }
  }

  async function loadStores() {
    try {
      const res = await fetch('/api/stores')
      const data = await res.json()

      if (Array.isArray(data)) {
        setStores(data)
      } else {
        console.error('Resposta inesperada da API:', data)
        setStores([])
      }
    } catch (error) {
      console.error('Erro ao carregar lojas:', error)
      setStores([])
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const res = await fetch('/api/stores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          logoUrl,
          affiliateUrl,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setMessage(data.error || 'Erro ao cadastrar loja')
        setLoading(false)
        return
      }

      setMessage('Loja cadastrada com sucesso!')
      setName('')
      setLogoUrl('')
      setAffiliateUrl('')
      await loadStores()
    } catch (error) {
      console.error('Erro ao cadastrar loja:', error)
      setMessage('Erro ao cadastrar loja')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadStores()
  }, [])

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-5xl space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin - Lojas</h1>
          <p className="mt-2 text-gray-600">
            Cadastre e gerencie as lojas parceiras do portal.
          </p>
        </div>

        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900">
            Cadastrar nova loja
          </h2>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Nome da loja
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Magazine Luiza"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                URL da logo
              </label>
              <input
                type="text"
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                placeholder="https://exemplo.com/logo.png"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                URL de afiliado
              </label>
              <input
                type="text"
                value={affiliateUrl}
                onChange={(e) => setAffiliateUrl(e.target.value)}
                placeholder="https://www.loja.com.br"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-black px-5 py-3 text-white transition hover:opacity-90 disabled:opacity-50"
            >
              {loading ? 'Salvando...' : 'Salvar loja'}
            </button>

            {message && <p className="text-sm text-gray-700">{message}</p>}
          </form>
        </section>

        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900">
            Lojas cadastradas
          </h2>

          <div className="mt-6 space-y-4">
            {!Array.isArray(stores) || stores.length === 0 ? (
              <p className="text-gray-500">Nenhuma loja cadastrada ainda.</p>
            ) : (
              stores.map((store) => (
                <div
                  key={store.id}
                  className="rounded-xl border border-gray-200 p-4"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div className="space-y-1">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {store.name}
                      </h3>

                      <p className="text-sm text-gray-500">
                        Slug: {store.slug}
                      </p>

                      {store.logoUrl && (
                        <p className="break-all text-sm text-gray-500">
                          Logo: {store.logoUrl}
                        </p>
                      )}

                      {store.affiliateUrl && (
                        <p className="break-all text-sm text-gray-500">
                          Afiliado: {store.affiliateUrl}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col items-start gap-3 md:items-end">
                      <span className="inline-flex w-fit rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                        {store.isActive ? 'Ativa' : 'Inativa'}
                      </span>

                      <button
                        onClick={() => handleDelete(store.id)}
                        className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
                      >
                        Excluir
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </main>
  )
}
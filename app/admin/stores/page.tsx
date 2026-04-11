'use client'

import { useEffect, useState } from 'react'

type Store = {
  id: number
  name: string
  slug: string
  logoUrl: string | null
  affiliateUrl: string | null
  description?: string | null
  websiteUrl?: string | null
  isFeatured?: boolean
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export default function AdminStoresPage() {
  const [stores, setStores] = useState<Store[]>([])
  const [name, setName] = useState('')
  const [affiliateUrl, setAffiliateUrl] = useState('')
  const [description, setDescription] = useState('')
  const [websiteUrl, setWebsiteUrl] = useState('')
  const [isFeatured, setIsFeatured] = useState(false)
  const [isActive, setIsActive] = useState(true)

  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [currentLogoUrl, setCurrentLogoUrl] = useState('')

  const [editingId, setEditingId] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState('')

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

  function handleEdit(store: Store) {
    setEditingId(store.id)
    setName(store.name)
    setAffiliateUrl(store.affiliateUrl || '')
    setDescription(store.description || '')
    setWebsiteUrl(store.websiteUrl || '')
    setIsFeatured(store.isFeatured ?? false)
    setIsActive(store.isActive)
    setCurrentLogoUrl(store.logoUrl || '')
    setLogoFile(null)
    setMessage('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleCancelEdit() {
    setEditingId(null)
    setName('')
    setAffiliateUrl('')
    setDescription('')
    setWebsiteUrl('')
    setIsFeatured(false)
    setIsActive(true)
    setLogoFile(null)
    setCurrentLogoUrl('')
    setMessage('')
  }

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

      if (editingId === id) {
        handleCancelEdit()
      }

      await loadStores()
    } catch (error) {
      console.error('Erro ao excluir loja:', error)
      setMessage('Erro ao excluir loja')
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      let logoUrl = currentLogoUrl || ''

      if (logoFile) {
        setUploading(true)

        const formData = new FormData()
        formData.append('file', logoFile)

        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })

        const uploadData = await uploadRes.json()

        if (!uploadRes.ok) {
          setMessage(uploadData.error || 'Erro ao fazer upload da imagem')
          setLoading(false)
          setUploading(false)
          return
        }

        logoUrl = uploadData.secure_url
        setUploading(false)
      }

      const url = editingId ? `/api/stores/${editingId}` : '/api/stores'
      const method = editingId ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          logoUrl,
          affiliateUrl,
          description,
          websiteUrl,
          isFeatured,
          isActive,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setMessage(data.error || 'Erro ao salvar loja')
        setLoading(false)
        return
      }

      setMessage(
        editingId
          ? 'Loja atualizada com sucesso!'
          : 'Loja cadastrada com sucesso!'
      )

      setEditingId(null)
      setName('')
      setAffiliateUrl('')
      setDescription('')
      setWebsiteUrl('')
      setIsFeatured(false)
      setIsActive(true)
      setLogoFile(null)
      setCurrentLogoUrl('')

      await loadStores()
    } catch (error) {
      console.error('Erro ao salvar loja:', error)
      setMessage('Erro ao salvar loja')
    } finally {
      setLoading(false)
      setUploading(false)
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
            Cadastre e gerencie as lojas parceiras da plataforma.
          </p>
        </div>

        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900">
            {editingId ? 'Editar loja' : 'Cadastrar nova loja'}
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
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder:text-gray-400 outline-none focus:border-black"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Logo da loja
              </label>

              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    setLogoFile(e.target.files[0])
                  }
                }}
                className="block w-full text-sm text-gray-700"
              />

              {logoFile && (
                <img
                  src={URL.createObjectURL(logoFile)}
                  alt="Preview da logo"
                  className="mt-3 h-16 rounded-lg border border-gray-200 bg-white object-contain p-2"
                />
              )}

              {!logoFile && currentLogoUrl && (
                <img
                  src={currentLogoUrl}
                  alt="Logo atual"
                  className="mt-3 h-16 rounded-lg border border-gray-200 bg-white object-contain p-2"
                />
              )}
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
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder:text-gray-400 outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Descrição
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Breve descrição da loja"
                rows={3}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder:text-gray-400 outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Website
              </label>
              <input
                type="text"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                placeholder="https://www.loja.com"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder:text-gray-400 outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Destaque
              </label>
              <select
                value={isFeatured ? 'sim' : 'nao'}
                onChange={(e) => setIsFeatured(e.target.value === 'sim')}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-black"
              >
                <option value="nao">Não</option>
                <option value="sim">Sim</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                value={isActive ? 'ativa' : 'inativa'}
                onChange={(e) => setIsActive(e.target.value === 'ativa')}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-black"
              >
                <option value="ativa">Ativa</option>
                <option value="inativa">Inativa</option>
              </select>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading || uploading}
                className="rounded-lg bg-black px-5 py-3 text-white transition hover:opacity-90 disabled:opacity-50"
              >
                {uploading
                  ? 'Enviando logo...'
                  : loading
                  ? 'Salvando...'
                  : editingId
                  ? 'Atualizar loja'
                  : 'Salvar loja'}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="rounded-lg border border-gray-300 px-5 py-3 text-gray-700 transition hover:bg-gray-100"
                >
                  Cancelar
                </button>
              )}
            </div>

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
                    <div className="flex gap-4">
                    <div className="flex h-16 w-20 items-center justify-center overflow-hidden rounded-lg border border-gray-200 bg-white">
  {store.logoUrl ? (
    <img
      src={store.logoUrl}
      alt={store.name}
      className="h-full w-full object-contain p-2"
      onError={(e) => {
        e.currentTarget.style.display = 'none'
      }}
    />
  ) : (
    <span className="px-2 text-center text-xs text-gray-400">Sem logo</span>
  )}
</div>

                      <div className="space-y-1">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {store.name}
                        </h3>

                        <p className="text-sm text-gray-500">
                          Slug: {store.slug}
                        </p>

                        {store.websiteUrl && (
                          <p className="break-all text-sm text-gray-500">
                            Site: {store.websiteUrl}
                          </p>
                        )}

                        {store.affiliateUrl && (
                          <p className="break-all text-sm text-gray-500">
                            Afiliado: {store.affiliateUrl}
                          </p>
                        )}

                        {store.description && (
                          <p className="text-sm text-gray-500">
                            {store.description}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col items-start gap-3 md:items-end">
                      <div className="flex gap-2">
                        <span
                          className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-medium ${
                            store.isActive
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-200 text-gray-700'
                          }`}
                        >
                          {store.isActive ? 'Ativa' : 'Inativa'}
                        </span>

                        {(store.isFeatured ?? false) && (
                          <span className="inline-flex w-fit rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-700">
                            Destaque
                          </span>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(store)}
                          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                        >
                          Editar
                        </button>

                        <button
                          onClick={() => handleDelete(store.id)}
                          className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
                        >
                          Excluir
                        </button>
                      </div>
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
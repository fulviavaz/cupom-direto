'use client'

import { useEffect, useState } from 'react'

type Store = {
  id: number
  name: string
}

type Tag = {
  id: number
  name: string
  type: 'categoria' | 'beneficio' | 'produto' | 'especial'
}

type Coupon = {
  id: number
  title: string
  description: string | null
  code: string | null
  rules: string | null
  discountText: string | null
  discountValue: number | null
  couponType: 'coupon' | 'offer'
  redirectUrl: string | null
  imageUrl: string | null
  storeId: number
  usesCount: number
  store: {
    id: number
    name: string
  }
  couponTags: {
    tag: Tag
  }[]
  isFeatured: boolean
  isVerified: boolean
  isActive: boolean
  expiresAt: string | null
}

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [stores, setStores] = useState<Store[]>([])
  const [tags, setTags] = useState<Tag[]>([])

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [code, setCode] = useState('')
  const [rules, setRules] = useState('')
  const [discountText, setDiscountText] = useState('')
  const [discountValue, setDiscountValue] = useState('')
  const [couponType, setCouponType] = useState<'coupon' | 'offer'>('coupon')
  const [redirectUrl, setRedirectUrl] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [storeId, setStoreId] = useState('')
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([])
  const [isFeatured, setIsFeatured] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const [isActive, setIsActive] = useState(true)
  const [expiresAt, setExpiresAt] = useState('')

  const [editingId, setEditingId] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const categoryTags = tags.filter((tag) => tag.type === 'categoria')
const benefitTags = tags.filter((tag) => tag.type === 'beneficio')
const productTags = tags.filter((tag) => tag.type === 'produto')
const specialTags = tags.filter((tag) => tag.type === 'especial')

  async function loadCoupons() {
    try {
      const res = await fetch('/api/coupons')
      const data = await res.json()

      if (Array.isArray(data)) {
        setCoupons(data)
      } else {
        setCoupons([])
      }
    } catch (error) {
      console.error('Erro ao carregar cupons:', error)
      setCoupons([])
    }
  }

  async function loadStores() {
    try {
      const res = await fetch('/api/stores')
      const data = await res.json()

      if (Array.isArray(data)) {
        setStores(data)
      } else {
        setStores([])
      }
    } catch (error) {
      console.error('Erro ao carregar lojas:', error)
      setStores([])
    }
  }

  async function loadTags() {
    try {
      const res = await fetch('/api/tags')
      const data = await res.json()

      if (Array.isArray(data)) {
        setTags(data)
      } else {
        setTags([])
      }
    } catch (error) {
      console.error('Erro ao carregar tags:', error)
      setTags([])
    }
  }

  function getCouponTypeLabel(type: string) {
  switch (type) {
    case 'coupon':
      return 'Cupom'
    case 'offer':
      return 'Oferta'
    default:
      return type
  }
}
  useEffect(() => {
    loadCoupons()
    loadStores()
    loadTags()
  }, [])

  function resetForm() {
    setEditingId(null)
    setTitle('')
    setDescription('')
    setCode('')
    setRules('')
    setDiscountText('')
    setDiscountValue('')
    setCouponType('coupon')
    setRedirectUrl('')
    setImageUrl('')
    setStoreId('')
    setSelectedTagIds([])
    setIsFeatured(false)
    setIsVerified(false)
    setIsActive(true)
    setExpiresAt('')
    setMessage('')
  }

  function handleEdit(coupon: Coupon) {
    setEditingId(coupon.id)
    setTitle(coupon.title)
    setDescription(coupon.description || '')
    setCode(coupon.code || '')
    setRules(coupon.rules || '')
    setDiscountText(coupon.discountText || '')
    setDiscountValue(coupon.discountValue?.toString() || '')
    setCouponType(coupon.couponType)
    setRedirectUrl(coupon.redirectUrl || '')
    setImageUrl(coupon.imageUrl || '')
    setStoreId(String(coupon.storeId))
    setSelectedTagIds(coupon.couponTags.map((item) => item.tag.id))
    setIsFeatured(coupon.isFeatured)
    setIsVerified(coupon.isVerified)
    setIsActive(coupon.isActive)
    setExpiresAt(
      coupon.expiresAt ? new Date(coupon.expiresAt).toISOString().slice(0, 16) : ''
    )
    setMessage('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function toggleTag(tagId: number) {
    setSelectedTagIds((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId]
    )
  }

  async function handleDelete(id: number) {
    const confirmed = window.confirm('Tem certeza que deseja excluir este cupom?')
    if (!confirmed) return

    try {
      const res = await fetch(`/api/coupons/${id}`, {
        method: 'DELETE',
      })

      const data = await res.json()

      if (!res.ok) {
        setMessage(data.error || 'Erro ao excluir cupom')
        return
      }

      setMessage('Cupom excluído com sucesso!')

      if (editingId === id) {
        resetForm()
      }

      await loadCoupons()
    } catch (error) {
      console.error('Erro ao excluir cupom:', error)
      setMessage('Erro ao excluir cupom')
    }
  }



  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const url = editingId ? `/api/coupons/${editingId}` : '/api/coupons'
      const method = editingId ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description,
          code,
          rules,
          discountText,
          discountValue,
          couponType,
          redirectUrl,
          imageUrl,
          storeId,
          tagIds: selectedTagIds,
          isFeatured,
          isVerified,
          isActive,
          expiresAt,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setMessage(data.error || 'Erro ao salvar cupom')
        setLoading(false)
        return
      }

      setMessage(
        editingId
          ? 'Cupom atualizado com sucesso!'
          : 'Cupom cadastrado com sucesso!'
      )

      resetForm()
      await loadCoupons()
    } catch (error) {
      console.error('Erro ao salvar cupom:', error)
      setMessage('Erro ao salvar cupom')
    } finally {
      setLoading(false)
    }
  }


  function renderTagGroup(title: string, items: Tag[]) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-700">
        {title}
      </h3>

      <div className="grid gap-2 rounded-lg border border-gray-300 p-4 md:grid-cols-2">
        {items.length === 0 ? (
          <p className="text-sm text-gray-500">Nenhuma tag deste tipo cadastrada.</p>
        ) : (
          items.map((tag) => (
            <label
              key={tag.id}
              className="flex items-center gap-2 text-sm text-gray-700"
            >
              <input
                type="checkbox"
                checked={selectedTagIds.includes(tag.id)}
                onChange={() => toggleTag(tag.id)}
              />
              <span>{tag.name}</span>
            </label>
          ))
        )}
      </div>
    </div>
  )
  }
  
  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin - Cupons</h1>
          <p className="mt-2 text-gray-600">
            Cadastre e gerencie os cupons e ofertas da plataforma.
          </p>
        </div>

        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900">
            {editingId ? 'Editar cupom' : 'Cadastrar novo cupom'}
          </h2>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Título
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: 50% de desconto em qualquer tênis"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder:text-gray-400 outline-none focus:border-black"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Descrição
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descrição opcional"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder:text-gray-400 outline-none focus:border-black"
                rows={3}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Código do cupom
                </label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Ex: TENIS50"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder:text-gray-400 outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Tipo
                </label>
                <select
                  value={couponType}
                  onChange={(e) => setCouponType(e.target.value as 'coupon' | 'offer')}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-black"
                >
                  <option value="coupon">Cupom</option>
                  <option value="offer">Oferta</option>
                </select>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Regras / Regulamento
              </label>
              <textarea
                value={rules}
                onChange={(e) => setRules(e.target.value)}
                placeholder="Ex: válido apenas para primeira compra..."
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder:text-gray-400 outline-none focus:border-black"
                rows={3}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Texto do desconto
                </label>
                <input
                  type="text"
                  value={discountText}
                  onChange={(e) => setDiscountText(e.target.value)}
                  placeholder="Ex: 50% OFF"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder:text-gray-400 outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Valor numérico do desconto
                </label>
                <input
                  type="number"
                  value={discountValue}
                  onChange={(e) => setDiscountValue(e.target.value)}
                  placeholder="Ex: 50"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder:text-gray-400 outline-none focus:border-black"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  URL de redirecionamento
                </label>
                <input
                  type="text"
                  value={redirectUrl}
                  onChange={(e) => setRedirectUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder:text-gray-400 outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  URL da imagem
                </label>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder:text-gray-400 outline-none focus:border-black"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Loja
              </label>
              <select
                value={storeId}
                onChange={(e) => setStoreId(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-black"
                required
              >
                <option value="">Selecione uma loja</option>
                {stores.map((store) => (
                  <option key={store.id} value={store.id}>
                    {store.name}
                  </option>
                ))}
              </select>
            </div>

          <div className="space-y-4">
  <label className="block text-sm font-medium text-gray-700">
    Tags
  </label>

  {renderTagGroup('Categorias', categoryTags)}
  {renderTagGroup('Benefícios', benefitTags)}
  {renderTagGroup('Produtos', productTags)}
  {renderTagGroup('Especiais', specialTags)}
</div>

            <div className="grid gap-4 md:grid-cols-2">
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
                  Verificado
                </label>
                <select
                  value={isVerified ? 'sim' : 'nao'}
                  onChange={(e) => setIsVerified(e.target.value === 'sim')}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-black"
                >
                  <option value="nao">Não</option>
                  <option value="sim">Sim</option>
                </select>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  value={isActive ? 'ativo' : 'inativo'}
                  onChange={(e) => setIsActive(e.target.value === 'ativo')}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-black"
                >
                  <option value="ativo">Ativo</option>
                  <option value="inativo">Inativo</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Expiração
                </label>
                <input
                  type="datetime-local"
                  value={expiresAt}
                  onChange={(e) => setExpiresAt(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-black"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="rounded-lg bg-black px-5 py-3 text-white transition hover:opacity-90 disabled:opacity-50"
              >
                {loading ? 'Salvando...' : editingId ? 'Atualizar cupom' : 'Salvar cupom'}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
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
            Cupons cadastrados
          </h2>

          <div className="mt-6 space-y-4">
            {coupons.length === 0 ? (
              <p className="text-gray-500">Nenhum cupom cadastrado ainda.</p>
            ) : (
              coupons.map((coupon) => (
                <div
                  key={coupon.id}
                  className="rounded-xl border border-gray-200 p-4"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div className="space-y-1">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {coupon.title}
                      </h3>

                      <p className="text-sm text-gray-500">
                        Loja: {coupon.store?.name}
                      </p>

                      <p className="text-sm text-gray-500">
                        Tipo: {getCouponTypeLabel(coupon.couponType)}
                      </p>

                      <p className="text-sm text-gray-500">
  Cliques: {coupon.usesCount}
</p>

                      {coupon.discountText && (
                        <p className="text-sm text-gray-500">
                          Desconto: {coupon.discountText}
                        </p>
                      )}

                      couponTags
                    </div>

                    <div className="flex flex-col items-start gap-3 md:items-end">
                      <span
                        className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-medium ${
                          coupon.isActive
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-200 text-gray-700'
                        }`}
                      >
                        {coupon.isActive ? 'Ativo' : 'Inativo'}
                      </span>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(coupon)}
                          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                        >
                          Editar
                        </button>

                        <button
                          onClick={() => handleDelete(coupon.id)}
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
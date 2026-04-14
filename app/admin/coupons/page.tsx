'use client'

import { useEffect, useState } from 'react'

type Store = {
  id: number
  name: string
}

type Tag = {
  id: number
  name: string
  slug: string
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
  categoryId: number | null
  store: {
    id: number
    name: string
  }
  category: {
    id: number
    name: string
  } | null
  couponTags: {
    tag: Tag
  }[]
  isFeatured: boolean
  isVerified: boolean
  isActive: boolean
  usesCount: number
  expiresAt: string | null
}

type ImportResult = {
  success?: number
  errors?: string[]
  previewData?: {
    title: string
    store: string
    category: string
    code: string
    valid: boolean
  }[]
  mode?: 'preview' | 'import'
  error?: string
}

function getCouponTypeLabel(type: 'coupon' | 'offer') {
  switch (type) {
    case 'coupon':
      return 'Cupom'
    case 'offer':
      return 'Oferta'
    default:
      return type
  }
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
  const [categoryId, setCategoryId] = useState<number | ''>('')
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([])
  const [isFeatured, setIsFeatured] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const [isActive, setIsActive] = useState(true)
  const [expiresAt, setExpiresAt] = useState('')

  const [editingId, setEditingId] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const [file, setFile] = useState<File | null>(null)
  const [importing, setImporting] = useState(false)
  const [importResult, setImportResult] = useState<ImportResult | null>(null)
  const [previewData, setPreviewData] = useState<ImportResult['previewData']>([])

  const categoryTags = tags.filter((tag) => tag.type === 'categoria')
  const specialSelectionTags = tags.filter((tag) => tag.type !== 'categoria')

  async function loadCoupons() {
    try {
      const res = await fetch('/api/coupons')
      const data = await res.json()

      if (Array.isArray(data)) {
        setCoupons(data)
      } else {
        console.error('Resposta inesperada da API:', data)
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
        console.error('Resposta inesperada da API:', data)
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
        console.error('Resposta inesperada da API:', data)
        setTags([])
      }
    } catch (error) {
      console.error('Erro ao carregar tags:', error)
      setTags([])
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
    setCategoryId('')
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
    setCategoryId(coupon.categoryId ?? '')
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

  function toggleSpecialTag(tagId: number) {
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
          categoryId,
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

  async function handlePreview() {
    if (!file) return

    try {
      setImporting(true)
      setImportResult(null)

      const formData = new FormData()
      formData.append('file', file)
      formData.append('preview', 'true')

      const res = await fetch('/api/coupons/import', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()

      setPreviewData(data.previewData || [])
      setImportResult(data)
    } catch (error) {
      console.error('Erro ao gerar preview:', error)
      setImportResult({
        error: 'Erro ao gerar preview da planilha',
      })
      setPreviewData([])
    } finally {
      setImporting(false)
    }
  }

  async function handleImport() {
    if (!file) return

    try {
      setImporting(true)
      setImportResult(null)

      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/coupons/import', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()

      setImportResult(data)
      setPreviewData([])
      setFile(null)

      await loadCoupons()
    } catch (error) {
      console.error('Erro ao importar:', error)
      setImportResult({
        error: 'Erro ao importar planilha',
      })
    } finally {
      setImporting(false)
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin - Cupons</h1>
          <p className="mt-2 text-gray-600">
            Cadastre, edite e importe cupons em massa.
          </p>
        </div>

        {/* IMPORTAÇÃO */}
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">
            📥 Importar cupons por planilha
          </h2>

          <div className="flex flex-wrap items-center gap-3">
            <input
              type="file"
              accept=".xlsx,.csv"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="block text-sm text-gray-700"
            />

            <button
              type="button"
              onClick={handlePreview}
              disabled={!file || importing}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:opacity-50"
            >
              Pré-visualizar
            </button>

            <button
              type="button"
              onClick={handleImport}
              disabled={!file || importing}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:opacity-50"
            >
              {importing ? 'Processando...' : 'Confirmar importação'}
            </button>

            <a
              href="/api/coupons/template"
              className="inline-flex rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
            >
              Baixar modelo Excel
            </a>
          </div>

          {importResult?.error && (
            <p className="mt-4 text-sm text-red-600">{importResult.error}</p>
          )}

          {importResult && !importResult.error && (
            <div className="mt-4 text-sm">
              {typeof importResult.success === 'number' && (
                <p className="text-gray-700">
                  ✅ Importados: {importResult.success}
                </p>
              )}

              {importResult.errors && importResult.errors.length > 0 && (
                <div className="mt-3 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
                  <p className="font-medium">Erros encontrados:</p>
                  <ul className="mt-2 space-y-1">
                    {importResult.errors.map((err, i) => (
                      <li key={i}>- {err}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {previewData && previewData.length > 0 && (
            <div className="mt-6">
              <h3 className="mb-3 font-semibold text-gray-900">Pré-visualização</h3>

              <div className="overflow-auto rounded-lg border border-gray-200">
                <table className="w-full text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="p-3 text-left font-medium text-gray-700">Título</th>
                      <th className="p-3 text-left font-medium text-gray-700">Loja</th>
                      <th className="p-3 text-left font-medium text-gray-700">Categoria</th>
                      <th className="p-3 text-left font-medium text-gray-700">Código</th>
                      <th className="p-3 text-left font-medium text-gray-700">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {previewData.map((row, i) => (
                      <tr
                        key={i}
                        className={`border-t ${
                          row.valid ? 'bg-white' : 'bg-red-50'
                        }`}
                      >
                        <td className="p-3">{row.title}</td>
                        <td className="p-3">{row.store}</td>
                        <td className="p-3">{row.category}</td>
                        <td className="p-3">{row.code || '-'}</td>
                        <td className="p-3">
                          <span
                            className={`rounded-full px-2 py-1 text-xs font-medium ${
                              row.valid
                                ? 'bg-green-100 text-green-700'
                                : 'bg-red-100 text-red-700'
                            }`}
                          >
                            {row.valid ? 'Válido' : 'Inválido'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>

        {/* FORMULÁRIO */}
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

            <div className="grid gap-4 md:grid-cols-2">
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

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Categoria
                </label>
                <select
                  value={categoryId}
                  onChange={(e) =>
                    setCategoryId(e.target.value ? Number(e.target.value) : '')
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-black"
                  required
                >
                  <option value="">Selecione uma categoria</option>
                  {categoryTags.map((tag) => (
                    <option key={tag.id} value={tag.id}>
                      {tag.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Seleção especial
              </label>

              <div className="grid gap-2 rounded-lg border border-gray-300 p-4 md:grid-cols-2">
                {specialSelectionTags.length === 0 ? (
                  <p className="text-sm text-gray-500">
                    Nenhuma seleção especial cadastrada.
                  </p>
                ) : (
                  specialSelectionTags.map((tag) => (
                    <label
                      key={tag.id}
                      className="flex items-center gap-2 text-sm text-gray-700"
                    >
                      <input
                        type="checkbox"
                        checked={selectedTagIds.includes(tag.id)}
                        onChange={() => toggleSpecialTag(tag.id)}
                      />
                      <span>
                        {tag.name}{' '}
                        <span className="text-gray-400">({tag.type})</span>
                      </span>
                    </label>
                  ))
                )}
              </div>
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

        {/* LISTAGEM */}
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

                      {coupon.category && (
                        <p className="text-sm text-gray-500">
                          Categoria: {coupon.category.name}
                        </p>
                      )}

                      {coupon.discountText && (
                        <p className="text-sm text-gray-500">
                          Desconto: {coupon.discountText}
                        </p>
                      )}

                      <div className="flex flex-wrap gap-2 pt-1">
                        {coupon.couponTags.length > 0 ? (
                          coupon.couponTags.map((item) => (
                            <span
                              key={item.tag.id}
                              className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-700"
                            >
                              {item.tag.name}
                            </span>
                          ))
                        ) : (
                          <span className="text-sm text-gray-500">Nenhuma seleção especial</span>
                        )}
                      </div>
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
'use client'

import { getTagIcon, TAG_ICON_OPTIONS } from '@/lib/tag-icons'
import { useEffect, useState } from 'react'

type Tag = {
  id: number
  name: string
  slug: string
  icon: string | null
  type: 'categoria' | 'beneficio' | 'produto' | 'especial'
  isFeatured: boolean
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export default function AdminTagsPage() {
  const [tags, setTags] = useState<Tag[]>([])
  const [name, setName] = useState('')
  const [icon, setIcon] = useState('')
  const [type, setType] = useState<'categoria' | 'beneficio' | 'produto' | 'especial'>('categoria')
  const [isFeatured, setIsFeatured] = useState(false)
  const [isActive, setIsActive] = useState(true)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

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

  function handleEdit(tag: Tag) {
    setEditingId(tag.id)
    setName(tag.name)
    setIcon(tag.icon || '')
    setType(tag.type)
    setIsFeatured(tag.isFeatured)
    setIsActive(tag.isActive)
    setMessage('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleCancelEdit() {
    setEditingId(null)
    setName('')
    setIcon('')
    setType('categoria')
    setIsFeatured(false)
    setIsActive(true)
    setMessage('')
  }

  async function handleDelete(id: number) {
    const confirmed = window.confirm('Tem certeza que deseja excluir esta tag?')

    if (!confirmed) return

    try {
      const res = await fetch(`/api/tags/${id}`, {
        method: 'DELETE',
      })

      const data = await res.json()

      if (!res.ok) {
        setMessage(data.error || 'Erro ao excluir tag')
        return
      }

      setMessage('Tag excluída com sucesso!')

      if (editingId === id) {
        handleCancelEdit()
      }

      await loadTags()
    } catch (error) {
      console.error('Erro ao excluir tag:', error)
      setMessage('Erro ao excluir tag')
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const url = editingId ? `/api/tags/${editingId}` : '/api/tags'
      const method = editingId ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          icon,
          type,
          isFeatured,
          isActive,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setMessage(data.error || 'Erro ao salvar tag')
        setLoading(false)
        return
      }

      setMessage(
        editingId
          ? 'Tag atualizada com sucesso!'
          : 'Tag cadastrada com sucesso!'
      )

      setEditingId(null)
      setName('')
      setIcon('')
      setType('categoria')
      setIsFeatured(false)
      setIsActive(true)

      await loadTags()
    } catch (error) {
      console.error('Erro ao salvar tag:', error)
      setMessage('Erro ao salvar tag')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTags()
  }, [])

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-5xl space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin - Tags</h1>
          <p className="mt-2 text-gray-600">
            Cadastre e gerencie categorias, benefícios, produtos e tags especiais.
          </p>
        </div>

        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900">
            {editingId ? 'Editar tag' : 'Cadastrar nova tag'}
          </h2>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Nome da tag
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Restaurantes"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder:text-gray-400 outline-none focus:border-black"
                required
              />
            </div>

          <div>
  <label className="mb-2 block text-sm font-medium text-gray-700">
    Ícone
  </label>

  <div className="grid gap-3 md:grid-cols-[1fr_auto]">
    <select
      value={icon}
      onChange={(e) => setIcon(e.target.value)}
      className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-black"
    >
      <option value="">Selecione um ícone</option>
      {TAG_ICON_OPTIONS.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>

    <div className="flex items-center justify-center rounded-lg border border-gray-300 px-4">
      {(() => {
        const Icon = getTagIcon(icon)
        return <Icon className="h-5 w-5 text-red-600" />
      })()}
    </div>
  </div>
</div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Tipo
              </label>
              <select
                value={type}
                onChange={(e) =>
                  setType(
                    e.target.value as 'categoria' | 'beneficio' | 'produto' | 'especial'
                  )
                }
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-black"
              >
                <option value="categoria">Categoria</option>
                <option value="beneficio">Benefício</option>
                <option value="produto">Produto</option>
                <option value="especial">Especial</option>
              </select>
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
                disabled={loading}
                className="rounded-lg bg-black px-5 py-3 text-white transition hover:opacity-90 disabled:opacity-50"
              >
                {loading ? 'Salvando...' : editingId ? 'Atualizar tag' : 'Salvar tag'}
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
            Tags cadastradas
          </h2>

          <div className="mt-6 space-y-4">
            {!Array.isArray(tags) || tags.length === 0 ? (
              <p className="text-gray-500">Nenhuma tag cadastrada ainda.</p>
            ) : (
              tags.map((tag) => (
                <div
                  key={tag.id}
                  className="rounded-xl border border-gray-200 p-4"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div className="space-y-1">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {tag.name}
                      </h3>

                      <p className="text-sm text-gray-500">
                        Slug: {tag.slug}
                      </p>

                      <p className="text-sm text-gray-500">
                        Tipo: {tag.type}
                      </p>

                      {tag.icon && (
                        <p className="text-sm text-gray-500">
                          Ícone: {tag.icon}
                        </p>
                      )}

                      <p className="text-sm text-gray-500">
                        Destaque: {tag.isFeatured ? 'Sim' : 'Não'}
                      </p>
                    </div>

                    <div className="flex flex-col items-start gap-3 md:items-end">
                      <span
                        className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-medium ${
                          tag.isActive
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-200 text-gray-700'
                        }`}
                      >
                        {tag.isActive ? 'Ativa' : 'Inativa'}
                      </span>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(tag)}
                          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                        >
                          Editar
                        </button>

                        <button
                          onClick={() => handleDelete(tag.id)}
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
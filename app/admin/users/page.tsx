'use client'

import { useEffect, useState } from 'react'

type User = {
  id: number
  name: string
  email: string
  role: string
  createdAt: string
  updatedAt: string
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('admin')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  async function loadUsers() {
    try {
      const res = await fetch('/api/users')
      const data = await res.json()

      if (Array.isArray(data)) {
        setUsers(data)
      } else {
        setUsers([])
      }
    } catch (error) {
      console.error('Erro ao carregar usuários:', error)
      setUsers([])
    }
  }

  useEffect(() => {
    loadUsers()
  }, [])

  function resetForm() {
    setEditingId(null)
    setName('')
    setEmail('')
    setPassword('')
    setRole('admin')
    setMessage('')
  }

  function handleEdit(user: User) {
    setEditingId(user.id)
    setName(user.name)
    setEmail(user.email)
    setPassword('')
    setRole(user.role)
    setMessage('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function handleDelete(id: number) {
    const confirmed = window.confirm('Tem certeza que deseja excluir este usuário?')

    if (!confirmed) return

    try {
      const res = await fetch(`/api/users/${id}`, {
        method: 'DELETE',
      })

      const data = await res.json()

      if (!res.ok) {
        setMessage(data.error || 'Erro ao excluir usuário')
        return
      }

      setMessage('Usuário excluído com sucesso!')

      if (editingId === id) {
        resetForm()
      }

      await loadUsers()
    } catch (error) {
      console.error('Erro ao excluir usuário:', error)
      setMessage('Erro ao excluir usuário')
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const url = editingId ? `/api/users/${editingId}` : '/api/users'
      const method = editingId ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
          role,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setMessage(data.error || 'Erro ao salvar usuário')
        setLoading(false)
        return
      }

      setMessage(
        editingId
          ? 'Usuário atualizado com sucesso!'
          : 'Usuário cadastrado com sucesso!'
      )

      resetForm()
      await loadUsers()
    } catch (error) {
      console.error('Erro ao salvar usuário:', error)
      setMessage('Erro ao salvar usuário')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-5xl space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin - Usuários</h1>
          <p className="mt-2 text-gray-600">
            Cadastre e gerencie os usuários administrativos.
          </p>
        </div>

        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900">
            {editingId ? 'Editar usuário' : 'Cadastrar novo usuário'}
          </h2>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Nome
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Fulvia Vaz"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-black"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Ex: admin@empresa.com"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-black"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Senha {editingId ? '(preencha só se quiser trocar)' : ''}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="******"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-black"
                required={!editingId}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Papel
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-black"
              >
                <option value="admin">Admin</option>
                <option value="editor">Editor</option>
              </select>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="rounded-lg bg-black px-5 py-3 text-white transition hover:opacity-90 disabled:opacity-50"
              >
                {loading ? 'Salvando...' : editingId ? 'Atualizar usuário' : 'Salvar usuário'}
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
            Usuários cadastrados
          </h2>

          <div className="mt-6 space-y-4">
            {users.length === 0 ? (
              <p className="text-gray-500">Nenhum usuário cadastrado ainda.</p>
            ) : (
              users.map((user) => (
                <div
                  key={user.id}
                  className="rounded-xl border border-gray-200 p-4"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div className="space-y-1">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {user.name}
                      </h3>

                      <p className="text-sm text-gray-500">
                        Email: {user.email}
                      </p>

                      <p className="text-sm text-gray-500">
                        Papel: {user.role}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(user)}
                        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                      >
                        Editar
                      </button>

                      <button
                        onClick={() => handleDelete(user.id)}
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
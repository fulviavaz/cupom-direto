import Link from 'next/link'
import LogoutButton from '@/components/logout-button'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="flex min-h-screen w-64 flex-col bg-gray-900 p-6 text-white">
        <h2 className="mb-8 text-xl font-bold">Cupom Admin</h2>

        <nav className="flex flex-col gap-4 text-sm">
          <Link href="/admin" className="hover:text-red-400">
            Dashboard
          </Link>

          <Link href="/admin/stores" className="hover:text-red-400">
            Lojas
          </Link>

          <Link href="/admin/tags" className="hover:text-red-400">
            Tags
          </Link>

          <Link href="/admin/coupons" className="hover:text-red-400">
            Cupons
          </Link>
        </nav>

        <div className="mt-auto pt-8">
          <LogoutButton />
        </div>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b bg-white px-8 py-4">
          <h1 className="text-lg font-semibold text-gray-900">
            Painel administrativo
          </h1>

          <span className="text-sm text-gray-500">Bem-vinda 👋</span>
        </header>

        <main className="p-8">{children}</main>
      </div>
    </div>
  )
}
import LogoutButton from '@/components/logout-button'
import Link from 'next/link'


export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      
      {/* SIDEBAR */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col p-6">
        <h2 className="text-xl font-bold mb-8">Cupom Admin</h2>

        <nav className="flex flex-col gap-3 text-sm">
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

        <div className="mt-auto">
          <LogoutButton />
        </div>
      </aside>

      {/* CONTEÚDO */}
      <div className="flex-1 flex flex-col">

        {/* HEADER */}
        <header className="bg-white border-b px-8 py-4 flex justify-between items-center">
          <h1 className="text-lg font-semibold text-gray-900">
            Painel administrativo
          </h1>

          <span className="text-sm text-gray-500">
            Bem-vinda 👋
          </span>
        </header>

        {/* PAGE */}
        <main className="p-8">
          {children}
        </main>

      </div>
    </div>
  )
}
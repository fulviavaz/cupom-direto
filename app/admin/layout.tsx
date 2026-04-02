import Link from 'next/link'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 space-y-4 bg-gray-900 p-6 text-white">
        <h2 className="mb-6 text-lg font-bold">Admin</h2>

        <nav className="flex flex-col gap-3 text-sm">
          <Link href="/admin">Dashboard</Link>
          <Link href="/admin/stores">Lojas</Link>
          <Link href="/admin/tags">Tags</Link>
          <Link href="/admin/coupons">Cupons</Link>

        <a href="/login">Sair</a>
        </nav>
      </aside>

      <main className="flex-1 bg-gray-50 p-8">{children}</main>
    </div>
  )
}
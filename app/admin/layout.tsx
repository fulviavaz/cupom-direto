import Link from 'next/link'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen">

      {/* SIDEBAR */}
      <aside className="w-64 bg-gray-900 text-white p-6 space-y-4">
        <h2 className="text-lg font-bold mb-6">Admin</h2>

        <nav className="flex flex-col gap-3 text-sm">
          <Link href="/admin/stores">Lojas</Link>
          <Link href="/admin/tags">Tags</Link>
          <Link href="/admin/coupons">Cupons</Link>

          <a
            href="/login"
            onClick={() => {
              document.cookie = 'auth=false; path=/'
            }}
            className="mt-6 text-red-400"
          >
            Sair
          </a>
        </nav>
      </aside>

      {/* CONTEÚDO */}
      <main className="flex-1 p-8 bg-gray-50">
        {children}
      </main>
    </div>
  )
}
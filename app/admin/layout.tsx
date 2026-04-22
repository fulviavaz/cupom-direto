import Link from 'next/link'
import LogoutButton from '@/components/logout-button'

const navItems = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/coupons', label: 'Cupons' },
  { href: '/admin/stores', label: 'Lojas' },
  { href: '/admin/tags', label: 'Tags' },
  { href: '/admin/users', label: 'Usuários' },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-[#f5f6f8] text-[#111]">
      <div className="flex min-h-screen">
        {/* SIDEBAR */}
        <aside className="sticky top-0 flex h-screen w-[280px] shrink-0 flex-col border-r border-black/5 bg-white">
          <div className="border-b border-black/5 px-6 py-6">
            <p className="font-title text-[28px] uppercase leading-none text-[#ef233c]">
              Cupom Direto
            </p>
            <p className="mt-2 text-xs font-medium uppercase tracking-wide text-[#666]">
              Painel administrativo
            </p>
          </div>

          <nav className="flex-1 px-4 py-5">
            <div className="space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block rounded-2xl px-4 py-3 text-sm font-semibold text-[#222] transition hover:bg-[#f3f3f3]"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>

          <div className="border-t border-black/5 px-4 py-4">
            <div className="space-y-2">
              <Link
                href="/"
                target="_blank"
                className="block rounded-2xl border border-black/10 px-4 py-3 text-sm font-semibold text-[#222] transition hover:bg-[#f5f5f5]"
              >
                Ver site
              </Link>

              <LogoutButton />
            </div>
          </div>
        </aside>

        {/* CONTENT */}
        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-20 border-b border-black/5 bg-white/90 backdrop-blur">
            <div className="flex h-[76px] items-center justify-between px-8">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#888]">
                  Admin
                </p>
                <h1 className="mt-1 text-lg font-bold text-[#111]">
                  Gestão da plataforma
                </h1>
              </div>

              <div className="rounded-full bg-[#f5f6f8] px-4 py-2 text-sm font-semibold text-[#444]">
                Ambiente de gestão
              </div>
            </div>
          </header>

          <main className="px-8 py-8">{children}</main>
        </div>
      </div>
    </div>
  )
}
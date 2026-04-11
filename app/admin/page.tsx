import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import CouponsChart from '@/components/admin/coupons-chart'

export default async function AdminDashboardPage() {
  const totalCoupons = await prisma.coupon.count()

  const activeCoupons = await prisma.coupon.count({
    where: {
      isActive: true,
    },
  })

  const inactiveCoupons = await prisma.coupon.count({
    where: {
      isActive: false,
    },
  })

  const totalStores = await prisma.store.count()

  const totalTags = await prisma.tag.count()

  const totalClicksResult = await prisma.coupon.aggregate({
    _sum: {
      usesCount: true,
    },
  })

  const totalClicks = totalClicksResult._sum.usesCount ?? 0

  const topCoupons = await prisma.coupon.findMany({
    orderBy: {
      usesCount: 'desc',
    },
    include: {
      store: true,
      category: true,
    },
    take: 5,
  })

  const chartData = topCoupons.map((coupon) => ({
    title:
      coupon.title.length > 20
        ? coupon.title.slice(0, 20) + '...'
        : coupon.title,
    clicks: coupon.usesCount,
  }))

  const stores = await prisma.store.findMany({
    include: {
      coupons: true,
    },
  })

  const topStores = stores
    .map((store) => ({
      id: store.id,
      name: store.name,
      slug: store.slug,
      clicks: store.coupons.reduce((sum, coupon) => sum + coupon.usesCount, 0),
      couponsCount: store.coupons.length,
    }))
    .sort((a, b) => b.clicks - a.clicks)
    .slice(0, 5)

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl space-y-8 p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="mt-2 text-gray-600">
              Visão geral da performance da plataforma.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/admin/stores"
              className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
            >
              Gerenciar lojas
            </Link>

            <Link
              href="/admin/tags"
              className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
            >
              Gerenciar tags
            </Link>

            <Link
              href="/admin/coupons"
              className="rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
            >
              Gerenciar cupons
            </Link>
          </div>
        </div>

        {/* CARDS PRINCIPAIS */}
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md">
            <p className="text-sm text-gray-500">Total de cupons</p>
            <p className="mt-3 text-3xl font-bold text-gray-900">
              {totalCoupons}
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md">
            <p className="text-sm text-gray-500">Cupons ativos</p>
            <p className="mt-3 text-3xl font-bold text-green-600">
              {activeCoupons}
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md">
            <p className="text-sm text-gray-500">Cupons inativos</p>
            <p className="mt-3 text-3xl font-bold text-gray-700">
              {inactiveCoupons}
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md">
            <p className="text-sm text-gray-500">Lojas cadastradas</p>
            <p className="mt-3 text-3xl font-bold text-gray-900">
              {totalStores}
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md">
            <p className="text-sm text-gray-500">Tags cadastradas</p>
            <p className="mt-3 text-3xl font-bold text-gray-900">
              {totalTags}
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md">
            <p className="text-sm text-gray-500">Total de cliques</p>
            <p className="mt-3 text-3xl font-bold text-red-600">
              {totalClicks}
            </p>
          </div>
        </section>

        {/* GRÁFICO */}
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">
            📊 Cliques por cupom
          </h2>

          <CouponsChart data={chartData} />
        </section>

        <section className="grid gap-6 xl:grid-cols-2">
          {/* TOP CUPONS */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-5">
              <h2 className="text-xl font-semibold text-gray-900">
                Top cupons
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Cupons com maior número de cliques.
              </p>
            </div>

            <div className="space-y-4">
              {topCoupons.length === 0 ? (
                <p className="text-sm text-gray-500">
                  Nenhum cupom encontrado.
                </p>
              ) : (
                topCoupons.map((coupon, index) => (
                  <div
                    key={coupon.id}
                    className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 p-4"
                  >
                    <div>
                      <p className="text-sm text-gray-400">#{index + 1}</p>
                      <h3 className="font-semibold text-gray-900">
                        {coupon.title}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Loja: {coupon.store.name}
                      </p>
                      {coupon.category && (
                        <p className="text-xs text-gray-400">
                          Categoria: {coupon.category.name}
                        </p>
                      )}
                    </div>

                    <div className="text-right">
                      <p className="text-sm text-gray-400">Cliques</p>
                      <p className="text-xl font-bold text-red-600">
                        {coupon.usesCount}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* TOP LOJAS */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-5">
              <h2 className="text-xl font-semibold text-gray-900">
                Top lojas
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Lojas com maior número de cliques somados.
              </p>
            </div>

            <div className="space-y-4">
              {topStores.length === 0 ? (
                <p className="text-sm text-gray-500">
                  Nenhuma loja encontrada.
                </p>
              ) : (
                topStores.map((store, index) => (
                  <div
                    key={store.id}
                    className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 p-4"
                  >
                    <div>
                      <p className="text-sm text-gray-400">#{index + 1}</p>
                      <h3 className="font-semibold text-gray-900">
                        {store.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Cupons: {store.couponsCount}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-sm text-gray-400">Cliques</p>
                      <p className="text-xl font-bold text-red-600">
                        {store.clicks}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
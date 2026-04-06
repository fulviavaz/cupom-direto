import { prisma } from '@/lib/prisma'

export default async function AdminDashboardPage() {
  const totalCoupons = await prisma.coupon.count()

  const activeCoupons = await prisma.coupon.count({
    where: {
      isActive: true,
    },
  })

  const totalStores = await prisma.store.count()

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
    },
    take: 5,
  })

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
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Visão geral da performance da plataforma.
          </p>
        </div>

        {/* CARDS PRINCIPAIS */}
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl bg-white p-6 shadow-sm border hover:shadow-md transition">
  <p className="text-sm text-gray-500">Total de cupons</p>
  <p className="mt-2 text-3xl font-bold text-gray-900">
    {totalCoupons}
  </p>
</div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">Cupons ativos</p>
            <p className="mt-3 text-3xl font-bold text-gray-900">
              {activeCoupons}
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">Lojas cadastradas</p>
            <p className="mt-3 text-3xl font-bold text-gray-900">
              {totalStores}
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">Total de cliques</p>
            <p className="mt-3 text-3xl font-bold text-red-600">
              {totalClicks}
            </p>
          </div>
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
                      <p className="text-sm text-gray-400">
                        #{index + 1}
                      </p>
                      <h3 className="font-semibold text-gray-900">
                        {coupon.title}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Loja: {coupon.store.name}
                      </p>
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
                      <p className="text-sm text-gray-400">
                        #{index + 1}
                      </p>
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
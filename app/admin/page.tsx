import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import CouponsChart from '@/components/admin/coupons-chart'
import ClicksChart from '@/components/admin/clicks-chart'

export default async function AdminDashboardPage() {
  const totalCoupons = await prisma.coupon.count()

  const activeCoupons = await prisma.coupon.count({
    where: { isActive: true },
  })

  const inactiveCoupons = await prisma.coupon.count({
    where: { isActive: false },
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
        ? `${coupon.title.slice(0, 20)}...`
        : coupon.title,
    clicks: coupon.usesCount,
  }))

  const last7Days = await prisma.clickEvent.findMany({
    where: {
      createdAt: {
        gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      },
    },
    orderBy: {
      createdAt: 'asc',
    },
  })

  const clicksByDayMap: Record<string, number> = {}

  last7Days.forEach((click) => {
    const date = click.createdAt.toISOString().split('T')[0]
    if (!clicksByDayMap[date]) clicksByDayMap[date] = 0
    clicksByDayMap[date] += 1
  })

  const clicksChartData = Object.entries(clicksByDayMap).map(
    ([date, clicks]) => ({
      date,
      clicks,
    })
  )

  const stores = await prisma.store.findMany({
    include: {
      coupons: true,
    },
  })

  const topStores = stores
    .map((store) => ({
      id: store.id,
      name: store.name,
      clicks: store.coupons.reduce((sum, coupon) => sum + coupon.usesCount, 0),
      couponsCount: store.coupons.length,
    }))
    .sort((a, b) => b.clicks - a.clicks)
    .slice(0, 5)

  return (
    <div className="space-y-8">
      {/* HERO */}
      <section className="rounded-[28px] bg-white p-8 shadow-sm ring-1 ring-black/5">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#888]">
              Visão geral
            </p>
            <h2 className="mt-2 font-title text-[42px] uppercase leading-none text-[#111]">
              Dashboard
            </h2>
            <p className="mt-3 max-w-2xl text-sm text-[#666]">
              Acompanhe o desempenho dos cupons, lojas e cliques da plataforma
              em um só lugar.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/admin/coupons"
              className="rounded-2xl bg-[#ef233c] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
            >
              Gerenciar cupons
            </Link>
            <Link
              href="/admin/stores"
              className="rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-[#222] transition hover:bg-[#f6f6f6]"
            >
              Gerenciar lojas
            </Link>
          </div>
        </div>
      </section>

      {/* KPI CARDS */}
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
        <DashboardCard label="Total de cupons" value={totalCoupons} />
        <DashboardCard label="Cupons ativos" value={activeCoupons} accent="green" />
        <DashboardCard label="Cupons inativos" value={inactiveCoupons} />
        <DashboardCard label="Lojas" value={totalStores} />
        <DashboardCard label="Tags" value={totalTags} />
        <DashboardCard label="Cliques" value={totalClicks} accent="red" />
      </section>

      {/* CHARTS */}
      <section className="grid gap-6 xl:grid-cols-2">
        <DashboardPanel
          title="Cliques por cupom"
          description="Top cupons com maior volume de cliques."
        >
          <CouponsChart data={chartData} />
        </DashboardPanel>

        <DashboardPanel
          title="Cliques nos últimos 7 dias"
          description="Evolução recente do interesse dos usuários."
        >
          <ClicksChart data={clicksChartData} />
        </DashboardPanel>
      </section>

      {/* RANKINGS */}
      <section className="grid gap-6 xl:grid-cols-2">
        <DashboardPanel
          title="Top cupons"
          description="Cupons com maior número de cliques."
        >
          <div className="space-y-3">
            {topCoupons.length === 0 ? (
              <EmptyState text="Nenhum cupom encontrado." />
            ) : (
              topCoupons.map((coupon, index) => (
                <div
                  key={coupon.id}
                  className="flex items-center justify-between rounded-2xl bg-[#f7f7f8] px-4 py-4"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-wide text-[#999]">
                      #{index + 1}
                    </p>
                    <h3 className="truncate text-sm font-bold text-[#111]">
                      {coupon.title}
                    </h3>
                    <p className="text-xs text-[#666]">
                      {coupon.store.name}
                      {coupon.category ? ` • ${coupon.category.name}` : ''}
                    </p>
                  </div>

                  <div className="ml-4 text-right">
                    <p className="text-xs uppercase tracking-wide text-[#999]">
                      Cliques
                    </p>
                    <p className="text-xl font-bold text-[#ef233c]">
                      {coupon.usesCount}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </DashboardPanel>

        <DashboardPanel
          title="Top lojas"
          description="Lojas com maior volume total de cliques."
        >
          <div className="space-y-3">
            {topStores.length === 0 ? (
              <EmptyState text="Nenhuma loja encontrada." />
            ) : (
              topStores.map((store, index) => (
                <div
                  key={store.id}
                  className="flex items-center justify-between rounded-2xl bg-[#f7f7f8] px-4 py-4"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-wide text-[#999]">
                      #{index + 1}
                    </p>
                    <h3 className="truncate text-sm font-bold text-[#111]">
                      {store.name}
                    </h3>
                    <p className="text-xs text-[#666]">
                      {store.couponsCount} cupons cadastrados
                    </p>
                  </div>

                  <div className="ml-4 text-right">
                    <p className="text-xs uppercase tracking-wide text-[#999]">
                      Cliques
                    </p>
                    <p className="text-xl font-bold text-[#ef233c]">
                      {store.clicks}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </DashboardPanel>
      </section>
    </div>
  )
}

function DashboardCard({
  label,
  value,
  accent,
}: {
  label: string
  value: number
  accent?: 'red' | 'green'
}) {
  const color =
    accent === 'red'
      ? 'text-[#ef233c]'
      : accent === 'green'
      ? 'text-[#16a34a]'
      : 'text-[#111]'

  return (
    <div className="rounded-[24px] bg-white p-6 shadow-sm ring-1 ring-black/5">
      <p className="text-sm font-medium text-[#777]">{label}</p>
      <p className={`mt-3 text-[34px] font-bold leading-none ${color}`}>
        {value}
      </p>
    </div>
  )
}

function DashboardPanel({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <div className="rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-black/5">
      <div className="mb-5">
        <h3 className="text-lg font-bold text-[#111]">{title}</h3>
        <p className="mt-1 text-sm text-[#666]">{description}</p>
      </div>
      {children}
    </div>
  )
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="rounded-2xl bg-[#f7f7f8] px-4 py-8 text-center text-sm text-[#777]">
      {text}
    </div>
  )
}
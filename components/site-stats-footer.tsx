import { prisma } from '@/lib/prisma'

export default async function SiteStatsFooter() {
  const totalCoupons = await prisma.coupon.count({
    where: {
      isActive: true,
    },
  })

  const totalOffers = await prisma.coupon.count({
    where: {
      isActive: true,
      couponType: 'offer',
    },
  })

  const totalStores = await prisma.store.count({
    where: {
      isActive: true,
    },
  })

  const totalCategories = await prisma.tag.count({
    where: {
      type: 'categoria',
      isActive: true,
    },
  })

  const totalSpecialDates = await prisma.tag.count({
    where: {
      type: 'especial',
      isActive: true,
    },
  })

  return (
    <section className="mb-20">
      <div className="grid grid-cols-2 gap-3 rounded-[20px] bg-[#ececec] p-6 md:grid-cols-5">
        <MetricFooter value={totalCoupons} label="Cupons" />
        <MetricFooter value={totalOffers} label="Promoções" />
        <MetricFooter value={totalStores} label="Lojas" />
        <MetricFooter value={totalCategories} label="Categorias" />
        <MetricFooter value={totalSpecialDates} label="Datas especiais" />
      </div>
    </section>
  )
}

function MetricFooter({
  value,
  label,
}: {
  value: number
  label: string
}) {
  return (
    <div className="text-center">
      <p className="text-[28px] font-bold text-[#ef233c]">{value}</p>
      <p className="text-[10px] uppercase text-[#555]">{label}</p>
    </div>
  )
}
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { getTagIcon } from '@/lib/tag-icons'
import CouponsList from '@/components/coupons-list'
import HomeSearch from '@/components/home-search'
import SiteStatsFooter from '@/components/site-stats-footer'

type Props = {
  params: Promise<{
    slug: string
  }>
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params

  const category = await prisma.tag.findFirst({
    where: {
      slug,
      type: 'categoria',
      isActive: true,
    },
  })

  if (!category) {
    notFound()
  }

  const coupons = await prisma.coupon.findMany({
    where: {
      isActive: true,
      categoryId: category.id,
    },
    include: {
      store: {
        include: {
          _count: {
            select: {
              coupons: {
                where: {
                  isActive: true,
                },
              },
            },
          },
        },
      },
      category: true,
      couponTags: {
        include: {
          tag: true,
        },
      },
    },
    orderBy: [
      { isFeatured: 'desc' },
      { createdAt: 'desc' },
    ],
  })

  const totalCoupons = coupons.length
  const totalOffers = coupons.filter((coupon) => coupon.couponType === 'offer').length
  const totalDiscountCodes = coupons.filter((coupon) => coupon.couponType === 'coupon').length

  const uniqueStoreIds = new Set(coupons.map((coupon) => coupon.storeId))
  const totalStores = uniqueStoreIds.size

  const Icon = getTagIcon(category.icon)

  const totalCouponsGlobal = await prisma.coupon.count({
  where: {
    isActive: true,
  },
})

const totalOffersGlobal = await prisma.coupon.count({
  where: {
    isActive: true,
    couponType: 'offer',
  },
})

const totalStoresGlobal = await prisma.store.count({
  where: {
    isActive: true,
  },
})

const totalCategoriesGlobal = await prisma.tag.count({
  where: {
    type: 'categoria',
    isActive: true,
  },
})

const totalSpecialDatesGlobal = await prisma.tag.count({
  where: {
    type: 'especial',
    isActive: true,
  },
})

  return (
    <main className="bg-[#f3f3f3]">
      <div className="mx-auto max-w-[1440px] px-10 pt-10">
        {/* TOPO */}
        <section className="mb-14">
          <div className="grid items-end gap-8 md:grid-cols-[280px_1fr]">
            <div className="flex items-end justify-center md:justify-start">
              <img
                src="/logo-cupom-direto.png"
                alt="Cupom Direto"
                className="h-auto w-[280px] object-contain"
              />
            </div>

            <div>
              <h1 className="font-title mb-6 text-center text-[46px] uppercase leading-[0.95] tracking-tight text-[#111] md:text-left">
                Conectando você com os melhores cupons!
              </h1>

              <HomeSearch />
            </div>
          </div>
        </section>

        {/* BLOCO DA CATEGORIA */}
        <section className="mb-12">
          <div className="grid gap-5 lg:grid-cols-[320px_1fr]">
            {/* CARD ESQUERDA */}
            <div>
              <h2 className="font-title mb-5 text-[28px] uppercase leading-none text-[#ef233c]">
                Categoria selecionada
              </h2>

              <div className="flex min-h-[156px] items-center gap-5 rounded-[20px] bg-[#ef233c] px-7 py-6 text-white">
                <div className="shrink-0">
                  <Icon className="h-[68px] w-[68px]" strokeWidth={1.8} />
                </div>

                <div>
                  <p className="font-title text-[34px] uppercase leading-none tracking-tight">
                    {category.name}
                  </p>
                </div>
              </div>
            </div>

            {/* RESUMO */}
            <div>
              <h2 className="font-title mb-5 text-[28px] uppercase leading-none text-[#111]">
                Resumo da categoria
              </h2>

              <div className="grid grid-cols-2 gap-4 rounded-[20px] bg-[#ececec] p-6 md:grid-cols-4">
                <MetricCard
                  value={totalDiscountCodes}
                  label="Códigos de descontos"
                />
                <MetricCard
                  value={totalOffers}
                  label="Ofertas"
                />
                <MetricCard
                  value={totalCoupons}
                  label="Número de cupons"
                />
                <MetricCard
                  value={totalStores}
                  label="Lojas"
                />
              </div>
            </div>
          </div>
        </section>

        {/* CUPONS */}
        <section className="mb-16">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-title text-[28px] uppercase leading-none text-[#ef233c]">
              Cupons em destaque
            </h2>

            <a
              href="/coupons"
              className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-wide text-[#111] hover:text-[#ef233c]"
            >
              <span className="flex h-[18px] w-[18px] items-center justify-center rounded-full bg-[#ef233c] text-[12px] text-white">
                +
              </span>
              Buscar mais cupons
            </a>
          </div>

          <CouponsList coupons={coupons} />
        </section>

        {/* BLOCO FINAL */}
        <section className="mb-8">
          <div className="grid items-end gap-8 md:grid-cols-[280px_1fr]">
            <div className="flex items-end justify-center md:justify-start">
              <img
                src="/logo-cupom-direto.png"
                alt="Cupom Direto"
                className="h-auto w-[280px] object-contain"
              />
            </div>

            <div>
              <h2 className="font-title mb-6 text-center text-[46px] uppercase leading-[0.95] tracking-tight text-[#111] md:text-left">
                Conectando você com os melhores cupons!
              </h2>

              <HomeSearch />
            </div>
          </div>
        </section>

      <SiteStatsFooter />
      </div>
    </main>
  )
}

function MetricCard({
  value,
  label,
}: {
  value: number
  label: string
}) {
  return (
    <div className="text-center">
      <p className="font-title text-[34px] leading-none text-[#ef233c]">
        {String(value).padStart(2, '0')}
      </p>
      <p className="mt-2 text-[12px] font-medium uppercase leading-[1.1] text-[#222]">
        {label}
      </p>
    </div>
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
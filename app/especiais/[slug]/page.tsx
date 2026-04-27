import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import CouponsList from '@/components/coupons-list'
import SiteHeroSearch from '@/components/site-hero-search'
import SiteStatsFooter from '@/components/site-stats-footer'

type Props = {
  params: Promise<{
    slug: string
  }>
}

function isCouponVisible(coupon: {
  isActive: boolean
  startsAt: Date | null
  expiresAt: Date | null
}) {
  const now = new Date()

  const startsAtOk = !coupon.startsAt || coupon.startsAt <= now
  const expiresAtOk = !coupon.expiresAt || coupon.expiresAt >= now

  return coupon.isActive && startsAtOk && expiresAtOk
}

export default async function EspecialPage({ params }: Props) {
  const { slug } = await params

  const special = await prisma.tag.findFirst({
    where: {
      slug,
      type: 'especial',
      isActive: true,
    },
    include: {
      couponTags: {
        include: {
          coupon: {
            include: {
              store: {
                include: {
                  _count: {
                    select: {
                      coupons: {
                        where: {
                          isActive: true,
                          AND: [
                            {
                              OR: [
                                { startsAt: null },
                                { startsAt: { lte: new Date() } },
                              ],
                            },
                            {
                              OR: [
                                { expiresAt: null },
                                { expiresAt: { gte: new Date() } },
                              ],
                            },
                          ],
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
          },
        },
      },
    },
  })

  if (!special) {
    notFound()
  }

  const coupons = special.couponTags
    .map((item) => item.coupon)
    .filter(isCouponVisible)
    .sort((a, b) => {
      if (a.isFeatured === b.isFeatured) {
        return b.createdAt.getTime() - a.createdAt.getTime()
      }

      return a.isFeatured ? -1 : 1
    })

  const totalCoupons = coupons.length

  const totalOffers = coupons.filter(
    (coupon) => coupon.couponType === 'offer'
  ).length

  const totalDiscountCodes = coupons.filter(
    (coupon) => coupon.couponType === 'coupon'
  ).length

  const totalStores = new Set(coupons.map((coupon) => coupon.storeId)).size

  return (
    <main className="bg-[#f3f3f3]">
      <div className="mx-auto max-w-[1440px] px-6 pt-10 md:px-10">
        <SiteHeroSearch title={special.name} />

        {/* BLOCO DA SELEÇÃO ESPECIAL */}
        <section className="mb-12">
          <div className="grid gap-5 lg:grid-cols-[320px_1fr]">
            <div>
              <h2 className="font-title mb-5 text-[28px] uppercase leading-none text-[#ef233c]">
                Categoria especial
              </h2>

              <div className="flex min-h-[156px] items-center gap-5 rounded-[20px] bg-[#ef233c] px-7 py-6 text-white">
                <div>
                  <p className="font-title text-[34px] uppercase leading-none tracking-tight">
                    {special.name}
                  </p>

                  <p className="mt-3 max-w-[220px] text-sm font-medium leading-relaxed text-white/90">
                    Seleção especial de cupons, ofertas e promoções.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="font-title mb-5 text-[28px] uppercase leading-none text-[#111]">
                Resumo da categoria
              </h2>

              <div className="grid grid-cols-2 gap-4 rounded-[20px] bg-[#ececec] p-6 md:grid-cols-4">
                <MetricCard
                  value={totalDiscountCodes}
                  label="Códigos de descontos"
                />
                <MetricCard value={totalOffers} label="Ofertas" />
                <MetricCard value={totalCoupons} label="Número de cupons" />
                <MetricCard value={totalStores} label="Lojas" />
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
              href="/especiais"
              className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-wide text-[#111] hover:text-[#ef233c]"
            >
              <span className="flex h-[18px] w-[18px] items-center justify-center rounded-full bg-[#ef233c] text-[12px] text-white">
                +
              </span>
              Ver especiais
            </a>
          </div>

          <CouponsList coupons={coupons} />
        </section>

        <SiteHeroSearch />
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
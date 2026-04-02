import { prisma } from '@/lib/prisma'
import CouponsList from '@/components/coupons-list'
import { notFound } from 'next/navigation'

type Props = {
  params: Promise<{
    slug: string
  }>
}

export default async function StorePage({ params }: Props) {
  const { slug } = await params

  const store = await prisma.store.findUnique({
    where: {
      slug,
    },
    include: {
      coupons: {
        where: {
          isActive: true,
        },
        include: {
          store: true,
          couponTags: {
            include: {
              tag: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  })

  if (!store) {
    notFound()
  }

  const totalCoupons = store.coupons.length
  const totalOffers = store.coupons.filter(
    (coupon) => coupon.couponType === 'offer'
  ).length
  const totalCouponCodes = store.coupons.filter(
    (coupon) => coupon.couponType === 'coupon'
  ).length

  const bestDiscount = store.coupons.reduce((max, coupon) => {
    const value = coupon.discountValue ?? 0
    return value > max ? value : max
  }, 0)

  return (
    <main className="min-h-screen bg-[#f5f5f5] py-10">
      <div className="mx-auto max-w-6xl space-y-8 px-6">
        {/* HERO / CABEÇALHO */}
        <section className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-gray-200">
          <div className="grid gap-8 p-8 lg:grid-cols-[280px_1fr] lg:items-center">
            <div className="flex items-center justify-center rounded-2xl border border-gray-200 bg-gray-50 p-8">
              {store.logoUrl ? (
                <img
                  src={store.logoUrl}
                  alt={store.name}
                  className="h-20 w-40 object-contain"
                />
              ) : (
                <span className="text-lg font-medium text-gray-400">
                  {store.name}
                </span>
              )}
            </div>

            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-red-600">
                Loja selecionada
              </p>

              <h1 className="mt-3 text-3xl font-bold text-gray-900 md:text-4xl">
                Cupons da {store.name}
              </h1>

              {store.description ? (
                <p className="mt-4 max-w-3xl text-gray-600">
                  {store.description}
                </p>
              ) : (
                <p className="mt-4 max-w-3xl text-gray-600">
                  Explore os cupons, ofertas e descontos ativos da loja{' '}
                  <span className="font-semibold text-gray-800">
                    {store.name}
                  </span>
                  .
                </p>
              )}

              <div className="mt-6 flex flex-wrap gap-3">
                {store.websiteUrl && (
                  <a
                    href={store.websiteUrl}
                    target="_blank"
                    className="rounded-xl border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
                  >
                    Visitar site
                  </a>
                )}

                {store.affiliateUrl && (
                  <a
                    href={store.affiliateUrl}
                    target="_blank"
                    className="rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
                  >
                    Ir para a loja
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* RESUMO */}
        <section className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-gray-200">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Resumo da loja
            </h2>
            <p className="mt-1 text-gray-600">
              Métricas rápidas para destacar a performance da loja na plataforma.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl bg-gray-50 p-5">
              <p className="text-sm text-gray-500">Códigos de desconto</p>
              <p className="mt-2 text-3xl font-bold text-red-600">
                {totalCouponCodes}
              </p>
            </div>

            <div className="rounded-2xl bg-gray-50 p-5">
              <p className="text-sm text-gray-500">Ofertas</p>
              <p className="mt-2 text-3xl font-bold text-red-600">
                {totalOffers}
              </p>
            </div>

            <div className="rounded-2xl bg-gray-50 p-5">
              <p className="text-sm text-gray-500">Número de cupons</p>
              <p className="mt-2 text-3xl font-bold text-red-600">
                {totalCoupons}
              </p>
            </div>

            <div className="rounded-2xl bg-gray-50 p-5">
              <p className="text-sm text-gray-500">Melhor desconto</p>
              <p className="mt-2 text-3xl font-bold text-red-600">
                {bestDiscount > 0 ? `${bestDiscount}%` : '--'}
              </p>
            </div>
          </div>
        </section>

        {/* TÍTULO DA LISTA */}
        <section className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Aproveite os cupons da loja selecionada
            </h2>
            <p className="mt-1 text-gray-600">
              Veja abaixo os cupons e ofertas ativos disponíveis para esta loja.
            </p>
          </div>

          <a
            href="/coupons"
            className="text-sm font-semibold text-red-600 transition hover:text-red-700"
          >
            Ver todos os cupons
          </a>
        </section>

        {/* LISTA DE CUPONS */}
        <CouponsList coupons={store.coupons} />
      </div>
    </main>
  )
}
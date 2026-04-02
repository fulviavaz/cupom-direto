import { prisma } from '@/lib/prisma'
import CouponsList from '@/components/coupons-list'
import { notFound } from 'next/navigation'

type Props = {
  params: Promise<{
    slug: string
  }>
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params

  const tag = await prisma.tag.findFirst({
    where: {
      slug,
      type: 'categoria',
      isActive: true,
    },
    include: {
      couponTags: {
        include: {
          coupon: {
            include: {
              store: true,
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

  if (!tag) notFound()

  const coupons = tag.couponTags
    .map((item) => item.coupon)
    .filter((coupon) => coupon.isActive)

  const bestDiscount = coupons.reduce((max, c) => {
    const value = c.discountValue ?? 0
    return value > max ? value : max
  }, 0)

  return (
    <main className="min-h-screen bg-[#f5f5f5] py-10">
      <div className="mx-auto max-w-6xl space-y-8 px-6">

        {/* HEADER */}
        <section className="overflow-hidden rounded-3xl bg-white p-8 shadow-sm ring-1 ring-gray-200">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-red-600">
                Categoria
              </p>

              <h1 className="mt-2 text-3xl font-bold text-gray-900 md:text-4xl">
                {tag.name}
              </h1>

              <p className="mt-3 max-w-2xl text-gray-600">
                Explore os melhores cupons e ofertas disponíveis nesta categoria.
              </p>
            </div>

            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-red-50 text-3xl text-red-600">
              {tag.icon || '🏷️'}
            </div>

          </div>
        </section>

        {/* RESUMO */}
        <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

            <div className="rounded-2xl bg-gray-50 p-5">
              <p className="text-sm text-gray-500">Total de cupons</p>
              <p className="mt-2 text-3xl font-bold text-red-600">
                {coupons.length}
              </p>
            </div>

            <div className="rounded-2xl bg-gray-50 p-5">
              <p className="text-sm text-gray-500">Melhor desconto</p>
              <p className="mt-2 text-3xl font-bold text-red-600">
                {bestDiscount > 0 ? `${bestDiscount}%` : '--'}
              </p>
            </div>

            <div className="rounded-2xl bg-gray-50 p-5">
              <p className="text-sm text-gray-500">Categoria ativa</p>
              <p className="mt-2 text-2xl font-bold text-gray-900">
                {tag.name}
              </p>
            </div>

          </div>
        </section>

        {/* TÍTULO */}
        <section className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Cupons disponíveis
            </h2>
            <p className="mt-1 text-gray-600">
              Confira os cupons e ofertas desta categoria.
            </p>
          </div>
        </section>

        {/* LISTA */}
        <CouponsList coupons={coupons} />

      </div>
    </main>
  )
}
import { prisma } from '@/lib/prisma'
import CouponsList from '@/components/coupons-list'

type Props = {
  searchParams: Promise<{
    categoria?: string
  }>
}

export default async function CouponsPage({ searchParams }: Props) {
  const { categoria } = await searchParams

  const coupons = await prisma.coupon.findMany({
    where: {
      isActive: true,
      ...(categoria
        ? {
            couponTags: {
              some: {
                tag: {
                  slug: categoria,
                  type: 'categoria',
                  isActive: true,
                },
              },
            },
          }
        : {}),
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
  })

  const selectedCategory = categoria
    ? await prisma.tag.findFirst({
        where: {
          slug: categoria,
          type: 'categoria',
          isActive: true,
        },
      })
    : null

  return (
    <main className="min-h-screen bg-gray-50 py-10">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {selectedCategory
              ? `Cupons em ${selectedCategory.name}`
              : 'Cupons disponíveis'}
          </h1>

          <p className="mt-2 text-gray-600">
            {selectedCategory
              ? `Confira os cupons ativos da categoria ${selectedCategory.name}.`
              : 'Encontre ofertas, descontos e cupons ativos das lojas cadastradas.'}
          </p>
        </div>

        <CouponsList coupons={coupons} />
      </div>
    </main>
  )
}
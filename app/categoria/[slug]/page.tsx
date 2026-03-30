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

  const tag = await prisma.tag.findUnique({
    where: {
      slug,
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

  if (!tag) {
    notFound()
  }

  const activeCoupons = tag.couponTags
    .map((item) => item.coupon)
    .filter((coupon) => coupon.isActive)

  return (
    <main className="min-h-screen bg-gray-50 py-10">
      <div className="mx-auto max-w-6xl space-y-8 px-6">
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900">
            Cupons da categoria: {tag.name}
          </h1>

          <p className="mt-2 text-gray-600">
            Confira os cupons e ofertas disponíveis para esta categoria.
          </p>
        </div>

        <CouponsList coupons={activeCoupons} />
      </div>
    </main>
  )
}
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

  return (
    <main className="min-h-screen bg-gray-50 py-10">
      <div className="mx-auto max-w-6xl space-y-8 px-6">
        <div className="flex items-center gap-4 rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex h-20 w-24 items-center justify-center rounded-xl border border-gray-200 bg-white">
            {store.logoUrl ? (
              <img
                src={store.logoUrl}
                alt={store.name}
                className="h-12 w-16 object-contain"
              />
            ) : (
              <span className="text-xs text-gray-400">{store.name}</span>
            )}
          </div>

          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Cupons da {store.name}
            </h1>

            {store.description && (
              <p className="mt-2 text-gray-600">{store.description}</p>
            )}
          </div>
        </div>

        <CouponsList coupons={store.coupons} />
      </div>
    </main>
  )
}
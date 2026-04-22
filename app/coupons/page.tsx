import { prisma } from '@/lib/prisma'
import CouponsList from '@/components/coupons-list'

type Props = {
  searchParams: Promise<{
    search?: string
    categoria?: string
  }>
}

export default async function CouponsPage({ searchParams }: Props) {
  const { search, categoria } = await searchParams

  const searchTerm = search?.trim() || ''
  const categorySlug = categoria?.trim() || ''

  const coupons = await prisma.coupon.findMany({
    where: {
      isActive: true,
      ...(searchTerm || categorySlug
        ? {
            AND: [
              ...(categorySlug
                ? [
                    {
                      category: {
                        slug: categorySlug,
                      },
                    },
                  ]
                : []),
              ...(searchTerm
                ? [
                    {
                      OR: [
                        {
                          title: {
                            contains: searchTerm,
                          },
                        },
                        {
                          description: {
                            contains: searchTerm,
                          },
                        },
                        {
                          code: {
                            contains: searchTerm,
                          },
                        },
                        {
                          rules: {
                            contains: searchTerm,
                          },
                        },
                        {
                          store: {
                            name: {
                              contains: searchTerm,
                            },
                          },
                        },
                        {
                          category: {
                            name: {
                              contains: searchTerm,
                            },
                          },
                        },
                        {
                          couponTags: {
                            some: {
                              tag: {
                                name: {
                                  contains: searchTerm,
                                },
                              },
                            },
                          },
                        },
                      ],
                    },
                  ]
                : []),
            ],
          }
        : {}),
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
      {
        isFeatured: 'desc',
      },
      {
        createdAt: 'desc',
      },
    ],
  })

  return (
    <main className="bg-[#f3f3f3]">
      <div className="mx-auto max-w-[1440px] px-6 py-10 md:px-10">
        <div className="mb-8">
          <h1 className="text-5xl font-title uppercase text-[#111]">
            Cupons disponíveis
          </h1>

          <p className="mt-3 text-lg text-[#666]">
            Encontre ofertas, descontos e cupons ativos das lojas cadastradas.
          </p>

          {searchTerm && (
            <p className="mt-5 text-base text-[#666]">
              Resultado da busca por: <strong>"{searchTerm}"</strong>
            </p>
          )}
        </div>

        <CouponsList coupons={coupons} />
      </div>
    </main>
  )
}
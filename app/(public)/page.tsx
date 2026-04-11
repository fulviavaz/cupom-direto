import { prisma } from '@/lib/prisma'
import CouponsList from '@/components/coupons-list'
import HomeSearch from '@/components/home-search'

export default async function HomePage() {
  // 🔥 Cupons em destaque
  const featuredCoupons = await prisma.coupon.findMany({
    where: {
      isActive: true,
      isFeatured: true,
    },
    include: {
      store: true,
      category: true,
      couponTags: {
        include: { tag: true },
      },
    },
    take: 8,
  })

  // 🔥 Seleções especiais
  const specialTags = await prisma.tag.findMany({
    where: {
      type: 'especial',
      isActive: true,
    },
    include: {
      couponTags: {
        include: {
          coupon: {
            include: {
              store: true,
              category: true,
              couponTags: {
                include: { tag: true },
              },
            },
          },
        },
      },
    },
  })

  return (
    <main className="bg-gray-50">

      {/* HERO */}
      <section className="bg-red-600 py-12 text-white">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <h1 className="text-3xl font-bold">
            Encontre os melhores cupons e ofertas
          </h1>

          <p className="mt-2 text-white/80">
            Economize em lojas, restaurantes, tecnologia e muito mais
          </p>
          <HomeSearch />
        </div>
      </section>

      {/* CONTEÚDO */}
      <div className="mx-auto max-w-6xl px-6 py-10">

        {/* 🔥 Destaques */}
        {featuredCoupons.length > 0 && (
          <section className="mb-12">
            <h2 className="mb-4 text-xl font-bold text-gray-900">
              🔥 Cupons em destaque
            </h2>

            <CouponsList coupons={featuredCoupons} />
          </section>
        )}

        {/* 🚀 Seleções especiais */}
        {specialTags.map((tag) => {
          const coupons = tag.couponTags.map((ct) => ct.coupon)

          if (!coupons.length) return null

          return (
            <section key={tag.id} className="mb-12">
              <h2 className="mb-4 text-xl font-bold text-gray-900">
                {tag.name}
              </h2>

              <CouponsList coupons={coupons} />
            </section>
          )
        })}

      </div>
    </main>
  )
}
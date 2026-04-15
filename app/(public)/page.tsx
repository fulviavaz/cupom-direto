import { prisma } from '@/lib/prisma'
import CouponsList from '@/components/coupons-list'
import HomeSearch from '@/components/home-search'

export default async function HomePage() {
  const featuredStores = await prisma.store.findMany({
    where: {
      isActive: true,
      isFeatured: true,
    },
    orderBy: {
      updatedAt: 'desc',
    },
    take: 6,
  })

  const featuredCoupons = await prisma.coupon.findMany({
    where: {
      isActive: true,
      isFeatured: true,
    },
    include: {
      store: true,
      category: true,
      couponTags: {
        include: {
          tag: true,
        },
      },
    },
    take: 6,
  })

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
                include: {
                  tag: true,
                },
              },
            },
          },
        },
      },
    },
    take: 1,
  })

  const specialSection = specialTags[0] ?? null

  const specialCoupons =
    specialSection?.couponTags
      .map((ct) => ct.coupon)
      .filter((coupon) => coupon.isActive)
      .slice(0, 6) ?? []

  const extraCoupons = await prisma.coupon.findMany({
    where: {
      isActive: true,
      isFeatured: false,
    },
    include: {
      store: true,
      category: true,
      couponTags: {
        include: {
          tag: true,
        },
      },
    },
    take: 6,
  })

  const totalCoupons = await prisma.coupon.count({
    where: { isActive: true },
  })

  const totalStores = await prisma.store.count({
    where: { isActive: true },
  })

  const totalCategories = await prisma.tag.count({
    where: {
      type: 'categoria',
      isActive: true,
    },
  })

  const totalSpecials = await prisma.tag.count({
    where: {
      type: 'especial',
      isActive: true,
    },
  })

  return (
    <main className="bg-[#f3f3f3]">
      <div className="mx-auto max-w-[1180px] px-4 pt-10">
        {/* BLOCO PRINCIPAL */}
        <section className="mb-10">
          <div className="grid items-start gap-8 md:grid-cols-[260px_1fr]">
            <div className="flex items-start justify-center pt-[6px] md:justify-start">
              <img
                src="/logo-cupom-direto.png"
                alt="Cupom Direto"
                className="h-auto w-[250px] object-contain"
              />
            </div>

            <div>
              <h1 className="font-title mb-5 text-center text-[34px] uppercase leading-none tracking-tight text-[#111] md:text-left">
                Conectando você com os melhores cupons!
              </h1>

              <HomeSearch />
            </div>
          </div>
        </section>

        {/* LOJAS EM DESTAQUE */}
        <section className="mb-10">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-title text-[22px] uppercase leading-none text-[#ef233c]">
              Lojas em destaque
            </h2>

            <a
              href="/lojas"
              className="text-[12px] font-bold uppercase text-[#222] hover:text-[#ef233c]"
            >
              Ver todas
            </a>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
            {featuredStores.map((store) => (
              <a key={store.id} href={`/loja/${store.slug}`} className="group">
                <div>
                  <div className="flex h-[74px] items-center justify-center overflow-hidden rounded-[12px] bg-white px-3 shadow-sm ring-1 ring-black/5 transition group-hover:shadow-md">
                    {store.logoUrl ? (
                      <img
                        src={store.logoUrl}
                        alt={store.name}
                        className="max-h-[44px] w-auto max-w-full object-contain"
                      />
                    ) : (
                      <span className="text-sm font-semibold text-[#444]">
                        {store.name}
                      </span>
                    )}
                  </div>

                  <div className="px-1 pt-2">
                    <p className="truncate text-[12px] font-medium text-[#444]">
                      {store.name}
                    </p>
                    <p className="text-[11px] text-[#06b6b2]">0000 cupons</p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* CUPONS EM DESTAQUE */}
        <section className="mb-10">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-title text-[22px] uppercase leading-none text-[#ef233c]">
              Cupons em destaque
            </h2>

            <a
              href="/coupons"
              className="text-[12px] font-bold uppercase text-[#222] hover:text-[#ef233c]"
            >
              Buscar mais cupons
            </a>
          </div>

          <CouponsList coupons={featuredCoupons} compact />
        </section>

        {/* BANNER ESPECIAL */}
        <section className="mb-10">
          <div className="overflow-hidden rounded-[18px] shadow-sm ring-1 ring-black/5">
            <img
              src="/banner-special.jpg"
              alt={specialSection?.name || 'Seleção especial'}
              className="h-auto w-full object-cover"
            />
          </div>
        </section>

        {/* MAIS CUPONS */}
        <section className="mb-12">
          <CouponsList
            coupons={specialCoupons.length > 0 ? specialCoupons : extraCoupons}
            compact
          />
        </section>

        {/* BUSCA FINAL */}
        <section className="mb-8">
          <div className="grid items-start gap-8 md:grid-cols-[260px_1fr]">
            <div className="flex items-start justify-center pt-[6px] md:justify-start">
              <img
                src="/logo-cupom-direto.png"
                alt="Cupom Direto"
                className="h-auto w-[250px] object-contain"
              />
            </div>

            <div>
              <h2 className="font-title mb-5 text-center text-[34px] uppercase leading-none tracking-tight text-[#111] md:text-left">
                Conectando você com os melhores cupons!
              </h2>
              <HomeSearch />
            </div>
          </div>
        </section>

        {/* NÚMEROS */}
        <section className="mb-16">
          <div className="grid grid-cols-2 gap-3 rounded-[18px] bg-[#ececec] p-5 shadow-sm md:grid-cols-5">
            <div className="text-center">
              <p className="text-[28px] font-black text-[#ef233c]">{totalCoupons}</p>
              <p className="text-[11px] uppercase tracking-wide text-[#333]">Cupons</p>
            </div>

            <div className="text-center">
              <p className="text-[28px] font-black text-[#ef233c]">
                {featuredCoupons.length}
              </p>
              <p className="text-[11px] uppercase tracking-wide text-[#333]">Promoções</p>
            </div>

            <div className="text-center">
              <p className="text-[28px] font-black text-[#ef233c]">{totalStores}</p>
              <p className="text-[11px] uppercase tracking-wide text-[#333]">Lojas</p>
            </div>

            <div className="text-center">
              <p className="text-[28px] font-black text-[#ef233c]">{totalCategories}</p>
              <p className="text-[11px] uppercase tracking-wide text-[#333]">Categorias</p>
            </div>

            <div className="text-center">
              <p className="text-[28px] font-black text-[#ef233c]">{totalSpecials}</p>
              <p className="text-[11px] uppercase tracking-wide text-[#333]">
                Datas especiais
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
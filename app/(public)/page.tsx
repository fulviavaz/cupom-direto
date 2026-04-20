import { prisma } from '@/lib/prisma'
import CouponsList from '@/components/coupons-list'
import HomeSearch from '@/components/home-search'
import FeaturedStoresCarousel from '@/components/featured-stores-carousel'

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
})
const featuredCoupons = await prisma.coupon.findMany({
  where: {
    isActive: true,
    isFeatured: true,
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
      <div className="mx-auto max-w-[1440px] px-10 pt-10">
        {/* TOPO PRINCIPAL */}
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

        {/* LOJAS EM DESTAQUE */}
      <section className="mb-12 overflow-hidden">
  <div className="mb-5 flex items-center justify-between">
    <h2 className="font-title text-[28px] uppercase leading-none text-[#ef233c]">
      Lojas em destaque
    </h2>

    <a
      href="/lojas"
      className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-wide text-[#111] hover:text-[#ef233c]"
    >
      <span className="flex h-[18px] w-[18px] items-center justify-center rounded-full bg-[#ef233c] text-[12px] text-white">
        +
      </span>
      Ver todas
    </a>
  </div>

  <div className="overflow-x-auto pb-2">
  <FeaturedStoresCarousel stores={featuredStores} />
  </div>
</section>

        {/* CUPONS EM DESTAQUE */}
        <section className="mb-12">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-title text-[28px] uppercase leading-none text-[#ef233c]">
              Cupons em destaque
            </h2>

            <a
              href="/coupons"
              className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-wide text-[#111] hover:text-[#ef233c]"
            >
              <span className="flex h-[20px] w-[20px] items-center justify-center rounded-full bg-[#ef233c] text-[15px] font-medium text-white">
                +
              </span>
              Buscar mais cupons
            </a>
          </div>

          <CouponsList coupons={featuredCoupons} />
        </section>

        {/* BANNER ESPECIAL */}
        <section className="mb-12">
          <div className="overflow-hidden rounded-[22px] shadow-sm ring-1 ring-black/5">
            <img
              src="/banner-special.jpg"
              alt={specialSection?.name || 'Seleção especial'}
              className="h-auto w-full object-cover"
            />
          </div>
        </section>

        {/* MAIS CUPONS */}
        <section className="mb-14">
          <CouponsList
            coupons={specialCoupons.length > 0 ? specialCoupons : extraCoupons}
          />
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

        <section className="mb-20">
          <div className="grid grid-cols-2 gap-3 rounded-[20px] bg-[#ececec] p-6 md:grid-cols-5">
            <div className="text-center">
              <p className="text-[28px] font-bold text-[#ef233c]">{totalCoupons}</p>
              <p className="text-[10px] uppercase text-[#555]">Cupons</p>
            </div>

            <div className="text-center">
              <p className="text-[28px] font-bold text-[#ef233c]">
                {featuredCoupons.length}
              </p>
              <p className="text-[10px] uppercase text-[#555]">Promoções</p>
            </div>

            <div className="text-center">
              <p className="text-[28px] font-bold text-[#ef233c]">{totalStores}</p>
              <p className="text-[10px] uppercase text-[#555]">Lojas</p>
            </div>

            <div className="text-center">
              <p className="text-[28px] font-bold text-[#ef233c]">{totalCategories}</p>
              <p className="text-[10px] uppercase text-[#555]">Categorias</p>
            </div>

            <div className="text-center">
              <p className="text-[28px] font-bold text-[#ef233c]">{totalSpecials}</p>
              <p className="text-[10px] uppercase text-[#555]">Datas especiais</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
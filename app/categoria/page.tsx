import { prisma } from '@/lib/prisma'
import { getTagIcon } from '@/lib/tag-icons'
import HomeSearch from '@/components/home-search'
import Link from 'next/link'
import CategoryLetterNav from '@/components/category-letter-nav'
import SiteStatsFooter from '@/components/site-stats-footer'

export default async function CategoriaIndexPage() {
  const categories = await prisma.tag.findMany({
    where: {
      type: 'categoria',
      isActive: true,
    },
    orderBy: {
      name: 'asc',
    },
    include: {
      _count: {
        select: {
          couponsAsCategory: {
            where: {
              isActive: true,
            },
          },
        },
      },
    },
  })

  const featuredCategories = categories
    .filter((category) => category.isFeatured)
    .slice(0, 10)

  const fallbackFeaturedCategories =
    featuredCategories.length > 0 ? featuredCategories : categories.slice(0, 10)

  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

  const groupedCategories = letters
    .map((letter) => ({
      letter,
      items: categories.filter(
        (category) => category.name.charAt(0).toUpperCase() === letter
      ),
    }))
    .filter((group) => group.items.length > 0)

  const availableLetters = groupedCategories.map((group) => group.letter)

  const totalCoupons = await prisma.coupon.count({
    where: {
      isActive: true,
    },
  })

  const totalOffers = await prisma.coupon.count({
    where: {
      isActive: true,
      couponType: 'offer',
    },
  })

  const totalStores = await prisma.store.count({
    where: {
      isActive: true,
    },
  })

  const totalCategories = await prisma.tag.count({
    where: {
      type: 'categoria',
      isActive: true,
    },
  })

  const totalSpecialDates = await prisma.tag.count({
    where: {
      type: 'especial',
      isActive: true,
    },
  })

  return (
    <main className="bg-[#f3f3f3]">
      <div className="mx-auto max-w-[1440px] px-6 pt-10 md:px-10">
        {/* TOPO */}
        <section className="mb-12">
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

        {/* MAIS BUSCADAS */}
        <section className="mb-12">
          <h2 className="font-title mb-5 text-[28px] uppercase leading-none text-[#ef233c]">
            Categorias mais buscadas
          </h2>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {fallbackFeaturedCategories.map((category, index) => {
              const Icon = getTagIcon(category.icon)
              const isHighlighted = index === 1

              return (
                <Link
                  key={category.id}
                  href={`/categoria/${category.slug}`}
                  className={`flex items-center justify-between gap-3 rounded-[14px] px-4 py-4 transition hover:opacity-95 ${
                    isHighlighted
                      ? 'bg-[#ef233c] text-white'
                      : 'bg-[#ececec] text-[#ef233c]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`h-[22px] w-[22px] ${isHighlighted ? 'text-white' : 'text-[#ef233c]'}`} strokeWidth={1.8} />
                    <span
                      className={`font-title text-[18px] uppercase leading-none ${
                        isHighlighted ? 'text-white' : 'text-[#ef233c]'
                      }`}
                    >
                      {category.name}
                    </span>
                  </div>

                  <span
                    className={`text-[11px] font-bold ${
                      isHighlighted ? 'text-white/90' : 'text-[#666]'
                    }`}
                  >
                    {category._count.couponsAsCategory}
                  </span>
                </Link>
              )
            })}
          </div>
        </section>

        {/* TÍTULO LISTA */}
        <section className="mb-5">
          <h2 className="font-title text-[28px] uppercase leading-none text-[#ef233c]">
            Todas as categorias, em ordem alfabética
          </h2>
        </section>

        {/* LETRAS */}
        <section className="mb-8">
          <CategoryLetterNav letters={availableLetters} />
        </section>

        {/* GRUPOS ALFABÉTICOS */}
        <section className="mb-20 space-y-10">
          {groupedCategories.map((group) => (
            <div
              key={group.letter}
              id={`letter-${group.letter}`}
              className="scroll-mt-24 border-b border-black/10 pb-8"
            >
              <div className="grid gap-6 md:grid-cols-[48px_1fr]">
                <div>
                  <p className="font-title text-[34px] uppercase leading-none text-[#111]">
                    {group.letter}
                  </p>
                </div>

                <div className="grid gap-x-10 gap-y-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                  {group.items.map((category) => (
                    <Link
                      key={category.id}
                      href={`/categoria/${category.slug}`}
                      className="flex items-center justify-between gap-3 text-[13px] font-medium text-[#333] transition hover:text-[#ef233c] uppercase"
                    >
                      <span>{category.name}</span>
                      <span className="text-[11px] text-[#888]">
                        {category._count.couponsAsCategory}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ))}
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
<SiteStatsFooter />
      </div>
    </main>
  )
}

function MetricFooter({
  value,
  label,
}: {
  value: number
  label: string
}) {
  return (
    <div className="text-center">
      <p className="text-[28px] font-bold text-[#ef233c]">{value}</p>
      <p className="text-[10px] uppercase text-[#555]">{label}</p>
    </div>
  )
}
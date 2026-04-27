import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { getTagIcon } from '@/lib/tag-icons'
import CategoryLetterNav from '@/components/category-letter-nav'
import SiteHeroSearch from '@/components/site-hero-search'
import SiteStatsFooter from '@/components/site-stats-footer'
import { getPublicCouponWhere } from '@/lib/coupon-visibility'

export default async function EspeciaisPage() {
  const specials = await prisma.tag.findMany({
    where: {
      type: 'especial',
      isActive: true,
    },
    orderBy: {
      name: 'asc',
    },
    include: {
      couponTags: {
        include: {
          coupon: true,
        },
      },
    },
  })

  const specialsWithCount = specials.map((special) => {
    const now = new Date()

    const activeCoupons = special.couponTags
      .map((item) => item.coupon)
      .filter((coupon) => {
        const startsAtOk = !coupon.startsAt || coupon.startsAt <= now
        const expiresAtOk = !coupon.expiresAt || coupon.expiresAt >= now

        return coupon.isActive && startsAtOk && expiresAtOk
      })

    return {
      ...special,
      couponsCount: activeCoupons.length,
    }
  })

  const featuredSpecials = specialsWithCount
    .filter((special) => special.isFeatured)
    .slice(0, 10)

  const fallbackFeaturedSpecials =
    featuredSpecials.length > 0
      ? featuredSpecials
      : specialsWithCount.slice(0, 10)

  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

  const groupedSpecials = letters
    .map((letter) => ({
      letter,
      items: specialsWithCount.filter(
        (special) => special.name.charAt(0).toUpperCase() === letter
      ),
    }))
    .filter((group) => group.items.length > 0)

  const availableLetters = groupedSpecials.map((group) => group.letter)

  return (
    <main className="bg-[#f3f3f3]">
      <div className="mx-auto max-w-[1440px] px-6 pt-10 md:px-10">
        <SiteHeroSearch />

        <section className="mb-12">
          <h2 className="font-title mb-5 text-[28px] uppercase leading-none text-[#ef233c]">
            Categorias especiais mais buscadas
          </h2>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {fallbackFeaturedSpecials.map((special, index) => {
              const Icon = getTagIcon(special.icon)
              const isHighlighted = index === 1

              return (
                <Link
                  key={special.id}
                  href={`/especiais/${special.slug}`}
                  className={`flex items-center justify-between gap-3 rounded-[14px] px-4 py-4 transition hover:opacity-95 ${
                    isHighlighted
                      ? 'bg-[#ef233c] text-white'
                      : 'bg-[#ececec] text-[#ef233c]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-[22px] w-[22px]" strokeWidth={1.8} />

                    <span
                      className={`font-title text-[18px] uppercase leading-none ${
                        isHighlighted ? 'text-white' : 'text-[#ef233c]'
                      }`}
                    >
                      {special.name}
                    </span>
                  </div>

                  <span
                    className={`text-[11px] font-bold ${
                      isHighlighted ? 'text-white/90' : 'text-[#666]'
                    }`}
                  >
                    {special.couponsCount}
                  </span>
                </Link>
              )
            })}
          </div>
        </section>

        <section className="mb-5">
          <h2 className="font-title text-[28px] uppercase leading-none text-[#ef233c]">
            Todas as categorias especiais, em ordem alfabética
          </h2>
        </section>

        <section className="mb-8">
          <CategoryLetterNav letters={availableLetters} />
        </section>

        <section className="mb-20 space-y-10">
          {groupedSpecials.map((group) => (
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
                  {group.items.map((special) => (
                    <Link
                      key={special.id}
                      href={`/especiais/${special.slug}`}
                      className="flex items-center justify-between gap-3 text-[13px] font-medium text-[#333] transition hover:text-[#ef233c] uppercase"
                    >
                      <span>{special.name}</span>

                      <span className="text-[11px] text-[#888]">
                        {special.couponsCount}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </section>

        <SiteHeroSearch />
        <SiteStatsFooter />
      </div>
    </main>
  )
}
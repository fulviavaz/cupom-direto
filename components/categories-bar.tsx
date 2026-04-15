import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { getTagIcon } from '@/lib/tag-icons'

type Props = {
  currentCategory?: string
}

export default async function CategoriesBar({ currentCategory }: Props) {
  const categories = await prisma.tag.findMany({
    where: {
      type: 'categoria',
      isActive: true,
    },
    orderBy: {
      name: 'asc',
    },
    take: 10,
  })

  if (!categories.length) return null

  return (
    <div className="w-full bg-[#ef233c]">
      <div className="mx-auto max-w-[1180px] px-4">
        <div className="flex items-stretch justify-between gap-2 overflow-x-auto py-3">
          {categories.map((cat) => {
            const Icon = getTagIcon(cat.icon)
            const isActive = currentCategory === cat.slug

            return (
              <Link
                key={cat.id}
                href={`/coupons?categoria=${cat.slug}`}
                className={`flex min-w-[88px] flex-col items-center justify-center gap-2 rounded-[10px] px-2 py-2 text-center transition ${
                  isActive ? 'bg-white/15 text-white' : 'text-white hover:bg-white/10'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="text-[9px] font-semibold uppercase leading-[1.1] tracking-wide">
                  {cat.name}
                </span>
              </Link>
            )
          })}

          <Link
            href="/coupons"
            className="flex min-w-[88px] flex-col items-center justify-center gap-2 rounded-[10px] px-2 py-2 text-center text-white transition hover:bg-white/10"
          >
            <span className="text-[18px] font-bold leading-none">+</span>
            <span className="text-[9px] font-semibold uppercase leading-[1.1] tracking-wide">
              Ver todas
            </span>
          </Link>
        </div>
      </div>
    </div>
  )
}
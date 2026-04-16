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
    take: 11,
  })

  if (!categories.length) return null

  return (
    <div className="w-full bg-[#ef0f23]">
      <div className="mx-auto max-w-[1440px] px-6">
        <div className="flex items-stretch justify-between gap-2 overflow-x-auto py-5">
          {categories.map((cat) => {
            const Icon = getTagIcon(cat.icon)
            const isActive = currentCategory === cat.slug

            return (
              <Link
                key={cat.id}
                href={`/coupons?categoria=${cat.slug}`}
                className={`group flex min-w-[96px] flex-col items-center justify-center gap-[8px] rounded-[8px] px-2 py-1 text-center transition ${
                  isActive ? 'bg-white/10' : 'hover:bg-white/10'
                }`}
              >
                <Icon
                  className="h-[34px] w-[34px] text-white"
                  strokeWidth={1.3}
                />

                <span className="text-[12px] font-normal uppercase leading-[1.05] tracking-[0.02em] text-white">
                  {cat.name}
                </span>
              </Link>
            )
          })}

          <Link
            href="/coupons"
            className="group flex min-w-[96px] flex-col items-center justify-center gap-[8px] rounded-[8px] px-2 py-1 text-center transition hover:bg-white/10"
          >
            <span className="flex h-[35px] w-[35px] items-center justify-center rounded-full bg-white text-[35px] font-medium leading-none text-[#ef0f23]">
              +
            </span>

            <span className="text-[12px] font-normal uppercase leading-[1.05] tracking-[0.02em] text-white">
              Ver todas
            </span>
          </Link>
        </div>
      </div>
    </div>
  )
}
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
                href={`/categoria/${cat.slug}`}
                className={`flex min-w-[92px] flex-col items-center justify-center gap-[8px] rounded-[8px] px-2 py-1 text-center transition ${
                  isActive ? 'bg-white/10' : 'hover:bg-white/10'
                }`}
              >
                <Icon
                  className="h-[23px] w-[23px] text-white"
                  strokeWidth={1.8}
                />

                <span className="text-[10px] font-extrabold uppercase leading-[1.05] tracking-[0.02em] text-white">
                  {cat.name}
                </span>
              </Link>
            )
          })}

          <Link
            href="/categoria"
            className="flex min-w-[92px] flex-col items-center justify-center gap-[8px] rounded-[8px] px-2 py-1 text-center transition hover:bg-white/10"
          >
            <span className="flex h-[28px] w-[28px] items-center justify-center rounded-full bg-white text-[18px] font-bold leading-none text-[#ef0f23]">
              +
            </span>

            <span className="text-[10px] font-extrabold uppercase leading-[1.05] tracking-[0.02em] text-white">
              Ver todas
            </span>
          </Link>
        </div>
      </div>
    </div>
  )
}
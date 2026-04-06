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
  })

  if (!categories.length) return null

  return (
    <div className="w-full bg-red-600 py-3">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex gap-3 overflow-x-auto">

          {/* Todas */}
          <Link
            href="/coupons"
            className={`
              whitespace-nowrap rounded-xl px-4 py-2 text-sm font-medium transition
              ${!currentCategory
                ? 'bg-white text-red-600'
                : 'bg-white/10 text-white hover:bg-white hover:text-red-600'}
            `}
          >
            Todas
          </Link>

        {categories.map((cat) => {
  const isActive = currentCategory === cat.slug

  return (
    <Link
      key={cat.id}
      href={`/coupons?categoria=${cat.slug}`}
      className={`
        whitespace-nowrap rounded-xl px-4 py-2 text-sm font-medium transition
        ${isActive
          ? 'bg-white text-red-600'
          : 'bg-white/10 text-white hover:bg-white hover:text-red-600'}
      `}
    >
      <div className="flex items-center gap-2">
        {(() => {
          const Icon = getTagIcon(cat.icon)
          return <Icon className="h-4 w-4" />
        })()}

        <span>{cat.name}</span>
      </div>
    </Link>
  )
})}

        </div>
      </div>
    </div>
  )
}
import Link from 'next/link'
import { prisma } from '@/lib/prisma'

export default async function TopBanner() {
  const categories = await prisma.tag.findMany({
    where: {
      isActive: true,
      type: 'categoria',
    },
    orderBy: {
      name: 'asc',
    },
    take: 10,
  })

  return (
    <div className="w-full bg-linear-to-r from-red-600 to-red-500 text-white">
      
      {/* LINHA SUPERIOR (CAMPANHA) */}
      <div className="border-b border-white/10 text-center text-sm font-semibold tracking-wide py-2">
        🎉 BANNER SAZONAL — CARNAVAL DE OFERTAS 🎉
      </div>

      {/* CATEGORIAS */}
      <div className="overflow-x-auto">
        <div className="mx-auto flex max-w-6xl items-center gap-6 px-6 py-3">

          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/coupons?categoria=${cat.slug}`}
              className="
                flex items-center gap-2 whitespace-nowrap
                rounded-full bg-white/10 px-4 py-2 text-sm
                transition hover:bg-white/20
              "
            >
              <span className="text-base">{cat.icon || '🏷️'}</span>
              {cat.name}
            </Link>
          ))}

        </div>
      </div>
    </div>
  )
}
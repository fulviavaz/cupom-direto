'use client'

type Store = {
  id: number
  name: string
  slug: string
  logoUrl: string | null
}

export default function FeaturedStoresCarousel({
  stores,
}: {
  stores: Store[]
}) {
  const loopStores = [...stores, ...stores] // 🔥 duplica p loop infinito

  return (
    <div className="overflow-hidden">
      <div className="carousel-track flex gap-6">
        {loopStores.map((store, index) => (
          <a
            key={`${store.id}-${index}`}
            href={`/loja/${store.slug}`}
            className="w-[170px] shrink-0"
          >
            <div className="flex h-[72px] items-center justify-center overflow-hidden rounded-[16px]">
              {store.logoUrl ? (
                <img
                  src={store.logoUrl}
                  alt={store.name}
                  className="h-full w-full object-contain"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center rounded-[16px] bg-[#ececec] text-sm font-semibold text-[#444]">
                  {store.name}
                </div>
              )}
            </div>

            <div className="pt-2">
              <p className="truncate text-[11px] font-medium text-[#222]">
                {store.name}
              </p>
              <p className="text-[10px] text-[#08b8b3]">0000 cupons</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}
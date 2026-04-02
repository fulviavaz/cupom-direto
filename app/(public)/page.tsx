import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import CouponsList from '@/components/coupons-list'

export default async function HomePage() {
  const featuredCoupons = await prisma.coupon.findMany({
    where: {
      isActive: true,
      isFeatured: true,
    },
    include: {
      store: true,
      couponTags: {
        include: {
          tag: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 6,
  })

  const featuredStores = await prisma.store.findMany({
    where: {
      isActive: true,
      isFeatured: true,
    },
    orderBy: {
      name: 'asc',
    },
    take: 6,
  })

  const featuredCategories = await prisma.tag.findMany({
    where: {
      isActive: true,
      type: 'categoria',
      isFeatured: true,
    },
    orderBy: {
      name: 'asc',
    },
    take: 8,
  })

  const totalCoupons = await prisma.coupon.count({
    where: { isActive: true },
  })

  const totalStores = await prisma.store.count({
    where: { isActive: true },
  })

  const totalCategories = await prisma.tag.count({
    where: {
      isActive: true,
      type: 'categoria',
    },
  })

  return (
    <main className="min-h-screen bg-[#f5f5f5]">
      {/* HERO */}
      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <div className="grid items-center gap-10 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <span className="inline-flex rounded-full bg-red-50 px-3 py-1 text-sm font-medium text-red-600">
                Cupons, ofertas e lojas parceiras
              </span>

              <h1 className="mt-5 text-4xl font-bold leading-tight text-gray-900 md:text-5xl">
                Conectando você com os melhores cupons
              </h1>

              <p className="mt-4 max-w-2xl text-base text-gray-600 md:text-lg">
                Descubra descontos reais, ofertas verificadas e cupons ativos
                das principais lojas em um só lugar.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/coupons"
                  className="rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
                >
                  Ver todos os cupons
                </Link>

                <Link
                  href="/admin/coupons"
                  className="rounded-xl border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
                >
                  Acessar admin
                </Link>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-2">
              <div className="rounded-2xl bg-red-600 p-5 text-white shadow-sm">
                <p className="text-sm text-red-100">Cupons ativos</p>
                <p className="mt-2 text-3xl font-bold">{totalCoupons}</p>
              </div>

              <div className="rounded-2xl bg-white p-5 text-gray-900 shadow-sm">
                <p className="text-sm text-gray-500">Lojas</p>
                <p className="mt-2 text-3xl font-bold">{totalStores}</p>
              </div>

              <div className="rounded-2xl bg-white p-5 text-gray-900 shadow-sm sm:col-span-3 lg:col-span-2">
                <p className="text-sm text-gray-500">Categorias</p>
                <p className="mt-2 text-3xl font-bold">{totalCategories}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIAS */}
      {featuredCategories.length > 0 && (
        <section className="mx-auto max-w-6xl px-6 py-10">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Categorias em destaque
              </h2>
              <p className="mt-1 text-gray-600">
                Encontre cupons pelas categorias mais buscadas.
              </p>
            </div>

            <Link
              href="/coupons"
              className="text-sm font-semibold text-red-600 transition hover:text-red-700"
            >
              Explorar categorias
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {featuredCategories.map((category) => (
              <Link
                key={category.id}
                href={`/categoria/${category.slug}`}
                className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-xl text-red-600">
                    {category.icon || '🏷️'}
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {category.name}
                    </h3>
                    <p className="text-sm text-gray-500">Ver cupons</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* LOJAS */}
      {featuredStores.length > 0 && (
        <section className="mx-auto max-w-6xl px-6 py-4">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Lojas em destaque
              </h2>
              <p className="mt-1 text-gray-600">
                Acesse as páginas das lojas e veja os cupons disponíveis.
              </p>
            </div>

            <Link
              href="/coupons"
              className="text-sm font-semibold text-red-600 transition hover:text-red-700"
            >
              Ver cupons
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
            {featuredStores.map((store) => (
              <Link
                key={store.id}
                href={`/loja/${store.slug}`}
                className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex h-20 items-center justify-center rounded-xl border border-gray-100 bg-gray-50">
                  {store.logoUrl ? (
                    <img
                      src={store.logoUrl}
                      alt={store.name}
                      className="h-12 w-20 object-contain"
                    />
                  ) : (
                    <span className="px-2 text-center text-sm text-gray-400">
                      {store.name}
                    </span>
                  )}
                </div>

                <p className="mt-3 text-center text-sm font-medium text-gray-800">
                  {store.name}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* BANNER */}
      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="overflow-hidden rounded-3xl bg-linear-to-r from-[#0b3b8f] to-[#0d122b] shadow-sm">
          <div className="grid items-center gap-6 px-8 py-10 lg:grid-cols-2">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-red-300">
                Seleção especial
              </p>
              <h2 className="mt-3 text-4xl font-bold text-white md:text-5xl">
                Games
              </h2>
              <p className="mt-4 max-w-lg text-white/80">
                Destaque sua campanha promocional, sua categoria premium ou um
                bloco patrocinado aqui.
              </p>

              <Link
                href="/coupons"
                className="mt-6 inline-flex rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
              >
                Explorar ofertas
              </Link>
            </div>

            <div className="rounded-2xl bg-white/10 p-6 text-white backdrop-blur">
              <p className="text-sm text-white/70">Espaço de destaque</p>
              <p className="mt-2 text-2xl font-bold">
                Banner promocional da plataforma
              </p>
              <p className="mt-3 text-sm text-white/80">
                Você pode trocar esse bloco por banner dinâmico vindo do banco
                numa próxima etapa.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CUPONS EM DESTAQUE */}
      <section className="mx-auto max-w-6xl px-6 py-6">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Cupons em destaque
            </h2>
            <p className="mt-1 text-gray-600">
              Ofertas selecionadas para aparecer logo na entrada do site.
            </p>
          </div>

          <Link
            href="/coupons"
            className="text-sm font-semibold text-red-600 transition hover:text-red-700"
          >
            Ver todos os cupons
          </Link>
        </div>

        <CouponsList coupons={featuredCoupons} />
      </section>

      {/* CTA FINAL */}
      <section className="mx-auto max-w-6xl px-6 py-14">
        <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-gray-200">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Explore todas as ofertas da plataforma
              </h2>
              <p className="mt-2 max-w-2xl text-gray-600">
                Navegue por categorias, lojas e cupons em uma experiência de
                marketplace pronta para crescer.
              </p>
            </div>

            <Link
              href="/coupons"
              className="w-fit rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
            >
              Explorar cupons
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
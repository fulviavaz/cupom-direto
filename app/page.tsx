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
    take: 8,
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
    where: {
      isActive: true,
    },
  })

  const totalStores = await prisma.store.count({
    where: {
      isActive: true,
    },
  })

  return (
    <main className="min-h-screen bg-gray-50">
      {/* HERO */}
      <section className="bg-red-600 text-white">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <span className="inline-flex rounded-full bg-white/15 px-3 py-1 text-sm font-medium">
                Plataforma de cupons e ofertas
              </span>

              <h1 className="mt-6 text-4xl font-bold leading-tight md:text-5xl">
                Economize em compras com cupons, ofertas e descontos reais
              </h1>

              <p className="mt-4 max-w-xl text-base text-red-50 md:text-lg">
                Encontre promoções atualizadas, ofertas das melhores lojas e
                cupons ativos organizados por categoria.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/coupons"
                  className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                >
                  Ver todos os cupons
                </Link>

                <Link
                  href="/admin/coupons"
                  className="rounded-xl border border-white/30 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Ir para o admin
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl bg-white p-6 text-gray-900 shadow-sm">
                <p className="text-sm text-gray-500">Cupons ativos</p>
                <p className="mt-2 text-3xl font-bold">{totalCoupons}</p>
              </div>

              <div className="rounded-2xl bg-white p-6 text-gray-900 shadow-sm">
                <p className="text-sm text-gray-500">Lojas parceiras</p>
                <p className="mt-2 text-3xl font-bold">{totalStores}</p>
              </div>

              <div className="col-span-2 rounded-2xl bg-white/10 p-6 backdrop-blur">
                <p className="text-sm text-red-50">
                  Use a navegação por categorias no topo para explorar o catálogo
                  ou entre direto na listagem completa.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIAS EM DESTAQUE */}
      {featuredCategories.length > 0 && (
        <section className="mx-auto max-w-6xl px-6 py-12">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Categorias em destaque
              </h2>
              <p className="mt-1 text-gray-600">
                Navegue pelas categorias mais importantes da plataforma.
              </p>
            </div>
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

      {/* LOJAS EM DESTAQUE */}
      {featuredStores.length > 0 && (
        <section className="mx-auto max-w-6xl px-6 py-4">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Lojas em destaque
            </h2>
            <p className="mt-1 text-gray-600">
              Acesse as principais lojas e veja seus cupons disponíveis.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {featuredStores.map((store) => (
              <Link
                key={store.id}
                href={`/loja/${store.slug}`}
                className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
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

                <div className="mt-4">
                  <h3 className="font-semibold text-gray-900">{store.name}</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Ver página da loja
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* CUPONS EM DESTAQUE */}
      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Cupons em destaque
            </h2>
            <p className="mt-1 text-gray-600">
              Ofertas selecionadas para dar destaque logo na entrada do site.
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
      <section className="mx-auto max-w-6xl px-6 pb-14">
        <div className="rounded-3xl bg-gray-900 px-8 py-10 text-white">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-2xl font-bold">
                Quer explorar todas as ofertas?
              </h2>
              <p className="mt-2 max-w-2xl text-gray-300">
                Veja a listagem completa de cupons, filtre por categoria e acesse
                as páginas individuais das lojas parceiras.
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
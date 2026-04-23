import HomeSearch from '@/components/home-search'

type Props = {
  title?: string
}

export default function SiteHeroSearch({
  title = 'Conectando você com os melhores cupons!',
}: Props) {
  return (
    <section className="mb-14">
      <div className="grid items-end gap-8 md:grid-cols-[280px_1fr]">
        {/* LOGO */}
        <div className="flex items-end justify-center md:justify-start">
          <img
            src="/logo-cupom-direto.png"
            alt="Cupom Direto"
            className="h-auto w-[280px] object-contain"
          />
        </div>

        {/* TÍTULO + BUSCA */}
        <div>
          <h1 className="font-title mb-6 text-center text-[46px] uppercase leading-[0.95] tracking-tight text-[#111] md:text-left">
            {title}
          </h1>

          <HomeSearch />
        </div>
      </div>
    </section>
  )
}
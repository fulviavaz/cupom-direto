import Link from 'next/link'
import HomeSearch from '@/components/home-search'

export default function Header() {
  return (
    <header className="bg-white pt-8 pb-4">
      <div className="mx-auto max-w-[1180px] px-4">
        <div className="grid items-center gap-6 md:grid-cols-[280px_1fr]">
          <div className="flex items-center justify-center md:justify-start">
            <Link href="/">
              <img
                src="/logo-cupom-direto.png"
                alt="Cupom Direto"
                className="h-auto w-[230px] object-contain"
              />
            </Link>
          </div>

          <div>
            <h1 className="mb-4 text-center text-[24px] font-title uppercase tracking-wide text-[#111] md:text-left md:text-[28px]">
              Conectando você com os melhores cupons!
            </h1>
            <HomeSearch />
          </div>
        </div>
      </div>
    </header>
  )
}
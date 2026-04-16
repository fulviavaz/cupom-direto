export default function SiteFooter() {
  return (
    <footer className="bg-[#d9d9d9]">
      <div className="mx-auto max-w-[1320px] px-6 py-14">
        <div className="grid gap-12 md:grid-cols-2 xl:grid-cols-[1fr_1fr_1fr_auto]">
          <div>
            <h3 className="font-title text-[24px] uppercase leading-none text-[#ef233c]">
              Sobre Cupom Direto
            </h3>
            <ul className="mt-4 space-y-2 text-[14px] text-[#222]">
              <li>Institucional</li>
              <li>Termos de uso e privacidade</li>
            </ul>
          </div>

          <div>
            <h3 className="font-title text-[24px] uppercase leading-none text-[#ef233c]">
              Datas Especiais
            </h3>
            <ul className="mt-4 space-y-1 text-[14px] text-[#222]">
              <li>Volta às aulas</li>
              <li>Carnaval</li>
              <li>Páscoa</li>
              <li>Dia das Mães</li>
              <li>Dia dos Pais</li>
              <li>Black Friday</li>
              <li>Cyber Monday</li>
              <li>Natal</li>
            </ul>
          </div>

          <div>
            <h3 className="font-title text-[24px] uppercase leading-none text-[#ef233c]">
              Navegação
            </h3>
            <ul className="mt-4 space-y-2 text-[14px] text-[#222]">
              <li>Home</li>
              <li>Lojas</li>
              <li>Categorias</li>
              <li>Blog / Conteúdo</li>
            </ul>
          </div>

          <div className="flex items-start justify-start xl:justify-end">
            <img
              src="/logo-cupom-direto.png"
              alt="Cupom Direto"
              className="w-[180px]"
            />
          </div>
        </div>

        <div className="mt-12 border-t border-black/10 pt-6 text-center text-[11px] text-[#444]">
          2026 - Cupom Direto - CNPJ 00000000000000 - Endereço: Nome da Rua, 000 - Cidade, Estado
        </div>
      </div>
    </footer>
  )
}
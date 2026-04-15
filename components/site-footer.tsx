export default function SiteFooter() {
  return (
    <footer className="bg-[#dcdcdc]">
      <div className="mx-auto max-w-[1180px] px-4 py-12">
        <div className="grid gap-10 md:grid-cols-2 xl:grid-cols-[1fr_1fr_1fr_auto]">
          {/* COLUNA 1 */}
          <div>
            <h3 className="text-[16px] font-title uppercase tracking-wide text-[#ef233c]">
              Sobre Cupom Direto
            </h3>

            <ul className="mt-3 space-y-1 text-[13px] text-[#222]">
              <li>Institucional</li>
              <li>Termos de uso e privacidade</li>
            </ul>
          </div>

          {/* COLUNA 2 */}
          <div>
            <h3 className="text-[16px] font-title uppercase tracking-wide text-[#ef233c]">
              Datas especiais
            </h3>

            <ul className="mt-3 space-y-1 text-[13px] text-[#222]">
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

          {/* COLUNA 3 */}
          <div>
            <h3 className="text-[16px] font-title uppercase tracking-wide text-[#ef233c]">
              Navegação
            </h3>

            <ul className="mt-3 space-y-1 text-[13px] text-[#222]">
              <li>Home</li>
              <li>Lojas</li>
              <li>Categorias</li>
              <li>Blog / Conteúdo</li>
            </ul>
          </div>

          {/* LOGO */}
          <div className="flex items-start justify-start xl:justify-end">
            <img
              src="/logo-cupom-direto.png"
              alt="Cupom Direto"
              className="w-[160px]"
            />
          </div>
        </div>

        {/* RODAPÉ FINAL */}
        <div className="mt-10 border-t border-black/10 pt-5 text-center text-[11px] text-[#444]">
          2026 - Cupom Direto - CNPJ 00000000000000 - Endereço: Nome da Rua, 000 - Cidade, Estado
        </div>
      </div>
    </footer>
  )
}
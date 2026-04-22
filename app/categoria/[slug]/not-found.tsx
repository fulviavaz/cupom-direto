export default function CategoryNotFound() {
  return (
    <main className="bg-[#f3f3f3]">
      <div className="mx-auto max-w-[1440px] px-10 py-20 text-center">
        <h1 className="font-title text-[46px] uppercase text-[#111]">
          Categoria não encontrada
        </h1>
        <p className="mt-4 text-[#666]">
          A categoria que você tentou acessar não existe ou está inativa.
        </p>
      </div>
    </main>
  )
}
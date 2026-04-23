import { prisma } from '@/lib/prisma'

export default async function AdminImportsPage() {
  const imports = await prisma.couponImportLog.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      uploadedBy: true,
    },
  })

  return (
    <main className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Importações</h1>
        <p className="mt-2 text-gray-600">
          Histórico das planilhas importadas no sistema.
        </p>
      </div>

      <section className="rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-black/5">
        {imports.length === 0 ? (
          <div className="rounded-2xl bg-[#f7f7f8] px-4 py-10 text-center text-sm text-[#777]">
            Nenhuma importação encontrada.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-black/10 text-left text-[#777]">
                  <th className="px-4 py-3 font-semibold">Arquivo</th>
                  <th className="px-4 py-3 font-semibold">Usuário</th>
                  <th className="px-4 py-3 font-semibold">Linhas</th>
                  <th className="px-4 py-3 font-semibold">Importados</th>
                  <th className="px-4 py-3 font-semibold">Erros</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Data</th>
                </tr>
              </thead>
              <tbody>
                {imports.map((item) => (
                  <tr key={item.id} className="border-b border-black/5">
                    <td className="px-4 py-4 font-medium text-[#111]">
                      {item.fileName}
                    </td>
                    <td className="px-4 py-4 text-[#555]">
                      {item.uploadedBy?.email || 'Não identificado'}
                    </td>
                    <td className="px-4 py-4 text-[#555]">{item.totalRows}</td>
                    <td className="px-4 py-4 text-[#555]">{item.successCount}</td>
                    <td className="px-4 py-4 text-[#555]">{item.errorCount}</td>
                    <td className="px-4 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          item.status === 'success'
                            ? 'bg-green-100 text-green-700'
                            : item.status === 'partial'
                            ? 'bg-yellow-100 text-yellow-700'
                            : item.status === 'failed'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-[#555]">
                      {new Date(item.createdAt).toLocaleString('pt-BR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {imports.some((item) => item.errorSummary) && (
        <section className="rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-black/5">
          <h2 className="mb-4 text-xl font-bold text-gray-900">
            Resumos de erro
          </h2>

          <div className="space-y-4">
            {imports
              .filter((item) => item.errorSummary)
              .slice(0, 5)
              .map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl bg-[#f7f7f8] p-4"
                >
                  <p className="mb-2 text-sm font-semibold text-[#111]">
                    {item.fileName}
                  </p>
                  <pre className="whitespace-pre-wrap text-xs text-[#666]">
                    {item.errorSummary}
                  </pre>
                </div>
              ))}
          </div>
        </section>
      )}
    </main>
  )
}
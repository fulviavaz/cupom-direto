import { prisma } from '@/lib/prisma'

export default async function Home() {
  const stores = await prisma.store.findMany()

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">Lojas</h1>
      <pre>{JSON.stringify(stores, null, 2)}</pre>
    </main>
  )
}
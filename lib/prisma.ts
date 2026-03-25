import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaMariaDb } from '@prisma/adapter-mariadb'

const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined
}

const adapter = new PrismaMariaDb({
  host: 'srv722.hstgr.io',
  port: 3306,
  user: 'u141413432_fulviavazdev',
  password: process.env.DB_PASSWORD!,
  database: 'u141413432_cupom_direto',
})

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({ adapter })

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
import { prisma } from '../lib/prisma'
import bcrypt from 'bcryptjs'

async function main() {
    const existingUser = await prisma.user.findUnique({
        where: {
            email: 'admin@admin.com',
        },
    })

    if (existingUser) {
        console.log('Usuário admin já existe.')
        return
    }

    const password = await bcrypt.hash('123456', 10)

    await prisma.user.create({
        data: {
            name: 'Admin',
            email: 'admin@admin.com',
            password,
            role: 'admin',
        },
    })

    console.log('Admin criado com sucesso!')
}

main()
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
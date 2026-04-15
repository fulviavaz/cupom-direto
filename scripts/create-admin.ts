import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

async function main() {
    const password = await bcrypt.hash('123456', 10)

    await prisma.user.create({
        data: {
            name: 'Admin',
            email: 'admin@admin.com',
            password,
        },
    })

    console.log('Admin criado!')
}

main()
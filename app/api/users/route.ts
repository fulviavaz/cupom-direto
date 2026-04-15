import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function GET() {
    try {
        const users = await prisma.user.findMany({
            orderBy: {
                createdAt: 'desc',
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
                updatedAt: true,
            },
        })

        return NextResponse.json(users)
    } catch (error) {
        console.error('Erro ao buscar usuários:', error)

        return NextResponse.json(
            {
                error: 'Erro ao buscar usuários',
                details: error instanceof Error ? error.message : String(error),
            },
            { status: 500 }
        )
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json()

        const name = body.name?.trim()
        const email = body.email?.trim().toLowerCase()
        const password = body.password?.trim()
        const role = body.role?.trim() || 'admin'

        if (!name || !email || !password) {
            return NextResponse.json(
                { error: 'Nome, email e senha são obrigatórios' },
                { status: 400 }
            )
        }

        const existingUser = await prisma.user.findUnique({
            where: { email },
        })

        if (existingUser) {
            return NextResponse.json(
                { error: 'Já existe um usuário com esse email' },
                { status: 409 }
            )
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role,
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
                updatedAt: true,
            },
        })

        return NextResponse.json(user, { status: 201 })
    } catch (error) {
        console.error('Erro ao criar usuário:', error)

        return NextResponse.json(
            {
                error: 'Erro ao criar usuário',
                details: error instanceof Error ? error.message : String(error),
            },
            { status: 500 }
        )
    }
}
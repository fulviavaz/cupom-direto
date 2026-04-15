import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

type Context = {
    params: Promise<{
        id: string
    }>
}

export async function PUT(req: Request, context: Context) {
    try {
        const { id } = await context.params
        const userId = Number(id)

        if (isNaN(userId)) {
            return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
        }

        const body = await req.json()

        const name = body.name?.trim()
        const email = body.email?.trim().toLowerCase()
        const password = body.password?.trim()
        const role = body.role?.trim() || 'admin'

        if (!name || !email) {
            return NextResponse.json(
                { error: 'Nome e email são obrigatórios' },
                { status: 400 }
            )
        }

        const existingUser = await prisma.user.findUnique({
            where: { id: userId },
        })

        if (!existingUser) {
            return NextResponse.json(
                { error: 'Usuário não encontrado' },
                { status: 404 }
            )
        }

        const userWithSameEmail = await prisma.user.findFirst({
            where: {
                email,
                NOT: {
                    id: userId,
                },
            },
        })

        if (userWithSameEmail) {
            return NextResponse.json(
                { error: 'Já existe outro usuário com esse email' },
                { status: 409 }
            )
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                name,
                email,
                role,
                ...(password
                    ? {
                        password: await bcrypt.hash(password, 10),
                    }
                    : {}),
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

        return NextResponse.json(updatedUser)
    } catch (error) {
        console.error('Erro ao atualizar usuário:', error)

        return NextResponse.json(
            {
                error: 'Erro ao atualizar usuário',
                details: error instanceof Error ? error.message : String(error),
            },
            { status: 500 }
        )
    }
}

export async function DELETE(_: Request, context: Context) {
    try {
        const { id } = await context.params
        const userId = Number(id)

        if (isNaN(userId)) {
            return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
        }

        const existingUser = await prisma.user.findUnique({
            where: { id: userId },
        })

        if (!existingUser) {
            return NextResponse.json(
                { error: 'Usuário não encontrado' },
                { status: 404 }
            )
        }

        await prisma.user.delete({
            where: { id: userId },
        })

        return NextResponse.json({
            message: 'Usuário excluído com sucesso',
        })
    } catch (error) {
        console.error('Erro ao excluir usuário:', error)

        return NextResponse.json(
            {
                error: 'Erro ao excluir usuário',
                details: error instanceof Error ? error.message : String(error),
            },
            { status: 500 }
        )
    }
}
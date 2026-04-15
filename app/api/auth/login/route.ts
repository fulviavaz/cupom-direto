import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(req: Request) {
    try {
        const body = await req.json()

        const email = body.email?.trim()
        const password = body.password

        if (!email || !password) {
            return NextResponse.json(
                { error: 'Email e senha obrigatórios' },
                { status: 400 }
            )
        }

        const user = await prisma.user.findUnique({
            where: { email },
        })

        if (!user) {
            return NextResponse.json(
                { error: 'Usuário não encontrado' },
                { status: 404 }
            )
        }

        const validPassword = await bcrypt.compare(password, user.password)

        if (!validPassword) {
            return NextResponse.json(
                { error: 'Senha inválida' },
                { status: 401 }
            )
        }

        const response = NextResponse.json({ ok: true })

        response.cookies.set(
            'session',
            JSON.stringify({
                userId: user.id,
                email: user.email,
                role: user.role,
            }),
            {
                httpOnly: true,
                path: '/',
            }
        )

        return response
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: 'Erro no login' }, { status: 500 })
    }
}
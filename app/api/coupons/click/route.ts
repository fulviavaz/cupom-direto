import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const couponId = Number(body.couponId)

        if (!couponId || isNaN(couponId)) {
            return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
        }

        await prisma.clickEvent.create({
            data: {
                couponId,
            },
        })

        await prisma.coupon.update({
            where: { id: couponId },
            data: {
                usesCount: {
                    increment: 1,
                },
            },
        })

        return NextResponse.json({ ok: true })
    } catch (error) {
        console.error('Erro ao registrar clique:', error)
        return NextResponse.json(
            {
                error: 'Erro ao registrar clique',
                details: error instanceof Error ? error.message : String(error),
            },
            { status: 500 }
        )
    }
}
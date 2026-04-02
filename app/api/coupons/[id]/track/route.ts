import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(
    _: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params
        const couponId = Number(id)

        if (isNaN(couponId)) {
            return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
        }

        const existingCoupon = await prisma.coupon.findUnique({
            where: { id: couponId },
        })

        if (!existingCoupon) {
            return NextResponse.json(
                { error: 'Cupom não encontrado' },
                { status: 404 }
            )
        }

        const updatedCoupon = await prisma.coupon.update({
            where: { id: couponId },
            data: {
                usesCount: {
                    increment: 1,
                },
            },
        })

        return NextResponse.json({
            message: 'Clique registrado com sucesso',
            usesCount: updatedCoupon.usesCount,
        })
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
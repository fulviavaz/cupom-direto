import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)
    const query = searchParams.get('q')?.trim()

    if (!query) {
        return NextResponse.json({ coupons: [], stores: [] })
    }

    const coupons = await prisma.coupon.findMany({
        where: {
            isActive: true,
            OR: [
                { title: { contains: query } },
                { description: { contains: query } },
            ],
        },
        include: {
            store: true,
        },
        take: 5,
    })

    const stores = await prisma.store.findMany({
        where: {
            isActive: true,
            name: { contains: query },
        },
        take: 5,
    })

    return NextResponse.json({
        coupons,
        stores,
    })
}
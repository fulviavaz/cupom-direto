import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const coupons = await prisma.coupon.findMany({
      include: {
        store: true,
        category: true,
        couponTags: {
          include: {
            tag: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(coupons)
  } catch (error) {
    console.error('Erro ao buscar cupons:', error)

    return NextResponse.json(
      {
        error: 'Erro ao buscar cupons',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const title = body.title?.trim()
    const description = body.description?.trim() || null
    const code = body.code?.trim() || null
    const rules = body.rules?.trim() || null
    const discountText = body.discountText?.trim() || null

    const discountValue =
      body.discountValue !== '' &&
        body.discountValue !== null &&
        body.discountValue !== undefined
        ? Number(body.discountValue)
        : null

    const couponType = body.couponType
    const redirectUrl = body.redirectUrl?.trim() || null
    const imageUrl = body.imageUrl?.trim() || null

    const storeId = Number(body.storeId)

    const categoryId =
      body.categoryId !== '' &&
        body.categoryId !== null &&
        body.categoryId !== undefined
        ? Number(body.categoryId)
        : null

    const tagIds: number[] = Array.isArray(body.tagIds)
      ? body.tagIds
        .map((id: string | number) => Number(id))
        .filter((id: number) => !isNaN(id))
      : []

    const isFeatured = body.isFeatured ?? false
    const isVerified = body.isVerified ?? false
    const isActive = body.isActive ?? true
    const expiresAt = body.expiresAt ? new Date(body.expiresAt) : null

    if (!title) {
      return NextResponse.json(
        { error: 'Título é obrigatório' },
        { status: 400 }
      )
    }

    if (!couponType) {
      return NextResponse.json(
        { error: 'Tipo do cupom é obrigatório' },
        { status: 400 }
      )
    }

    if (isNaN(storeId)) {
      return NextResponse.json(
        { error: 'Loja é obrigatória' },
        { status: 400 }
      )
    }

    if (categoryId === null || isNaN(categoryId)) {
      return NextResponse.json(
        { error: 'Categoria é obrigatória' },
        { status: 400 }
      )
    }

    const store = await prisma.store.findUnique({
      where: { id: storeId },
    })

    if (!store) {
      return NextResponse.json(
        { error: 'Loja não encontrada' },
        { status: 404 }
      )
    }

    const category = await prisma.tag.findUnique({
      where: { id: categoryId },
    })

    if (!category) {
      return NextResponse.json(
        { error: 'Categoria não encontrada' },
        { status: 404 }
      )
    }

    if (category.type !== 'categoria') {
      return NextResponse.json(
        { error: 'A categoria selecionada é inválida' },
        { status: 400 }
      )
    }

    const coupon = await prisma.coupon.create({
      data: {
        title,
        description,
        code,
        rules,
        discountText,
        discountValue,
        couponType,
        redirectUrl,
        imageUrl,
        storeId,
        categoryId,
        isFeatured,
        isVerified,
        isActive,
        expiresAt,
        couponTags: {
          create: tagIds.map((tagId: number) => ({
            tagId,
          })),
        },
      },
      include: {
        store: true,
        category: true,
        couponTags: {
          include: {
            tag: true,
          },
        },
      },
    })

    return NextResponse.json(coupon, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar cupom:', error)

    return NextResponse.json(
      {
        error: 'Erro ao criar cupom',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    )
  }
}
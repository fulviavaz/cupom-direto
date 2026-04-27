import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

type Context = {
  params: Promise<{
    id: string
  }>
}

export async function PUT(req: Request, context: Context) {
  try {
    const { id } = await context.params
    const couponId = Number(id)

    if (isNaN(couponId)) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
    }

    const body = await req.json()

    const title = body.title?.trim()
    const description = body.description?.trim() || null
    const code = body.code?.trim() || null
    const rules = body.rules?.trim() || null
    const discountText = body.discountText?.trim() || null

    const startsAt = body.startsAt
      ? new Date(body.startsAt)
      : null

    const expiresAt = body.expiresAt
      ? new Date(body.expiresAt)
      : null

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


    // validações
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

    const existingCoupon = await prisma.coupon.findUnique({
      where: { id: couponId },
    })

    if (!existingCoupon) {
      return NextResponse.json(
        { error: 'Cupom não encontrado' },
        { status: 404 }
      )
    }

    // valida loja
    const store = await prisma.store.findUnique({
      where: { id: storeId },
    })

    if (!store) {
      return NextResponse.json(
        { error: 'Loja não encontrada' },
        { status: 404 }
      )
    }

    // valida categoria
    const category = await prisma.tag.findUnique({
      where: { id: categoryId },
    })

    if (!category || category.type !== 'categoria') {
      return NextResponse.json(
        { error: 'Categoria inválida' },
        { status: 400 }
      )
    }

    // update + reset de tags
    const updatedCoupon = await prisma.coupon.update({
      where: { id: couponId },
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
        startsAt,
        expiresAt,

        // 👇 remove antigas e recria
        couponTags: {
          deleteMany: {},
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

    return NextResponse.json(updatedCoupon)
  } catch (error) {
    console.error('Erro ao atualizar cupom:', error)

    return NextResponse.json(
      {
        error: 'Erro ao atualizar cupom',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    )
  }
}

export async function DELETE(_: Request, context: Context) {
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

    await prisma.coupon.delete({
      where: { id: couponId },
    })

    return NextResponse.json({
      message: 'Cupom excluído com sucesso',
    })
  } catch (error) {
    console.error('Erro ao excluir cupom:', error)

    return NextResponse.json(
      {
        error: 'Erro ao excluir cupom',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    )
  }
}
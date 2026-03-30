import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
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
    const discountValue =
      body.discountValue !== '' && body.discountValue !== null && body.discountValue !== undefined
        ? Number(body.discountValue)
        : null
    const couponType = body.couponType
    const redirectUrl = body.redirectUrl?.trim() || null
    const imageUrl = body.imageUrl?.trim() || null
    const storeId = Number(body.storeId)
    const tagIds: number[] = Array.isArray(body.tagIds) ? body.tagIds : []
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
        isFeatured,
        isVerified,
        isActive,
        expiresAt,
        couponTags: {
          deleteMany: {},
          create: tagIds.map((tagId) => ({
            tag: {
              connect: { id: tagId },
            },
          })),
        },
      },
      include: {
        store: true,
        couponTags: {
          include: {
            tag: true,
          },
        },
      },
    })

    return NextResponse.json(updatedCoupon)
  } catch (error) {
    console.error('Erro ao editar cupom:', error)

    return NextResponse.json(
      {
        error: 'Erro ao editar cupom',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    )
  }
}

export async function DELETE(
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
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { slugify } from '@/lib/slugify'

type Context = {
  params: Promise<{
    id: string
  }>
}

export async function PUT(req: Request, context: Context) {
  try {
    const { id } = await context.params
    const storeId = Number(id)

    if (isNaN(storeId)) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
    }

    const body = await req.json()

    const name = body.name?.trim()
    const logoUrl = body.logoUrl?.trim() || null
    const affiliateUrl = body.affiliateUrl?.trim() || null
    const description = body.description?.trim() || null
    const websiteUrl = body.websiteUrl?.trim() || null
    const isFeatured = Boolean(body.isFeatured)
    const isActive = body.isActive ?? true

    if (!name) {
      return NextResponse.json(
        { error: 'Nome da loja é obrigatório' },
        { status: 400 }
      )
    }

    const existingStore = await prisma.store.findUnique({
      where: { id: storeId },
    })

    if (!existingStore) {
      return NextResponse.json(
        { error: 'Loja não encontrada' },
        { status: 404 }
      )
    }

    const slug = slugify(name)

    const storeWithSameSlug = await prisma.store.findFirst({
      where: {
        slug,
        NOT: {
          id: storeId,
        },
      },
    })

    if (storeWithSameSlug) {
      return NextResponse.json(
        { error: 'Já existe outra loja com esse nome/slug' },
        { status: 400 }
      )
    }

    const updatedStore = await prisma.store.update({
      where: { id: storeId },
      data: {
        name,
        slug,
        logoUrl,
        affiliateUrl,
        description,
        websiteUrl,
        isFeatured,
        isActive,
      },
    })

    return NextResponse.json(updatedStore)
  } catch (error) {
    console.error('Erro ao atualizar loja:', error)

    return NextResponse.json(
      {
        error: 'Erro ao atualizar loja',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    )
  }
}

export async function DELETE(_: Request, context: Context) {
  try {
    const { id } = await context.params
    const storeId = Number(id)

    if (isNaN(storeId)) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
    }

    const existingStore = await prisma.store.findUnique({
      where: { id: storeId },
    })

    if (!existingStore) {
      return NextResponse.json(
        { error: 'Loja não encontrada' },
        { status: 404 }
      )
    }

    await prisma.store.delete({
      where: { id: storeId },
    })

    return NextResponse.json({ message: 'Loja excluída com sucesso' })
  } catch (error) {
    console.error('Erro ao excluir loja:', error)

    return NextResponse.json(
      {
        error: 'Erro ao excluir loja',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    )
  }
}
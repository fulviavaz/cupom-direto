import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { slugify } from '@/lib/slugify'

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    const tagId = Number(id)

    if (isNaN(tagId)) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
    }

    const body = await req.json()

    const name = body.name?.trim()
    const icon = body.icon?.trim() || null
    const type = body.type
    const isFeatured = body.isFeatured ?? false
    const isActive = body.isActive ?? true

    if (!name) {
      return NextResponse.json(
        { error: 'Nome da tag é obrigatório' },
        { status: 400 }
      )
    }

    if (!type) {
      return NextResponse.json(
        { error: 'Tipo da tag é obrigatório' },
        { status: 400 }
      )
    }

    const existingTag = await prisma.tag.findUnique({
      where: { id: tagId },
    })

    if (!existingTag) {
      return NextResponse.json(
        { error: 'Tag não encontrada' },
        { status: 404 }
      )
    }

    const slug = slugify(name)

    const duplicatedTag = await prisma.tag.findFirst({
      where: {
        slug,
        NOT: {
          id: tagId,
        },
      },
    })

    if (duplicatedTag) {
      return NextResponse.json(
        { error: 'Já existe outra tag com esse nome' },
        { status: 409 }
      )
    }

    const updatedTag = await prisma.tag.update({
      where: { id: tagId },
      data: {
        name,
        slug,
        icon,
        type,
        isFeatured,
        isActive,
      },
    })

    return NextResponse.json(updatedTag)
  } catch (error) {
    console.error('Erro ao editar tag:', error)

    return NextResponse.json(
      {
        error: 'Erro ao editar tag',
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
    const tagId = Number(id)

    if (isNaN(tagId)) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
    }

    const existingTag = await prisma.tag.findUnique({
      where: { id: tagId },
    })

    if (!existingTag) {
      return NextResponse.json(
        { error: 'Tag não encontrada' },
        { status: 404 }
      )
    }

    await prisma.tag.delete({
      where: { id: tagId },
    })

    return NextResponse.json({
      message: 'Tag excluída com sucesso',
    })
  } catch (error) {
    console.error('Erro ao excluir tag:', error)

    return NextResponse.json(
      {
        error: 'Erro ao excluir tag',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    )
  }
}
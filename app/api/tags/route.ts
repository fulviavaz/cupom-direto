import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { slugify } from '@/lib/slugify'

export async function GET() {
  try {
    const tags = await prisma.tag.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(tags)
  } catch (error) {
    console.error('Erro ao buscar tags:', error)

    return NextResponse.json(
      {
        error: 'Erro ao buscar tags',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
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

    const slug = slugify(name)

    const existingTag = await prisma.tag.findUnique({
      where: { slug },
    })

    if (existingTag) {
      return NextResponse.json(
        { error: 'Já existe uma tag com esse nome' },
        { status: 409 }
      )
    }

    const tag = await prisma.tag.create({
      data: {
        name,
        slug,
        icon,
        type,
        isFeatured,
        isActive,
      },
    })

    return NextResponse.json(tag, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar tag:', error)

    return NextResponse.json(
      {
        error: 'Erro ao criar tag',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    )
  }
}
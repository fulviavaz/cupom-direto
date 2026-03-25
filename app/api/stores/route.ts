import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { slugify } from '@/lib/slugify'

export async function GET() {
  try {
    const stores = await prisma.store.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(stores)
  } catch (error) {
    console.error('Erro ao buscar lojas:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar lojas' },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const name = body.name?.trim()
    const logoUrl = body.logoUrl?.trim() || null
    const affiliateUrl = body.affiliateUrl?.trim() || null

    if (!name) {
      return NextResponse.json(
        { error: 'Nome da loja é obrigatório' },
        { status: 400 }
      )
    }

    const slug = slugify(name)

    const existingStore = await prisma.store.findUnique({
      where: { slug },
    })

    if (existingStore) {
      return NextResponse.json(
        { error: 'Já existe uma loja com esse nome' },
        { status: 409 }
      )
    }

    const store = await prisma.store.create({
      data: {
        name,
        slug,
        logoUrl,
        affiliateUrl,
        isActive: true,
      },
    })

    return NextResponse.json(store, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar loja:', error)
    return NextResponse.json(
      { error: 'Erro ao criar loja' },
      { status: 500 }
    )
  }
}
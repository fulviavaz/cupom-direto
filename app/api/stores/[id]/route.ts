import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

type Params = {
  params: Promise<{
    id: string
  }>
}

export async function DELETE(_: Request, { params }: Params) {
  try {
    const { id } = await params
    const storeId = Number(id)

    if (isNaN(storeId)) {
      return NextResponse.json(
        { error: 'ID inválido' },
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

    await prisma.store.delete({
      where: { id: storeId },
    })

    return NextResponse.json({
      message: 'Loja excluída com sucesso',
    })
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
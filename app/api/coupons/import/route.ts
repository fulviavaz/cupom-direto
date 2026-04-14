import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import * as XLSX from 'xlsx'

export async function POST(req: Request) {
    try {
        const formData = await req.formData()
        const file = formData.get('file') as File

        const preview = formData.get('preview') === 'true'

        if (!file) {
            return NextResponse.json(
                { error: 'Arquivo não enviado' },
                { status: 400 }
            )
        }

        const bytes = await file.arrayBuffer()
        const workbook = XLSX.read(bytes, { type: 'buffer' })

        const sheet = workbook.Sheets[workbook.SheetNames[0]]
        const rows: any[] = XLSX.utils.sheet_to_json(sheet)

        const errors: string[] = []
        const previewData: any[] = []
        let success = 0

        for (const [index, row] of rows.entries()) {
            try {
                const line = index + 2

                const title = row.titulo?.trim()
                const code = row.codigo?.trim()
                const storeName = row.loja?.trim()
                const categoryName = row.categoria?.trim()

                // validação básica
                if (!title || !storeName || !categoryName) {
                    errors.push(`Linha ${line}: dados obrigatórios faltando`)
                    continue
                }

                // buscar loja
                const store = await prisma.store.findFirst({
                    where: {
                        name: {
                            equals: storeName,
                        },
                    },
                })

                if (!store) {
                    errors.push(`Linha ${line}: loja não encontrada (${storeName})`)
                    continue
                }

                // buscar categoria
                const category = await prisma.tag.findFirst({
                    where: {
                        name: {
                            equals: categoryName,
                        },
                        type: 'categoria',
                    },
                })

                if (!category) {
                    errors.push(
                        `Linha ${line}: categoria não encontrada (${categoryName})`
                    )
                    continue
                }

                // prepara dados
                const couponData = {
                    title,
                    description: row.descricao || null,
                    code: code || null,
                    rules: row.regras || null,
                    discountText: row.texto_desconto || null,
                    discountValue: Number(row.valor_desconto) || null,
                    couponType:
                        (row.tipo_cupom === 'offer' ? 'offer' : 'coupon') as any,
                    redirectUrl: row.redirect_url || null,
                    imageUrl: row.imagem_url || null,
                    storeId: store.id,
                    categoryId: category.id,
                    isFeatured: row.destaque === 'sim',
                    isVerified: row.verificado === 'sim',
                    isActive: row.ativo !== 'nao',
                    expiresAt: row.expira_em
                        ? new Date(row.expira_em)
                        : null,
                }

                // 👇 PREVIEW
                previewData.push({
                    title,
                    store: storeName,
                    category: categoryName,
                    code,
                    valid: true,
                })

                // 👇 IMPORTAÇÃO REAL
                if (!preview) {
                    await prisma.coupon.create({
                        data: couponData,
                    })

                    success++
                }
            } catch (error) {
                const line = index + 2

                errors.push(`Linha ${line}: erro inesperado`)

                previewData.push({
                    title: row.titulo || '',
                    store: row.loja || '',
                    category: row.categoria || '',
                    code: row.codigo || '',
                    valid: false,
                })
            }
        }

        return NextResponse.json({
            success,
            errors,
            previewData,
            mode: preview ? 'preview' : 'import',
        })
    } catch (error) {
        console.error('Erro ao importar cupons:', error)

        return NextResponse.json(
            {
                error: 'Erro ao importar cupons',
                details:
                    error instanceof Error ? error.message : String(error),
            },
            { status: 500 }
        )
    }
}
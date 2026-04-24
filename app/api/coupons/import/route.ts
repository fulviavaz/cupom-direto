import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import * as XLSX from 'xlsx'
import { slugify } from '@/lib/slugify'
import { cookies } from 'next/headers'

type RawRow = Record<string, unknown>

function getString(value: unknown) {
    if (value === null || value === undefined) return ''
    return String(value).trim()
}

function getBoolean(value: unknown) {
    if (typeof value === 'boolean') return value

    const normalized = getString(value).toLowerCase()

    return (
        normalized === 'true' ||
        normalized === '1' ||
        normalized === 'sim' ||
        normalized === 'yes' ||
        normalized === 'ativo'
    )
}

function getNumber(value: unknown) {
    if (typeof value === 'number') return value

    const normalized = getString(value).replace(',', '.')
    const parsed = Number(normalized)

    return Number.isNaN(parsed) ? null : parsed
}

function getDate(value: unknown) {
    if (!value) return null

    if (value instanceof Date) return value

    if (typeof value === 'number') {
        const parsed = XLSX.SSF.parse_date_code(value)

        if (!parsed) return null

        return new Date(
            parsed.y,
            parsed.m - 1,
            parsed.d,
            parsed.H || 0,
            parsed.M || 0,
            parsed.S || 0
        )
    }

    const str = getString(value)

    if (!str) return null

    const parsed = new Date(str)

    return Number.isNaN(parsed.getTime()) ? null : parsed
}

export async function POST(req: Request) {
    try {
        const formData = await req.formData()

        const file = formData.get('file') as File | null
        const preview = formData.get('preview') === 'true'

        if (!file) {
            return NextResponse.json(
                {
                    error: 'Arquivo não enviado',
                },
                {
                    status: 400,
                }
            )
        }

        const cookieStore = await cookies()

        const sessionCookie = cookieStore.get('session')

        let uploadedById: number | null = null

        if (sessionCookie) {
            try {
                const session = JSON.parse(sessionCookie.value)
                uploadedById = session?.userId
                    ? Number(session.userId)
                    : null
            } catch {
                uploadedById = null
            }
        }

        const bytes = await file.arrayBuffer()

        const workbook = XLSX.read(bytes, {
            type: 'buffer',
        })

        const couponsSheet = workbook.Sheets['Cupons']
        const brandsSheet = workbook.Sheets['Marcas']
        const categoriesSheet = workbook.Sheets['Categorias']

        if (!couponsSheet) {
            return NextResponse.json(
                {
                    error: 'A aba "Cupons" não foi encontrada na planilha',
                },
                {
                    status: 400,
                }
            )
        }

        const couponRows = XLSX.utils.sheet_to_json<RawRow>(
            couponsSheet,
            {
                defval: '',
                raw: true,
            }
        )

        const brandRows = brandsSheet
            ? XLSX.utils.sheet_to_json<RawRow>(brandsSheet, {
                defval: '',
                raw: true,
            })
            : []

        const categoryRows = categoriesSheet
            ? XLSX.utils.sheet_to_json<RawRow>(categoriesSheet, {
                defval: '',
                raw: true,
            })
            : []

        const errors: string[] = []

        const previewData: Array<{
            title: string
            store: string
            category: string
            code: string
            valid: boolean
        }> = []

        let success = 0
        let skippedDuplicates = 0

        const brandMap = new Map<string, RawRow>()
        const categoryMap = new Map<string, RawRow>()

        for (const row of brandRows) {
            const id = getString(row['ID Marca'])
            const name = getString(row['Marca'])

            if (
                id &&
                name &&
                id.toLowerCase() !== 'gerado pelo sistema'
            ) {
                brandMap.set(id, row)
            }
        }

        for (const row of categoryRows) {
            const id = getString(row['ID Categoria'])
            const name = getString(row['Categoria'])

            if (
                id &&
                name &&
                id.toLowerCase() !== 'gerado pelo sistema'
            ) {
                categoryMap.set(id, row)
            }
        }

        for (const [index, row] of couponRows.entries()) {
            const line = index + 2

            try {
                const title = getString(row['Título Cupom'])

                const code =
                    getString(row['Código Cupom']) || null

                const description =
                    getString(
                        row['Descrição / regras de uso']
                    ) || null

                const redirectUrl =
                    getString(row['Link afiliado']) || null

                const brandRef = getString(row['Marca'])

                const categoryRef =
                    getString(row['Categoria'])

                const expiresAt = getDate(
                    row['Validade cupom']
                )

                const isActive = getBoolean(
                    row['Ativo ou não']
                )

                const priority =
                    getNumber(row['Prioridade']) ?? 0

                if (
                    !title ||
                    title.toLowerCase() === 'texto'
                ) {
                    continue
                }

                if (!brandRef) {
                    errors.push(
                        `Linha ${line}: marca não informada`
                    )

                    previewData.push({
                        title,
                        store: '',
                        category: categoryRef,
                        code: code || '',
                        valid: false,
                    })

                    continue
                }

                if (!categoryRef) {
                    errors.push(
                        `Linha ${line}: categoria não informada`
                    )

                    previewData.push({
                        title,
                        store: brandRef,
                        category: '',
                        code: code || '',
                        valid: false,
                    })

                    continue
                }

                let storeName = brandRef
                let storeDescription: string | null = null
                let storeLogoUrl: string | null = null
                let storeIsActive = true
                let storeIsFeatured = false

                const brandRow = brandMap.get(brandRef)

                if (brandRow) {
                    storeName =
                        getString(brandRow['Marca']) ||
                        brandRef

                    storeDescription =
                        getString(
                            brandRow['Descrição Marca']
                        ) || null

                    storeLogoUrl =
                        getString(
                            brandRow['Logo Marca']
                        ) || null

                    storeIsActive = getBoolean(
                        brandRow['Ativo ou não']
                    )

                    storeIsFeatured =
                        (getNumber(
                            brandRow['Prioridade']
                        ) ?? 999) === 0
                }

                let categoryName = categoryRef
                let categoryIsActive = true
                let categoryIsFeatured = false

                const categoryRow =
                    categoryMap.get(categoryRef)

                if (categoryRow) {
                    categoryName =
                        getString(
                            categoryRow['Categoria']
                        ) || categoryRef

                    categoryIsActive = getBoolean(
                        categoryRow['Ativo ou não']
                    )

                    categoryIsFeatured =
                        (getNumber(
                            categoryRow['Prioridade']
                        ) ?? 999) === 0
                }

                previewData.push({
                    title,
                    store: storeName,
                    category: categoryName,
                    code: code || '',
                    valid: true,
                })

                if (preview) {
                    continue
                }

                let store = await prisma.store.findFirst({
                    where: {
                        name: {
                            equals: storeName,
                        },
                    },
                })

                if (!store) {
                    store = await prisma.store.create({
                        data: {
                            name: storeName,
                            slug: slugify(storeName),
                            description: storeDescription,
                            logoUrl: storeLogoUrl,
                            isActive: storeIsActive,
                            isFeatured: storeIsFeatured,
                        },
                    })
                }

                let category =
                    await prisma.tag.findFirst({
                        where: {
                            name: {
                                equals: categoryName,
                            },
                            type: 'categoria',
                        },
                    })

                if (!category) {
                    category = await prisma.tag.create({
                        data: {
                            name: categoryName,
                            slug: slugify(categoryName),
                            type: 'categoria',
                            isActive: categoryIsActive,
                            isFeatured: categoryIsFeatured,
                            icon: 'tag',
                        },
                    })
                }

                const duplicatedCoupon =
                    await prisma.coupon.findFirst({
                        where: {
                            title,
                            code,
                            description,
                            rules: description,
                            redirectUrl,
                            storeId: store.id,
                            categoryId: category.id,
                            couponType: code
                                ? 'coupon'
                                : 'offer',
                            expiresAt,
                        },
                    })

                if (duplicatedCoupon) {
                    skippedDuplicates++

                    errors.push(
                        `Linha ${line}: cupom duplicado ignorado (${title})`
                    )

                    continue
                }

                await prisma.coupon.create({
                    data: {
                        title,
                        code,
                        description,
                        rules: description,
                        redirectUrl,
                        storeId: store.id,
                        categoryId: category.id,
                        couponType: code
                            ? 'coupon'
                            : 'offer',
                        isActive,
                        isVerified: true,
                        isFeatured: priority === 0,
                        expiresAt,
                    },
                })

                success++
            } catch {
                errors.push(
                    `Linha ${line}: erro inesperado`
                )
            }
        }

        const totalRows = couponRows.filter((row) => {
            const title = getString(
                row['Título Cupom']
            )

            return (
                !!title &&
                title.toLowerCase() !== 'texto'
            )
        }).length

        const errorCount = errors.length

        const status = preview
            ? 'preview'
            : errorCount === 0
                ? 'success'
                : success > 0
                    ? 'partial'
                    : 'failed'

        if (!preview) {
            await prisma.couponImportLog.create({
                data: {
                    fileName: file.name,
                    uploadedById,
                    totalRows,
                    successCount: success,
                    errorCount,
                    status,
                    errorSummary: errors.length
                        ? errors.slice(0, 20).join('\n')
                        : null,
                },
            })
        }

        return NextResponse.json({
            success,
            skippedDuplicates,
            errors,
            previewData,
            mode: preview ? 'preview' : 'import',
        })
    } catch (error) {
        console.error(
            'Erro ao importar cupons:',
            error
        )

        return NextResponse.json(
            {
                error: 'Erro ao importar cupons',
                details:
                    error instanceof Error
                        ? error.message
                        : String(error),
            },
            {
                status: 500,
            }
        )
    }
}
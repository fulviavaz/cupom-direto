import { NextResponse } from 'next/server'
import * as XLSX from 'xlsx'

export async function GET() {
    try {
        const rows = [
            {
                titulo: '10% OFF em tênis',
                descricao: 'Desconto válido no site inteiro',
                codigo: 'TENIS10',
                regras: 'Válido para primeira compra',
                texto_desconto: '10 OFF',
                valor_desconto: 10,
                tipo_cupom: 'coupon',
                redirect_url: 'https://www.exemplo.com.br',
                imagem_url: '',
                loja: 'Netshoes',
                categoria: 'Moda',
                destaque: 'sim',
                verificado: 'sim',
                ativo: 'sim',
                expira_em: '2026-12-31',
            },
            {
                titulo: 'Frete grátis em pedidos acima de R$ 99',
                descricao: 'Oferta válida por tempo limitado',
                codigo: '',
                regras: 'Somente compras acima de R$ 99',
                texto_desconto: 'Frete grátis',
                valor_desconto: '',
                tipo_cupom: 'offer',
                redirect_url: 'https://www.exemplo.com.br/oferta',
                imagem_url: '',
                loja: 'Magazine Luiza',
                categoria: 'Tecnologia',
                destaque: 'nao',
                verificado: 'sim',
                ativo: 'sim',
                expira_em: '2026-12-31',
            },
        ]

        const workbook = XLSX.utils.book_new()
        const worksheet = XLSX.utils.json_to_sheet(rows)

        XLSX.utils.book_append_sheet(workbook, worksheet, 'Cupons')

        const buffer = XLSX.write(workbook, {
            type: 'buffer',
            bookType: 'xlsx',
        })

        return new NextResponse(buffer, {
            status: 200,
            headers: {
                'Content-Type':
                    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'Content-Disposition':
                    'attachment; filename="modelo-importacao-cupons.xlsx"',
            },
        })
    } catch (error) {
        console.error('Erro ao gerar modelo:', error)

        return NextResponse.json(
            {
                error: 'Erro ao gerar modelo',
                details: error instanceof Error ? error.message : String(error),
            },
            { status: 500 }
        )
    }
}
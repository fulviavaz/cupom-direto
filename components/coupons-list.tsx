'use client'

import { useState } from 'react'

type Tag = {
  id: number
  name: string
}

type Coupon = {
  id: number
  title: string
  description: string | null
  code: string | null
  rules: string | null
  discountText: string | null
  discountValue: number | null
  couponType: 'coupon' | 'offer'
  redirectUrl: string | null
  imageUrl: string | null
  isFeatured: boolean
  isVerified: boolean
  isActive: boolean
  expiresAt: Date | string | null
  usesCount: number
  store: {
    id: number
    name: string
    logoUrl: string | null
  }
  couponTags: {
    tag: Tag
  }[]
}

function getCouponTypeLabel(type: 'coupon' | 'offer') {
  switch (type) {
    case 'coupon':
      return 'Cupom'
    case 'offer':
      return 'Oferta'
    default:
      return type
  }
}

export default function CouponsList({
  coupons,
  compact = false,
}: {
  coupons: Coupon[]
  compact?: boolean
}) {
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null)
  const [copied, setCopied] = useState(false)

  async function handleCopyAndRedirect() {
    if (!selectedCoupon) return

    try {
      await fetch('/api/coupons/click', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          couponId: selectedCoupon.id,
        }),
      })

      if (selectedCoupon.code) {
        await navigator.clipboard.writeText(selectedCoupon.code)
        setCopied(true)
      }

      if (selectedCoupon.redirectUrl) {
        window.open(selectedCoupon.redirectUrl, '_blank', 'noopener,noreferrer')
      }
    } catch (error) {
      console.error('Erro ao registrar clique/copiar código:', error)

      if (selectedCoupon.redirectUrl) {
        window.open(selectedCoupon.redirectUrl, '_blank', 'noopener,noreferrer')
      }
    }
  }

  function openCouponModal(coupon: Coupon) {
    setSelectedCoupon(coupon)
    setCopied(false)
  }

  function closeCouponModal() {
    setSelectedCoupon(null)
    setCopied(false)
  }

  if (coupons.length === 0) {
    return (
      <div className="rounded-[18px] bg-white p-10 text-center shadow-sm ring-1 ring-black/5">
        <p className="text-sm text-[#666]">Nenhum cupom disponível.</p>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-4">
        {coupons.map((coupon) => (
          <article
            key={coupon.id}
            className="rounded-[16px] bg-[#f8f8f8] px-4 py-4 shadow-sm ring-1 ring-black/5"
          >
            <div className="grid items-center gap-4 md:grid-cols-[110px_1fr_auto_92px]">
              {/* LOGO */}
              <div className="flex h-[58px] items-center justify-center overflow-hidden rounded-[10px] bg-white px-3">
                {coupon.store.logoUrl ? (
                  <img
                    src={coupon.store.logoUrl}
                    alt={coupon.store.name}
                    className="max-h-[36px] w-auto max-w-full object-contain"
                  />
                ) : (
                  <span className="text-[11px] font-semibold text-[#444]">
                    {coupon.store.name}
                  </span>
                )}
              </div>

              {/* CONTEÚDO */}
              <div className="min-w-0">
                <h3 className="truncate text-[16px] font-extrabold uppercase leading-tight text-[#111]">
                  {coupon.title}
                </h3>

                <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-[#444]">
                  <span>Validade 00/00</span>
                  <span>0000 cupons disponíveis</span>
                  <span>{getCouponTypeLabel(coupon.couponType)}</span>
                  {coupon.isVerified && <span>Verificado</span>}
                </div>
              </div>

              {/* CTA */}
              <div className="flex justify-start md:justify-center">
                <button
                  onClick={() => openCouponModal(coupon)}
                  className="min-w-[114px] rounded-[12px] bg-[#06b6b2] px-4 py-3 text-[13px] font-extrabold uppercase leading-tight text-white transition hover:opacity-90"
                >
                  Resgatar
                  <br />
                  cupom
                </button>
              </div>

              {/* DESCONTO */}
              <div className="text-left md:text-right">
                <p className="text-[20px] font-black leading-none text-[#111] md:text-[28px]">
                  {coupon.discountValue !== null ? `${coupon.discountValue}%` : '—'}
                </p>
                <p className="mt-1 text-[11px] font-bold uppercase leading-none text-[#111]">
                  de desconto
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>

      {selectedCoupon && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-[520px] rounded-[20px] bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-[#666]">{selectedCoupon.store.name}</p>
                <h3 className="mt-1 text-[24px] font-extrabold uppercase leading-tight text-[#111]">
                  {selectedCoupon.title}
                </h3>
              </div>

              <button
                onClick={closeCouponModal}
                className="text-sm font-semibold text-[#666] hover:text-[#111]"
              >
                Fechar
              </button>
            </div>

            {selectedCoupon.code ? (
              <div className="mt-6 rounded-[16px] border border-dashed border-[#d7d7d7] bg-[#fafafa] p-5 text-center">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-[#777]">
                  Código do cupom
                </p>
                <p className="mt-2 text-[28px] font-black uppercase text-[#111]">
                  {selectedCoupon.code}
                </p>
              </div>
            ) : (
              <div className="mt-6 rounded-[16px] bg-[#fafafa] p-5 text-center">
                <p className="text-sm text-[#666]">
                  Essa oferta não possui código. Clique abaixo para acessar.
                </p>
              </div>
            )}

            {selectedCoupon.rules && (
              <div className="mt-4 rounded-[16px] bg-[#f6f6f6] p-4">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-[#777]">
                  Regras
                </p>
                <p className="mt-2 text-sm text-[#444]">{selectedCoupon.rules}</p>
              </div>
            )}

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={handleCopyAndRedirect}
                className="flex-1 rounded-[12px] bg-[#06b6b2] px-5 py-3 text-sm font-bold uppercase text-white transition hover:opacity-90"
              >
                {selectedCoupon.code
                  ? copied
                    ? 'Código copiado!'
                    : 'Copiar código e acessar'
                  : 'Acessar oferta'}
              </button>

              <button
                onClick={closeCouponModal}
                className="rounded-[12px] border border-[#d5d5d5] px-5 py-3 text-sm font-semibold text-[#444] transition hover:bg-[#f3f3f3]"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
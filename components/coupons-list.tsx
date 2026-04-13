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

export default function CouponsList({ coupons }: { coupons: Coupon[] }) {
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

  return (
    <>
      {coupons.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center">
          <p className="text-gray-500">Nenhum cupom disponível.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {coupons.map((coupon) => (
          <article
  key={coupon.id}
  className="group rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md"
>
  <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

    {/* ESQUERDA */}
    <div className="flex flex-1 gap-4">

      {/* LOGO */}
      <div className="flex h-20 w-24 shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-white">
        {coupon.store.logoUrl ? (
          <img
            src={coupon.store.logoUrl}
            alt={coupon.store.name}
            className="h-12 w-16 object-contain"
          />
        ) : (
          <span className="px-2 text-center text-xs font-medium text-gray-400">
            {coupon.store.name}
          </span>
        )}
      </div>

      {/* TEXTO */}
      <div className="flex-1 space-y-2">

        {/* BADGES */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700">
            {getCouponTypeLabel(coupon.couponType)}
          </span>

          {coupon.isVerified && (
            <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
              Verificado
            </span>
          )}

          {coupon.isFeatured && (
            <span className="rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-700">
              Destaque
            </span>
          )}
        </div>

        {/* TÍTULO */}
        <h2 className="text-lg font-semibold text-gray-900 group-hover:text-red-600 transition">
          {coupon.title}
        </h2>

        {/* LOJA */}
        <p className="text-sm text-gray-500">
          {coupon.store.name}
        </p>

        {/* DESCRIÇÃO */}
        {coupon.description && (
          <p className="text-sm text-gray-600 line-clamp-2">
            {coupon.description}
          </p>
        )}

        {/* TAGS */}
        <div className="flex flex-wrap gap-2 pt-1">
          {coupon.couponTags.length > 0 ? (
            coupon.couponTags.map((item) => (
              <span
                key={item.tag.id}
                className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-700"
              >
                {item.tag.name}
              </span>
            ))
          ) : (
            <span className="text-sm text-gray-400">
              Sem tags
            </span>
          )}
        </div>
      </div>
    </div>

    {/* DIREITA */}
    <div className="flex flex-col items-start gap-3 lg:items-end">

      {/* DESCONTO (MAIS FORTE) */}
      <div className="text-left lg:text-right">
        {coupon.discountText && (
          <p className="text-sm font-medium text-gray-500">
            {coupon.discountText}
          </p>
        )}

        {coupon.discountValue !== null && (
          <div className="inline-block rounded-lg bg-green-100 px-3 py-1">
            <p className="text-xl font-bold text-green-700">
              {coupon.discountValue}%
            </p>
          </div>
        )}
      </div>

      {/* CÓDIGO */}
      {coupon.code && (
        <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 px-4 py-2 text-sm font-semibold text-gray-700">
          {coupon.code}
        </div>
      )}

      {/* BOTÃO (CTA FORTE) */}
      <button
        onClick={() => openCouponModal(coupon)}
        className="
          w-full lg:w-auto
          rounded-lg
          bg-red-600
          px-5 py-3
          text-sm font-semibold text-white
          transition
          hover:bg-red-700
        "
      >
        Ver {getCouponTypeLabel(coupon.couponType)}
      </button>
    </div>

  </div>
</article>
          ))}
        </div>
      )}

      {selectedCoupon && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-gray-500">
                  {selectedCoupon.store.name}
                </p>
                <h3 className="text-xl font-bold text-gray-900">
                  {selectedCoupon.title}
                </h3>
              </div>

              <button
                onClick={closeCouponModal}
                className="text-sm text-gray-500 hover:text-gray-800"
              >
                Fechar
              </button>
            </div>

            {selectedCoupon.description && (
              <p className="mt-4 text-sm text-gray-600">
                {selectedCoupon.description}
              </p>
            )}

            {selectedCoupon.code ? (
              <div className="mt-6 rounded-xl border border-dashed border-gray-300 bg-gray-50 p-4 text-center">
                <p className="text-xs uppercase tracking-wide text-gray-500">
                  Código do cupom
                </p>
                <p className="mt-2 text-2xl font-bold text-gray-900">
                  {selectedCoupon.code}
                </p>
              </div>
            ) : (
              <div className="mt-6 rounded-xl border border-gray-200 bg-gray-50 p-4 text-center">
                <p className="text-gray-500">Nenhum cupom encontrado para essa busca.</p>
              </div>
            )}

            {selectedCoupon.rules && (
              <div className="mt-4 rounded-xl bg-gray-50 p-4">
                <p className="text-xs uppercase tracking-wide text-gray-500">
                  Regras
                </p>
                <p className="mt-2 text-sm text-gray-700">
                  {selectedCoupon.rules}
                </p>
              </div>
            )}

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={handleCopyAndRedirect}
                className="flex-1 rounded-lg bg-green-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-green-700"
              >
                {selectedCoupon.code
                  ? copied
                    ? 'Código copiado!'
                    : 'Copiar código e acessar'
                  : 'Acessar oferta'}
              </button>

              <button
                onClick={closeCouponModal}
                className="rounded-lg border border-gray-300 px-5 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
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
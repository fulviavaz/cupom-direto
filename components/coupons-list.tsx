'use client'

import { CalendarDays, BadgePercent, CircleCheck, Columns3 } from 'lucide-react'

type Coupon = {
  id: number
  title: string
  code: string | null
  discountValue: number | null
  couponType: 'coupon' | 'offer'
  redirectUrl: string | null
  isVerified: boolean
  expiresAt?: string | Date | null
  store: {
    name: string
    logoUrl: string | null
    _count?: {
      coupons: number
    }
  }
}

function formatDate(date?: string | Date | null) {
  if (!date) return 'Sem validade'

  const parsed = new Date(date)

  if (Number.isNaN(parsed.getTime())) return 'Sem validade'

  return parsed.toLocaleDateString('pt-BR')
}

function getCouponTypeLabel(type: 'coupon' | 'offer') {
  return type === 'coupon' ? 'Cupom' : 'Promoção'
}

export default function CouponsList({
  coupons,
}: {
  coupons: Coupon[]
}) {
  function openCoupon(coupon: Coupon) {
    if (coupon.redirectUrl) {
      window.open(coupon.redirectUrl, '_blank', 'noopener,noreferrer')
    }
  }

  if (!coupons.length) {
    return (
      <div className="rounded-[20px] bg-[#f2f2f2] py-14 text-center text-[14px] text-[#8a8a8a] shadow-sm ring-1 ring-black/5">
        Nenhum cupom disponível.
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {coupons.map((coupon) => (
        <article
          key={coupon.id}
          className="rounded-[18px] bg-[#f1f1f1] px-5 py-3 shadow-sm ring-1 ring-black/10"
        >
          <div className="grid items-center gap-4 md:grid-cols-[150px_1fr_118px_92px]">
            <div className="flex h-[70px] w-[150px] items-center justify-center overflow-hidden rounded-[16px]">
              {coupon.store.logoUrl ? (
                <img
                  src={coupon.store.logoUrl}
                  alt={coupon.store.name}
                  className="h-full w-full object-contain"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center rounded-[16px] bg-[#ececec] text-xs font-semibold text-[#444]">
                  {coupon.store.name}
                </div>
              )}
            </div>

            <div className="min-w-0">
              <h3 className="font-title truncate text-[20px] uppercase leading-none tracking-tight text-[#111]">
                {coupon.title}
              </h3>

              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] font-medium text-[#3f3f3f]">
                <span className="inline-flex items-center gap-1">
                  <CalendarDays className="h-[10px] w-[10px]" />
                  Validade {formatDate(coupon.expiresAt)}
                </span>

                <span className="inline-flex items-center gap-1">
                  <Columns3 className="h-[10px] w-[10px]" />
                  {coupon.store._count?.coupons ?? 0} cupons disponíveis
                </span>

                <span className="inline-flex items-center gap-1">
                  <BadgePercent className="h-[10px] w-[10px]" />
                  {getCouponTypeLabel(coupon.couponType)}
                </span>

                {coupon.isVerified && (
                  <span className="inline-flex items-center gap-1 text-[#11b6b3]">
                    <CircleCheck className="h-[10px] w-[10px]" />
                    Verificado
                  </span>
                )}
              </div>
            </div>

            <div className="flex justify-start md:justify-center">
              <button
                onClick={() => openCoupon(coupon)}
                className="font-title flex h-[78px] w-[108px] items-center justify-center rounded-[16px] bg-[#19b8b5] px-3 text-center text-[18px] uppercase leading-[0.88] text-white transition hover:opacity-90"
              >
                <span>
                  Resgatar
                  <br />
                  cupom
                </span>
              </button>
            </div>

            <div className="text-left md:text-right">
              <p className="font-title text-[34px] leading-none tracking-tight text-[#111]">
                {coupon.discountValue ? `${coupon.discountValue}%` : '—'}
              </p>
              <p className="font-title mt-[2px] text-[16px] uppercase leading-none tracking-tight text-[#111]">
                de desconto
              </p>
            </div>
          </div>
        </article>
      ))}
    </div>
  )
}
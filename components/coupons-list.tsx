'use client'

import { CalendarDays, BadgePercent, CircleCheck } from 'lucide-react'

type Coupon = {
  id: number
  title: string
  code: string | null
  discountValue: number | null
  couponType: 'coupon' | 'offer'
  redirectUrl: string | null
  isVerified: boolean
  store: {
    name: string
    logoUrl: string | null
  }
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
    <div className="space-y-5">
      {coupons.map((coupon) => (
        <article
          key={coupon.id}
          className="rounded-[18px] bg-[#f1f1f1] px-5 py-4 shadow-sm ring-1 ring-black/5"
        >
          <div className="grid items-center gap-5 md:grid-cols-[120px_1fr_136px_92px]">
            <div className="flex h-[64px] items-center justify-center overflow-hidden rounded-[12px] bg-white px-3">
              {coupon.store.logoUrl ? (
                <img
                  src={coupon.store.logoUrl}
                  alt={coupon.store.name}
                  className="max-h-[38px] w-auto max-w-full object-contain"
                />
              ) : (
                <span className="text-[11px] font-semibold text-[#444]">
                  {coupon.store.name}
                </span>
              )}
            </div>

            <div className="min-w-0">
              <h3 className="font-title truncate text-[22px] uppercase leading-none text-[#111]">
                {coupon.title}
              </h3>

              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] font-medium text-[#444]">
                <span className="inline-flex items-center gap-1">
                  <CalendarDays className="h-[11px] w-[11px]" />
                  Validade 00/00
                </span>

                <span className="inline-flex items-center gap-1">
                  <span className="text-[10px]">◫</span>
                  0000 cupons disponíveis
                </span>

                <span className="inline-flex items-center gap-1">
                  <BadgePercent className="h-[11px] w-[11px]" />
                  {coupon.couponType === 'coupon' ? 'Cupom' : 'Promoção'}
                </span>

                {coupon.isVerified && (
                  <span className="inline-flex items-center gap-1 text-[#00a7a2]">
                    <CircleCheck className="h-[11px] w-[11px]" />
                    Verificado
                  </span>
                )}
              </div>
            </div>

            <div className="flex justify-start md:justify-center">
              <button
                onClick={() => openCoupon(coupon)}
                className="font-title min-w-[110px] rounded-[12px] bg-[#08b8b3] px-4 py-3 text-[18px] uppercase leading-[0.95] text-white transition hover:opacity-90"
              >
                Resgatar
                <br />
                cupom
              </button>
            </div>

            <div className="text-left md:text-right">
              <p className="font-title text-[34px] leading-none text-[#111]">
                {coupon.discountValue ? `${coupon.discountValue}%` : '—'}
              </p>
              <p className="mt-1 text-[10px] font-black uppercase leading-none text-[#111]">
                de desconto
              </p>
            </div>
          </div>
        </article>
      ))}
    </div>
  )
}
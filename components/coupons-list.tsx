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
    <div className="space-y-4">
      {coupons.map((coupon) => (
        <article
          key={coupon.id}
          className="rounded-[18px] bg-[#f1f1f1] px-5 py-3 shadow-sm ring-1 ring-black/10"
        >
          <div className="grid items-center gap-4 md:grid-cols-[128px_1fr_112px_78px]">
            {/* LOGO */}
            <div className="flex h-[62px] w-[118px] items-center justify-center overflow-hidden rounded-[12px]">
              {coupon.store.logoUrl ? (
                <img
                  src={coupon.store.logoUrl}
                  alt={coupon.store.name}
                  className="h-full w-full object-contain"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center rounded-[12px] bg-[#ececec] text-xs font-semibold text-[#444]">
                  {coupon.store.name}
                </div>
              )}
            </div>

            {/* INFO */}
            <div className="min-w-0">
              <h3 className="font-title truncate text-[18px] uppercase leading-none text-[#111]">
                {coupon.title}
              </h3>

              <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] font-medium text-[#4a4a4a]">
                <span className="inline-flex items-center gap-1">
                  <CalendarDays className="h-[10px] w-[10px]" />
                  Validade 00/00
                </span>

                <span className="inline-flex items-center gap-1">
                  <span className="text-[10px]">◫</span>
                  0000 cupons disponíveis
                </span>

                <span className="inline-flex items-center gap-1">
                  <BadgePercent className="h-[10px] w-[10px]" />
                  {coupon.couponType === 'coupon' ? 'Cupom' : 'Promoção'}
                </span>

                {coupon.isVerified && (
                  <span className="inline-flex items-center gap-1 text-[#07b8b3]">
                    <CircleCheck className="h-[10px] w-[10px]" />
                    Verificado
                  </span>
                )}
              </div>
            </div>

            {/* BOTÃO */}
            <div className="flex justify-start md:justify-center">
              <button
                onClick={() => openCoupon(coupon)}
                className="font-title flex h-[60px] w-[94px] items-center justify-center rounded-[14px] bg-[#18b7b4] px-3 text-center text-[15px] uppercase leading-[0.9] text-white transition hover:opacity-90"
              >
                <span>
                  Resgatar
                  <br />
                  cupom
                </span>
              </button>
            </div>

            {/* DESCONTO */}
            <div className="text-left md:text-right">
              <p className="font-title text-[30px] leading-none text-[#111]">
                {coupon.discountValue ? `${coupon.discountValue}%` : '—'}
              </p>
              <p className="mt-[2px] text-[9px] font-black uppercase leading-none tracking-tight text-[#111]">
                de desconto
              </p>
            </div>
          </div>
        </article>
      ))}
    </div>
  )
}
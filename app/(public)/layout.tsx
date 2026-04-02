import type { Metadata } from 'next'
import CategoriesBar from '@/components/categories-bar'
import Header from '@/components/header'
import TopBanner from '@/components/top-banner'

export const metadata: Metadata = {
  title: 'Portal de Cupons',
  description: 'Plataforma de cupons de desconto',
}

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <TopBanner />
      <Header />
      <CategoriesBar />
      {children}
    </>
  )
}
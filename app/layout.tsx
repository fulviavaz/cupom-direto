import './globals.css'
import type { Metadata } from 'next'
import CategoriesBar from '@/components/categories-bar'
import Header from '@/components/header'

export const metadata: Metadata = {
  title: 'Portal de Cupons',
  description: 'Plataforma de cupons de desconto',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body>
        <Header />
        <CategoriesBar />
        {children}
      </body>
    </html>
  )
}
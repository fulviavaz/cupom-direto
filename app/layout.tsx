import './globals.css'
import { montserrat, specialGothic } from './fonts'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${montserrat.variable} ${specialGothic.variable}`}>
        {children}
      </body>
    </html>
  )
}
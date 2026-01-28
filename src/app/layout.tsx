import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ReCole - Marketplace Escolar',
  description: 'Compra y vende artículos escolares usados entre familias del mismo colegio',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}

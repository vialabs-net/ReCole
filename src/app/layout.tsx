import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { getUser, getUserProfile } from './actions/auth'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ReCole - Marketplace Escolar',
  description: 'Compra y vende artículos escolares usados entre familias del mismo colegio',
  keywords: ['marketplace', 'escolar', 'uniformes', 'libros', 'útiles', 'Chile'],
  authors: [{ name: 'ReCole' }],
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'ReCole',
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: 'website',
    siteName: 'ReCole',
    title: 'ReCole - Marketplace Escolar',
    description: 'Compra y vende artículos escolares usados entre familias del mismo colegio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ReCole - Marketplace Escolar',
    description: 'Compra y vende artículos escolares usados entre familias del mismo colegio',
  },
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getUser()
  const profile = user ? await getUserProfile() : null

  const userData = profile
    ? {
        name: profile.name,
        email: profile.email,
      }
    : null

  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="theme-color" content="#1e40af" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body className={inter.className}>
        <div className="flex min-h-screen flex-col">
          <Header user={userData} />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  )
}

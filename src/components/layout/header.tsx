'use client'

import Link from 'next/link'
import { Menu, ShoppingCart, User, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { MobileNav } from './mobile-nav'

interface HeaderProps {
  user?: {
    name: string
    email: string
  } | null
}

export function Header({ user }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-primary">ReCole</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <Link
              href="/"
              className="transition-colors hover:text-foreground/80 text-foreground"
            >
              Inicio
            </Link>
            {user ? (
              <>
                <Link
                  href="/publicar"
                  className="transition-colors hover:text-foreground/80 text-foreground/60"
                >
                  Publicar
                </Link>
                <Link
                  href="/mis-publicaciones"
                  className="transition-colors hover:text-foreground/80 text-foreground/60"
                >
                  Mis Publicaciones
                </Link>
              </>
            ) : null}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center space-x-2">
            {user ? (
              <>
                <Button variant="ghost" size="icon" asChild className="hidden md:flex">
                  <Link href="/carrito">
                    <ShoppingCart className="h-5 w-5" />
                    <span className="sr-only">Carrito</span>
                  </Link>
                </Button>
                <Button variant="ghost" size="icon" asChild className="hidden md:flex">
                  <Link href="/perfil">
                    <User className="h-5 w-5" />
                    <span className="sr-only">Perfil</span>
                  </Link>
                </Button>
              </>
            ) : (
              <Button asChild className="hidden md:flex">
                <Link href="/login">Ingresar</Link>
              </Button>
            )}

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Abrir menú</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <MobileNav
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        user={user}
      />
    </>
  )
}

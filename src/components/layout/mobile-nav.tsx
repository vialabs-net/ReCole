'use client'

import Link from 'next/link'
import { X, Home, PlusCircle, Package, ShoppingCart, User, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useEffect } from 'react'

interface MobileNavProps {
  open: boolean
  onClose: () => void
  user?: {
    name: string
    email: string
  } | null
  cartItemsCount?: number
}

export function MobileNav({ open, onClose, user, cartItemsCount = 0 }: MobileNavProps) {
  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (open) {
      document.addEventListener('keydown', handleEscape)
      // Prevent scroll
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm md:hidden"
        onClick={onClose}
      />

      {/* Sidebar */}
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-xs border-l bg-background p-6 shadow-lg md:hidden">
        <div className="flex items-center justify-between mb-8">
          <span className="text-lg font-semibold">Menú</span>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <nav className="flex flex-col space-y-4">
          <Link
            href="/"
            className="flex items-center space-x-3 text-sm font-medium"
            onClick={onClose}
          >
            <Home className="h-5 w-5" />
            <span>Inicio</span>
          </Link>

          {user ? (
            <>
              <Link
                href="/publicar"
                className="flex items-center space-x-3 text-sm font-medium"
                onClick={onClose}
              >
                <PlusCircle className="h-5 w-5" />
                <span>Publicar</span>
              </Link>
              <Link
                href="/mis-publicaciones"
                className="flex items-center space-x-3 text-sm font-medium"
                onClick={onClose}
              >
                <Package className="h-5 w-5" />
                <span>Mis Publicaciones</span>
              </Link>
              <Link
                href="/carrito"
                className="flex items-center space-x-3 text-sm font-medium relative"
                onClick={onClose}
              >
                <div className="relative">
                  <ShoppingCart className="h-5 w-5" />
                  {cartItemsCount > 0 && (
                    <span className="absolute -top-2 -right-2 h-4 w-4 rounded-full bg-primary text-[9px] font-bold text-primary-foreground flex items-center justify-center">
                      {cartItemsCount > 99 ? '99+' : cartItemsCount}
                    </span>
                  )}
                </div>
                <span>Carrito</span>
              </Link>
              <Link
                href="/perfil"
                className="flex items-center space-x-3 text-sm font-medium"
                onClick={onClose}
              >
                <User className="h-5 w-5" />
                <span>Perfil</span>
              </Link>

              <div className="pt-4 border-t">
                <div className="mb-4">
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
                <form action="/api/auth/signout" method="post">
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    <LogOut className="h-4 w-4 mr-2" />
                    Cerrar Sesión
                  </Button>
                </form>
              </div>
            </>
          ) : (
            <div className="pt-4">
              <Button asChild className="w-full">
                <Link href="/login">Ingresar</Link>
              </Button>
            </div>
          )}
        </nav>
      </div>
    </>
  )
}

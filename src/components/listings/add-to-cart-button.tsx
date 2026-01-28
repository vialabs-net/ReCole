'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ShoppingCart, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { addToCart } from '@/app/actions/cart'

interface AddToCartButtonProps {
  listingId: string
  quantityAvailable: number
  variant?: 'default' | 'outline' | 'secondary'
  size?: 'default' | 'sm' | 'lg'
  className?: string
}

export function AddToCartButton({
  listingId,
  quantityAvailable,
  variant = 'default',
  size = 'lg',
  className,
}: AddToCartButtonProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isAdded, setIsAdded] = useState(false)

  const handleAddToCart = async () => {
    try {
      setIsLoading(true)
      await addToCart(listingId, 1)
      setIsAdded(true)

      // Reset after 2 seconds
      setTimeout(() => setIsAdded(false), 2000)

      router.refresh()
    } catch (error) {
      if (error instanceof Error && error.message.includes('iniciar sesión')) {
        // Redirect to login
        router.push(`/login?redirect=/listing/${listingId}`)
      } else {
        console.error('Error adding to cart:', error)
      }
    } finally {
      setIsLoading(false)
    }
  }

  if (quantityAvailable === 0) {
    return (
      <Button variant="outline" size={size} className={className} disabled>
        Agotado
      </Button>
    )
  }

  return (
    <Button
      onClick={handleAddToCart}
      disabled={isLoading || isAdded}
      variant={variant}
      size={size}
      className={className}
    >
      {isAdded ? (
        <>
          <Check className="h-5 w-5 mr-2" />
          Agregado al carrito
        </>
      ) : (
        <>
          <ShoppingCart className="h-5 w-5 mr-2" />
          {isLoading ? 'Agregando...' : 'Agregar al carrito'}
        </>
      )}
    </Button>
  )
}

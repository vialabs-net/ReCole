'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ShoppingCart, Check, Minus, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { addToCart } from '@/app/actions/cart'
import { toast } from 'sonner'

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
  const [quantity, setQuantity] = useState(1)

  const handleAddToCart = async () => {
    try {
      setIsLoading(true)
      await addToCart(listingId, quantity)
      setIsAdded(true)
      toast.success(quantity > 1 ? `${quantity} unidades agregadas al carrito` : 'Agregado al carrito')

      setTimeout(() => {
        setIsAdded(false)
        setQuantity(1)
      }, 2000)

      router.refresh()
    } catch (error) {
      if (error instanceof Error && error.message.includes('iniciar sesión')) {
        toast.error('Debes iniciar sesión para agregar al carrito')
        router.push(`/login?redirect=/listing/${listingId}`)
      } else {
        toast.error('Error al agregar al carrito')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  const incrementQuantity = () => {
    if (quantity < quantityAvailable) {
      setQuantity(quantity + 1)
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
    <div className={className}>
      {/* Quantity Selector - only show if more than 1 available */}
      {quantityAvailable > 1 && !isAdded && (
        <div className="flex items-center justify-center gap-3 mb-3">
          <span className="text-sm text-muted-foreground">Cantidad:</span>
          <div className="flex items-center gap-2 border rounded-md">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9"
              onClick={decrementQuantity}
              disabled={quantity <= 1 || isLoading}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="w-12 text-center font-medium">{quantity}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9"
              onClick={incrementQuantity}
              disabled={quantity >= quantityAvailable || isLoading}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Add to Cart Button */}
      <Button
        onClick={handleAddToCart}
        disabled={isLoading || isAdded}
        variant={variant}
        size={size}
        className="w-full"
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
    </div>
  )
}

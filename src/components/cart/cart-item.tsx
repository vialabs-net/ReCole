'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Minus, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { updateCartItemQuantity, removeFromCart } from '@/app/actions/cart'
import { formatPrice } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface CartItemProps {
  item: {
    id: string
    quantity: number
    listing: {
      id: string
      title: string
      price: number
      currency: string
      condition: string
      size: string | null
      quantityAvailable: number
      images: Array<{ blobUrl: string }>
      category: { name: string }
      grade: { name: string }
    }
  }
}

const conditionLabels: Record<string, string> = {
  new: 'Nuevo',
  like_new: 'Como Nuevo',
  good: 'Bueno',
  fair: 'Aceptable',
}

export function CartItem({ item }: CartItemProps) {
  const router = useRouter()
  const [isUpdating, setIsUpdating] = useState(false)
  const [isRemoving, setIsRemoving] = useState(false)

  const primaryImage = item.listing.images[0]?.blobUrl || '/placeholder-product.png'

  const handleUpdateQuantity = async (newQuantity: number) => {
    if (newQuantity > item.listing.quantityAvailable) {
      return
    }

    try {
      setIsUpdating(true)
      await updateCartItemQuantity(item.id, newQuantity)
      router.refresh()
    } catch (error) {
      toast.error('Error al actualizar cantidad')
    } finally {
      setIsUpdating(false)
    }
  }

  const handleRemove = async () => {
    try {
      setIsRemoving(true)
      await removeFromCart(item.id)
      toast.success('Producto eliminado del carrito')
      router.refresh()
    } catch (error) {
      toast.error('Error al eliminar producto')
      setIsRemoving(false)
    }
  }

  const subtotal = item.listing.price * item.quantity

  return (
    <div className="flex gap-4 p-4 rounded-lg bg-muted/30">
      {/* Image */}
      <Link href={`/listing/${item.listing.id}`} className="flex-shrink-0">
        <div className="relative w-20 h-20 rounded-md overflow-hidden bg-muted">
          <Image
            src={primaryImage}
            alt={item.listing.title}
            fill
            className="object-cover"
            sizes="80px"
          />
        </div>
      </Link>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <Link href={`/listing/${item.listing.id}`}>
          <h3 className="font-medium hover:text-primary transition-colors line-clamp-2">
            {item.listing.title}
          </h3>
        </Link>
        <div className="flex flex-wrap gap-2 mt-1 text-xs text-muted-foreground">
          <span>{item.listing.category.name}</span>
          <span>•</span>
          <span>{conditionLabels[item.listing.condition]}</span>
          {item.listing.size && (
            <>
              <span>•</span>
              <span>Talla {item.listing.size}</span>
            </>
          )}
        </div>
        <div className="mt-2 flex items-center gap-4">
          <div className="font-semibold text-primary">
            {formatPrice(item.listing.price, item.listing.currency)}
          </div>
          {item.quantity > 1 && (
            <div className="text-sm text-muted-foreground">
              Subtotal: {formatPrice(subtotal, item.listing.currency)}
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col items-end gap-2">
        {/* Quantity Controls */}
        <div className="flex items-center gap-1 border rounded-md" role="group" aria-label="Controles de cantidad">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => handleUpdateQuantity(item.quantity - 1)}
            disabled={isUpdating || item.quantity <= 1}
            aria-label="Reducir cantidad"
          >
            <Minus className="h-3 w-3" aria-hidden="true" />
          </Button>
          <span className="w-8 text-center text-sm font-medium" aria-live="polite">{item.quantity}</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => handleUpdateQuantity(item.quantity + 1)}
            disabled={isUpdating || item.quantity >= item.listing.quantityAvailable}
            aria-label="Aumentar cantidad"
          >
            <Plus className="h-3 w-3" aria-hidden="true" />
          </Button>
        </div>

        {/* Available Stock */}
        {item.quantity >= item.listing.quantityAvailable && (
          <p className="text-xs text-muted-foreground">Máximo disponible</p>
        )}

        {/* Remove Button */}
        <Button
          variant="ghost"
          size="sm"
          className="text-destructive hover:text-destructive h-8"
          onClick={handleRemove}
          disabled={isRemoving}
          aria-label={isRemoving ? 'Eliminando producto' : 'Eliminar producto del carrito'}
        >
          <Trash2 className="h-4 w-4 mr-1" aria-hidden="true" />
          {isRemoving ? 'Eliminando...' : 'Eliminar'}
        </Button>
      </div>
    </div>
  )
}

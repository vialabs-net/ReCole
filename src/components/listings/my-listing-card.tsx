'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, Trash2, Calendar, Package, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatPrice } from '@/lib/utils'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { deleteListing } from '@/app/actions/listings'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

interface MyListingCardProps {
  listing: {
    id: string
    title: string
    price: number
    currency: string
    condition: string
    size: string | null
    quantityAvailable: number
    quantitySold: number
    status: string
    createdAt: Date
    images: Array<{ blobUrl: string }>
    school: { name: string }
    grade: { name: string }
    category: { name: string }
  }
}

const conditionLabels: Record<string, string> = {
  new: 'Nuevo',
  like_new: 'Como Nuevo',
  good: 'Bueno',
  fair: 'Aceptable',
}

export function MyListingCard({ listing }: MyListingCardProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const primaryImage = listing.images[0]?.blobUrl || '/placeholder-product.png'

  const handleDelete = async () => {
    try {
      setIsDeleting(true)
      await deleteListing(listing.id)
      router.refresh()
      setShowDeleteDialog(false)
    } catch (error) {
      console.error('Error deleting listing:', error)
      alert(error instanceof Error ? error.message : 'Error al eliminar la publicación')
      setIsDeleting(false)
    }
  }

  return (
    <div className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
      {/* Image */}
      <Link href={`/listing/${listing.id}`} className="block">
        <div
          className="aspect-square w-full bg-cover bg-center bg-muted"
          style={{
            backgroundImage: `url(${primaryImage})`,
            backgroundColor: '#f1f5f9',
          }}
        />
      </Link>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Header */}
        <div>
          <div className="flex items-start justify-between gap-2 mb-2">
            <Link href={`/listing/${listing.id}`}>
              <h3 className="font-semibold line-clamp-2 hover:text-primary transition-colors">
                {listing.title}
              </h3>
            </Link>
            {listing.status === 'active' && (
              <Badge variant="default" className="shrink-0">
                Activa
              </Badge>
            )}
          </div>

          <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
            <span>{listing.category.name}</span>
            <span>•</span>
            <span>{conditionLabels[listing.condition]}</span>
            {listing.size && (
              <>
                <span>•</span>
                <span>Talla {listing.size}</span>
              </>
            )}
          </div>
        </div>

        {/* Price and Stock */}
        <div>
          <div className="text-2xl font-bold text-primary mb-1">
            {formatPrice(listing.price, listing.currency)}
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Package className="h-3 w-3" />
              <span>{listing.quantityAvailable} disponibles</span>
            </div>
            {listing.quantitySold > 0 && (
              <span className="text-green-600 font-medium">
                {listing.quantitySold} vendidos
              </span>
            )}
          </div>
        </div>

        {/* School and Date */}
        <div className="text-xs text-muted-foreground space-y-1">
          <div>{listing.school.name} • {listing.grade.name}</div>
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>
              Publicado {format(new Date(listing.createdAt), "d 'de' MMMM", { locale: es })}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button variant="outline" size="sm" asChild className="flex-1">
            <Link href={`/listing/${listing.id}`}>
              <Eye className="h-4 w-4 mr-1" />
              Ver
            </Link>
          </Button>

          <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>¿Eliminar publicación?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta acción no se puede deshacer. La publicación será eliminada permanentemente.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={(e) => {
                    e.preventDefault()
                    handleDelete()
                  }}
                  disabled={isDeleting}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Eliminando...
                    </>
                  ) : (
                    'Eliminar'
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  )
}

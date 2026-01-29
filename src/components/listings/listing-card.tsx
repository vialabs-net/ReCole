import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatPrice } from '@/lib/utils'
import type { ListingWithDetails } from '@/types'
import { MapPin, Package } from 'lucide-react'

interface ListingCardProps {
  listing: ListingWithDetails
}

const conditionLabels: Record<string, string> = {
  new: 'Nuevo',
  like_new: 'Como Nuevo',
  good: 'Bueno',
  fair: 'Aceptable',
}

// Simple blur placeholder data URL
const blurDataURL = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAUH/8QAIhAAAgEDAwUBAAAAAAAAAAAAAQIDAAQRBSExEhMiQVFh/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAZEQACAwEAAAAAAAAAAAAAAAABAgADESH/2gAMAwEAAhEDEQA/AJmm3V1Bc3KXc0k6d0kLI5YDAGBvgb5PlWrqKSilBOxiT9Soq1K6jMqeP//Z'

export function ListingCard({ listing }: ListingCardProps) {
  const primaryImage = listing.images[0]?.blobUrl || '/placeholder-product.png'

  return (
    <Link href={`/listing/${listing.id}`}>
      <Card className="h-full transition-all hover:shadow-lg hover:scale-[1.02] cursor-pointer">
        <CardHeader className="p-0">
          <div className="relative aspect-square w-full overflow-hidden rounded-t-lg bg-muted">
            <Image
              src={primaryImage}
              alt={listing.title}
              fill
              className="object-cover transition-opacity duration-300"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              placeholder="blur"
              blurDataURL={blurDataURL}
            />
            {listing.quantityAvailable > 1 && (
              <Badge
                variant="secondary"
                className="absolute top-2 right-2 bg-background/90 backdrop-blur-sm"
              >
                <Package className="h-3 w-3 mr-1" aria-hidden="true" />
                {listing.quantityAvailable} disponibles
              </Badge>
            )}
            {listing.size && (
              <Badge
                variant="outline"
                className="absolute top-2 left-2 bg-background/90 backdrop-blur-sm"
              >
                Talla {listing.size}
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-4">
          <div className="mb-2">
            <h3 className="font-semibold line-clamp-2 text-base">
              {listing.title}
            </h3>
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
            <Badge variant="outline" className="text-xs">
              {listing.category.name}
            </Badge>
            <span>•</span>
            <span>{listing.grade.name}</span>
          </div>

          <div className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
            <MapPin className="h-3 w-3" aria-hidden="true" />
            <span className="line-clamp-1">{listing.school.name}</span>
          </div>

          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {listing.description}
          </p>

          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-primary">
                {formatPrice(listing.price, listing.currency)}
              </div>
            </div>
            <Badge variant="secondary">
              {conditionLabels[listing.condition]}
            </Badge>
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0 text-xs text-muted-foreground">
          Por {listing.seller.name}
        </CardFooter>
      </Card>
    </Link>
  )
}

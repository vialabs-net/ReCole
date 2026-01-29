import { notFound } from 'next/navigation'
import Image from 'next/image'
import { MapPin, Calendar, Package } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import { getListingById } from '@/app/actions/listings'
import { AddToCartButton } from '@/components/listings/add-to-cart-button'
import { formatPrice } from '@/lib/utils'
import { CONDITION_LABELS, BLUR_DATA_URL, PLACEHOLDER_IMAGE } from '@/lib/constants'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

interface ListingPageProps {
  params: { id: string }
}

export default async function ListingPage({ params }: ListingPageProps) {
  const { id } = await params

  const listing = await getListingById(id)

  if (!listing) {
    notFound()
  }

  const primaryImage = listing.images[0]?.blobUrl || PLACEHOLDER_IMAGE

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <div className="border-b bg-background sticky top-16 z-10">
        <div className="container px-4 py-4">
          <Breadcrumb
            items={[
              { label: listing.school.name, href: `/c/${listing.school.slug}` },
              { label: listing.title },
            ]}
          />
        </div>
      </div>

      {/* Content */}
      <div className="container px-4 py-8 flex-1">
        <div className="grid gap-8 lg:grid-cols-2 max-w-6xl mx-auto">
          {/* Images */}
          <div>
            <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-muted mb-4">
              <Image
                src={primaryImage}
                alt={listing.title}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            </div>

            {/* Thumbnails if more images */}
            {listing.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {listing.images.slice(1, 5).map((image, index) => (
                  <div
                    key={image.id}
                    className="relative aspect-square rounded-md overflow-hidden bg-muted cursor-pointer hover:opacity-75 transition"
                  >
                    <Image
                      src={image.blobUrl}
                      alt={`${listing.title} - imagen ${index + 2}`}
                      fill
                      className="object-cover"
                      sizes="25vw"
                      placeholder="blur"
                      blurDataURL={BLUR_DATA_URL}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="outline">{listing.category.name}</Badge>
                <Badge variant="secondary">
                  {CONDITION_LABELS[listing.condition]}
                </Badge>
                {listing.size && (
                  <Badge variant="outline">Talla {listing.size}</Badge>
                )}
              </div>

              <h1 className="text-3xl font-bold mb-2">{listing.title}</h1>

              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" aria-hidden="true" />
                  <span>{listing.school.name}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" aria-hidden="true" />
                  <span>
                    {format(new Date(listing.createdAt), "d 'de' MMMM", {
                      locale: es,
                    })}
                  </span>
                </div>
              </div>

              <div className="text-4xl font-bold text-primary mb-6">
                {formatPrice(listing.price, listing.currency)}
              </div>

              {listing.quantityAvailable > 1 && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
                  <Package className="h-4 w-4" aria-hidden="true" />
                  <span>
                    {listing.quantityAvailable} unidades disponibles
                  </span>
                </div>
              )}
            </div>

            {/* Add to Cart */}
            <div className="mb-6 space-y-3">
              <AddToCartButton
                listingId={listing.id}
                quantityAvailable={listing.quantityAvailable}
                className="w-full"
              />

              <p className="text-xs text-muted-foreground text-center">
                Agrega al carrito para ver información de contacto del vendedor
              </p>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h3 className="font-semibold mb-3">Descripción</h3>
              <p className="text-muted-foreground whitespace-pre-wrap">
                {listing.description}
              </p>
            </div>

            {/* Details */}
            <div>
              <h3 className="font-semibold mb-3">Detalles</h3>
              <dl className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <dt className="text-muted-foreground">Vendedor</dt>
                  <dd className="font-medium">{listing.seller.name}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Nivel</dt>
                  <dd className="font-medium">{listing.grade.name}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Categoría</dt>
                  <dd className="font-medium">{listing.category.name}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Estado</dt>
                  <dd className="font-medium">
                    {CONDITION_LABELS[listing.condition]}
                  </dd>
                </div>
                {listing.size && (
                  <div>
                    <dt className="text-muted-foreground">Talla</dt>
                    <dd className="font-medium">{listing.size}</dd>
                  </div>
                )}
                <div>
                  <dt className="text-muted-foreground">Cantidad</dt>
                  <dd className="font-medium">
                    {listing.quantityAvailable}{' '}
                    {listing.quantityAvailable === 1 ? 'unidad' : 'unidades'}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Publicado</dt>
                  <dd className="font-medium">
                    {format(new Date(listing.createdAt), "d 'de' MMMM, yyyy", {
                      locale: es,
                    })}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Footer */}
      <div className="lg:hidden sticky bottom-0 border-t bg-background p-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-2xl font-bold text-primary">
              {formatPrice(listing.price, listing.currency)}
            </div>
            <div className="text-sm text-muted-foreground">
              {listing.quantityAvailable} disponibles
            </div>
          </div>
          <AddToCartButton
            listingId={listing.id}
            quantityAvailable={listing.quantityAvailable}
            size="lg"
          />
        </div>
      </div>
    </div>
  )
}

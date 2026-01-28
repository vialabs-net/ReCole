import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, MapPin, Calendar, Package, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { getListingById } from '@/app/actions/listings'
import { formatPrice, formatPhone } from '@/lib/utils'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

interface ListingPageProps {
  params: { id: string }
}

const conditionLabels: Record<string, string> = {
  new: 'Nuevo',
  like_new: 'Como Nuevo',
  good: 'Bueno',
  fair: 'Aceptable',
}

export default async function ListingPage({ params }: ListingPageProps) {
  const { id } = await params

  const listing = await getListingById(id)

  if (!listing) {
    notFound()
  }

  // Generate WhatsApp link
  const whatsappMessage = encodeURIComponent(
    `Hola! Me interesa tu publicación "${listing.title}" en ReCole (${formatPrice(listing.price, listing.currency)})`
  )
  const whatsappLink = `https://wa.me/${listing.seller.phone.replace('+', '')}?text=${whatsappMessage}`

  const primaryImage = listing.images[0]?.blobUrl || '/placeholder-product.png'

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <div className="border-b bg-background sticky top-16 z-10">
        <div className="container px-4 py-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/c/${listing.school.slug}`}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al marketplace
            </Link>
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="container px-4 py-8 flex-1">
        <div className="grid gap-8 lg:grid-cols-2 max-w-6xl mx-auto">
          {/* Images */}
          <div>
            <div className="aspect-square w-full overflow-hidden rounded-lg bg-muted mb-4">
              {/* Placeholder for image - will be replaced with next/image */}
              <div
                className="h-full w-full bg-cover bg-center"
                style={{
                  backgroundImage: `url(${primaryImage})`,
                  backgroundColor: '#f1f5f9',
                }}
              />
            </div>

            {/* Thumbnails if more images */}
            {listing.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {listing.images.slice(1, 5).map((image, index) => (
                  <div
                    key={image.id}
                    className="aspect-square rounded-md overflow-hidden bg-muted cursor-pointer hover:opacity-75 transition"
                  >
                    <div
                      className="h-full w-full bg-cover bg-center"
                      style={{
                        backgroundImage: `url(${image.blobUrl})`,
                        backgroundColor: '#f1f5f9',
                      }}
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
                  {conditionLabels[listing.condition]}
                </Badge>
                {listing.size && (
                  <Badge variant="outline">Talla {listing.size}</Badge>
                )}
              </div>

              <h1 className="text-3xl font-bold mb-2">{listing.title}</h1>

              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{listing.school.name}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
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
                  <Package className="h-4 w-4" />
                  <span>
                    {listing.quantityAvailable} unidades disponibles
                  </span>
                </div>
              )}
            </div>

            {/* Contact */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold mb-1">Vendedor</h3>
                    <p className="text-muted-foreground">{listing.seller.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatPhone(listing.seller.phone)}
                    </p>
                  </div>
                </div>

                <Button asChild className="w-full" size="lg">
                  <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="h-5 w-5 mr-2" />
                    Contactar por WhatsApp
                  </a>
                </Button>

                <p className="text-xs text-muted-foreground text-center mt-4">
                  Al contactar, serás redirigido a WhatsApp para coordinar la
                  compra directamente con el vendedor.
                </p>
              </CardContent>
            </Card>

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
                    {conditionLabels[listing.condition]}
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
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-2xl font-bold text-primary">
              {formatPrice(listing.price, listing.currency)}
            </div>
            <div className="text-sm text-muted-foreground">
              {listing.quantityAvailable} disponibles
            </div>
          </div>
          <Button asChild size="lg">
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="h-5 w-5 mr-2" />
              Contactar
            </a>
          </Button>
        </div>
      </div>
    </div>
  )
}

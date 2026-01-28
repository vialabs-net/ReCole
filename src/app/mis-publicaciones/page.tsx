import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, PlusCircle, Package } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getUser, getUserProfile } from '@/app/actions/auth'
import { getMyListings } from '@/app/actions/listings'
import { MyListingCard } from '@/components/listings/my-listing-card'

export default async function MyListingsPage() {
  const user = await getUser()
  if (!user) {
    redirect('/login?redirect=/mis-publicaciones')
  }

  const profile = await getUserProfile()
  if (!profile) {
    redirect('/onboarding')
  }

  const listings = await getMyListings()

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <div className="border-b bg-background">
        <div className="container px-4 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver al inicio
              </Link>
            </Button>
            <Button asChild>
              <Link href="/publicar">
                <PlusCircle className="h-4 w-4 mr-2" />
                Nueva Publicación
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container px-4 py-8 flex-1">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Mis Publicaciones</h1>
            <p className="text-muted-foreground">
              {listings.length}{' '}
              {listings.length === 1 ? 'publicación activa' : 'publicaciones activas'}
            </p>
          </div>

          {listings.length === 0 ? (
            <div className="text-center py-16">
              <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-xl font-semibold mb-2">No tienes publicaciones</h2>
              <p className="text-muted-foreground mb-6">
                Publica tus artículos escolares usados y empieza a vender
              </p>
              <Button asChild>
                <Link href="/publicar">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Crear Primera Publicación
                </Link>
              </Button>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {listings.map((listing) => (
                <MyListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

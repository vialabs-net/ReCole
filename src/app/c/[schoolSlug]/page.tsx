import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getSchoolBySlug } from '@/app/actions/schools'
import { getListings } from '@/app/actions/listings'
import { ListingCard } from '@/components/listings/listing-card'

interface SchoolPageProps {
  params: { schoolSlug: string }
}

export default async function SchoolPage({ params }: SchoolPageProps) {
  const { schoolSlug } = await params

  const school = await getSchoolBySlug(schoolSlug)

  if (!school) {
    notFound()
  }

  const listings = await getListings({ schoolSlug })

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div
        className="border-b"
        style={{
          backgroundColor: `${school.primaryColor}05`,
        }}
      >
        <div className="container px-4 py-8">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-1">{school.name}</h1>
              <p className="text-muted-foreground">
                {listings.length} {listings.length === 1 ? 'artículo disponible' : 'artículos disponibles'}
              </p>
            </div>
            <Button asChild>
              <Link href="/publicar">
                <Plus className="h-4 w-4 mr-2" />
                Publicar
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container px-4 py-8">
        {listings.length === 0 ? (
          <div className="text-center py-16">
            <div className="mb-4">
              <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                <Plus className="h-8 w-8 text-muted-foreground" />
              </div>
            </div>
            <h2 className="text-2xl font-semibold mb-2">
              No hay artículos disponibles
            </h2>
            <p className="text-muted-foreground mb-6">
              Sé el primero en publicar un artículo en este colegio
            </p>
            <Button asChild>
              <Link href="/publicar">Publicar Artículo</Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {listings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

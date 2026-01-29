import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import { getSchoolBySlug } from '@/app/actions/schools'
import { getListings, getCategories } from '@/app/actions/listings'
import { ListingCard } from '@/components/listings/listing-card'
import { ListingFilters } from '@/components/listings/listing-filters'

interface SchoolPageProps {
  params: { schoolSlug: string }
  searchParams: {
    category?: string
    grade?: string
    search?: string
    minPrice?: string
    maxPrice?: string
  }
}

export default async function SchoolPage({ params, searchParams }: SchoolPageProps) {
  const { schoolSlug } = await params
  const filters = await searchParams

  const school = await getSchoolBySlug(schoolSlug)

  if (!school) {
    notFound()
  }

  const [listings, categories] = await Promise.all([
    getListings({
      schoolSlug,
      categorySlug: filters.category,
      gradeSlug: filters.grade,
      search: filters.search,
      minPrice: filters.minPrice ? parseInt(filters.minPrice) : undefined,
      maxPrice: filters.maxPrice ? parseInt(filters.maxPrice) : undefined,
    }),
    getCategories(),
  ])

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
          <Breadcrumb
            items={[{ label: school.name }]}
            className="mb-4"
          />
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-1">{school.name}</h1>
              <p className="text-muted-foreground">
                {listings.length} {listings.length === 1 ? 'artículo disponible' : 'artículos disponibles'}
              </p>
            </div>
            <Button asChild className="hidden md:flex">
              <Link href="/publicar">
                <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
                Publicar
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container px-4 py-8">
        {/* Filters */}
        <div className="mb-8">
          <ListingFilters categories={categories} grades={school.grades} />
        </div>

        {/* Listings Grid */}
        {listings.length === 0 ? (
          <div className="text-center py-16">
            <div className="mb-4">
              <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                <Plus className="h-8 w-8 text-muted-foreground" />
              </div>
            </div>
            <h2 className="text-2xl font-semibold mb-2">
              {filters.search || filters.category || filters.grade
                ? 'No se encontraron artículos'
                : 'No hay artículos disponibles'}
            </h2>
            <p className="text-muted-foreground mb-6">
              {filters.search || filters.category || filters.grade
                ? 'Intenta ajustar los filtros de búsqueda'
                : 'Sé el primero en publicar un artículo en este colegio'}
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

      {/* Mobile FAB */}
      <div className="md:hidden fixed bottom-6 right-6">
        <Button asChild size="lg" className="rounded-full shadow-lg h-14 w-14 p-0" aria-label="Publicar artículo">
          <Link href="/publicar">
            <Plus className="h-6 w-6" aria-hidden="true" />
          </Link>
        </Button>
      </div>
    </div>
  )
}

import { redirect } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { getUser, getUserProfile } from '@/app/actions/auth'
import { getSchools, getGradesBySchool, getCategories } from '@/app/actions/listings'
import { PublishListingForm } from '@/components/listings/publish-listing-form'

export default async function PublishPage() {
  const user = await getUser()
  if (!user) {
    redirect('/login?redirect=/publicar')
  }

  const profile = await getUserProfile()
  if (!profile) {
    redirect('/onboarding')
  }

  // Fetch form data
  const [schools, categories] = await Promise.all([getSchools(), getCategories()])

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <div className="border-b bg-background">
        <div className="container px-4 py-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al inicio
            </Link>
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="container px-4 py-8 flex-1">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Publicar Artículo</h1>
            <p className="text-muted-foreground">
              Completa los detalles de tu artículo para publicarlo en el marketplace
            </p>
          </div>

          <PublishListingForm schools={schools} categories={categories} sellerId={profile.id} />
        </div>
      </div>
    </div>
  )
}

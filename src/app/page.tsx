import Link from 'next/link'
import { ArrowRight, Recycle, Users, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getSchools } from './actions/schools'
import { getSchoolStats } from './actions/schools'

export default async function Home() {
  const schools = await getSchools()

  // Get stats for each school
  const schoolsWithStats = await Promise.all(
    schools.map(async (school) => {
      const stats = await getSchoolStats(school.id)
      return {
        ...school,
        ...stats,
      }
    })
  )

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="container px-4 py-16 md:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-6">
            Compra y vende artículos escolares
            <span className="text-primary"> entre familias</span>
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            Uniformes, libros, útiles y más. Dale una segunda vida a los artículos escolares
            y ahorra comprando usado.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="#colegios">
                Ver Colegios
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/login">Publicar Artículo</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-y bg-muted/50 py-16">
        <div className="container px-4">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 rounded-full bg-primary/10 p-3">
                <Recycle className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Economía Circular</h3>
              <p className="text-muted-foreground">
                Dale una segunda vida a uniformes y útiles escolares.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 rounded-full bg-primary/10 p-3">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Entre Familias</h3>
              <p className="text-muted-foreground">
                Compra y vende solo con familias del mismo colegio.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 rounded-full bg-primary/10 p-3">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Seguro y Simple</h3>
              <p className="text-muted-foreground">
                Contacto directo por WhatsApp, sin intermediarios.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Schools List */}
      <section id="colegios" className="container px-4 py-16">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Selecciona tu colegio</h2>
          <p className="text-muted-foreground">
            Encuentra artículos de familias de tu comunidad escolar
          </p>
        </div>

        {schoolsWithStats.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No hay colegios disponibles en este momento.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
            {schoolsWithStats.map((school) => (
              <Link key={school.id} href={`/c/${school.slug}`}>
                <Card className="h-full transition-all hover:shadow-lg hover:scale-105">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="line-clamp-2">{school.name}</span>
                    </CardTitle>
                    <CardDescription>
                      {school.activeListings > 0 ? (
                        <span className="text-primary font-medium">
                          {school.activeListings} {school.activeListings === 1 ? 'artículo disponible' : 'artículos disponibles'}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">
                          Sé el primero en publicar
                        </span>
                      )}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full">
                      Ver Marketplace
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="border-t bg-muted/50 py-16">
        <div className="container px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold mb-4">
              ¿Tienes artículos escolares para vender?
            </h2>
            <p className="text-muted-foreground mb-8">
              Publica gratis y conecta con familias de tu colegio en minutos.
            </p>
            <Button size="lg" asChild>
              <Link href="/login">Comenzar a Vender</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

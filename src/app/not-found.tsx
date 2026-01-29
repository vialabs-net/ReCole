import Link from 'next/link'
import { Home, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <div className="text-center max-w-md">
        <div className="mb-6">
          <span className="text-8xl font-bold text-muted-foreground/20">404</span>
        </div>

        <h1 className="text-2xl font-bold mb-2">Página no encontrada</h1>
        <p className="text-muted-foreground mb-6">
          Lo sentimos, la página que buscas no existe o ha sido movida.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild>
            <Link href="/">
              <Home className="h-4 w-4 mr-2" />
              Ir al inicio
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/#colegios">
              <Search className="h-4 w-4 mr-2" />
              Buscar colegios
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

'use client'

import { useEffect } from 'react'
import { AlertCircle, RefreshCw, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function SchoolError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('School page error:', error)
  }, [error])

  return (
    <div className="flex flex-col min-h-screen">
      <div className="border-b">
        <div className="container px-4 py-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al inicio
            </Link>
          </Button>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center flex-1 px-4">
        <div className="text-center max-w-md">
          <div className="mb-6 flex justify-center">
            <div className="rounded-full bg-destructive/10 p-4">
              <AlertCircle className="h-12 w-12 text-destructive" />
            </div>
          </div>

          <h1 className="text-2xl font-bold mb-2">Error al cargar el colegio</h1>
          <p className="text-muted-foreground mb-6">
            No pudimos cargar los artículos de este colegio. Por favor, intenta nuevamente.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={reset}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Reintentar
            </Button>
            <Button variant="outline" asChild>
              <Link href="/">Ver otros colegios</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

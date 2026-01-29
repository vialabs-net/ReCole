'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { ArrowRight, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

interface School {
  id: string
  name: string
  slug: string
  activeListings: number
}

interface SchoolsListProps {
  schools: School[]
}

// Normalize text for search (remove accents/diacritics)
function normalizeText(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
}

export function SchoolsList({ schools }: SchoolsListProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredSchools = useMemo(() => {
    if (!searchQuery.trim()) {
      return schools
    }

    const normalized = normalizeText(searchQuery)

    return schools.filter((school) =>
      normalizeText(school.name).includes(normalized)
    )
  }, [schools, searchQuery])

  return (
    <div className="space-y-6">
      {/* Search Input */}
      {schools.length > 3 && (
        <div className="max-w-md mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Buscar colegio..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      )}

      {/* Schools Grid */}
      {filteredSchools.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No se encontraron colegios que coincidan con &quot;{searchQuery}&quot;
          </p>
          <Button
            variant="outline"
            onClick={() => setSearchQuery('')}
            className="mt-4"
          >
            Limpiar búsqueda
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
          {filteredSchools.map((school) => (
            <Link key={school.id} href={`/c/${school.slug}`}>
              <Card className="h-full transition-all hover:shadow-lg hover:scale-105">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="line-clamp-2">{school.name}</span>
                  </CardTitle>
                  <CardDescription>
                    {school.activeListings > 0 ? (
                      <span className="text-primary font-medium">
                        {school.activeListings}{' '}
                        {school.activeListings === 1
                          ? 'artículo disponible'
                          : 'artículos disponibles'}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">Sé el primero en publicar</span>
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
    </div>
  )
}

'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { Search, Filter, X, ArrowUpDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useState } from 'react'
import type { Category, Grade } from '@prisma/client'

interface ListingFiltersProps {
  categories: Category[]
  grades: Grade[]
}

const sortOptions = [
  { value: 'recent', label: 'Más recientes' },
  { value: 'price_asc', label: 'Menor precio' },
  { value: 'price_desc', label: 'Mayor precio' },
]

export function ListingFilters({ categories, grades }: ListingFiltersProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [showFilters, setShowFilters] = useState(false)

  const selectedCategory = searchParams.get('category')
  const selectedGrade = searchParams.get('grade')
  const minPrice = searchParams.get('minPrice')
  const maxPrice = searchParams.get('maxPrice')
  const selectedSort = searchParams.get('sort') || 'recent'

  const updateFilter = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString())

    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }

    router.push(`${pathname}?${params.toString()}`)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    updateFilter('search', search || null)
  }

  const clearFilters = () => {
    router.push(pathname)
    setSearch('')
  }

  const hasActiveFilters = selectedCategory || selectedGrade || minPrice || maxPrice || searchParams.get('search')

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
          <input
            type="text"
            placeholder="Buscar uniformes, libros, útiles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-10 pr-4 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            aria-label="Buscar productos"
          />
        </div>
        <Button type="submit" variant="secondary">
          Buscar
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => setShowFilters(!showFilters)}
          className="md:hidden"
          aria-label="Mostrar filtros"
        >
          <Filter className="h-4 w-4" aria-hidden="true" />
        </Button>
      </form>

      {/* Sort & Results Info */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <ArrowUpDown className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          <select
            value={selectedSort}
            onChange={(e) => updateFilter('sort', e.target.value === 'recent' ? null : e.target.value)}
            className="h-9 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            aria-label="Ordenar por"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-muted-foreground">Filtros activos:</span>
          {selectedCategory && (
            <Badge variant="secondary" className="gap-1">
              {categories.find(c => c.slug === selectedCategory)?.name}
              <button
                onClick={() => updateFilter('category', null)}
                className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {selectedGrade && (
            <Badge variant="secondary" className="gap-1">
              {grades.find(g => g.slug === selectedGrade)?.name}
              <button
                onClick={() => updateFilter('grade', null)}
                className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {(minPrice || maxPrice) && (
            <Badge variant="secondary" className="gap-1">
              ${minPrice || '0'} - ${maxPrice || '∞'}
              <button
                onClick={() => {
                  updateFilter('minPrice', null)
                  updateFilter('maxPrice', null)
                }}
                className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            Limpiar todo
          </Button>
        </div>
      )}

      {/* Filter Options */}
      <div className={`${showFilters ? 'block' : 'hidden'} md:block`}>
        <div className="grid gap-4 md:grid-cols-3">
          {/* Category Filter */}
          <div>
            <label className="text-sm font-medium mb-2 block">Categoría</label>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={!selectedCategory ? 'default' : 'outline'}
                size="sm"
                onClick={() => updateFilter('category', null)}
              >
                Todas
              </Button>
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.slug ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => updateFilter('category', category.slug)}
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </div>

          {/* Grade Filter */}
          <div>
            <label className="text-sm font-medium mb-2 block">Nivel</label>
            <select
              value={selectedGrade || ''}
              onChange={(e) => updateFilter('grade', e.target.value || null)}
              className="w-full h-9 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">Todos los niveles</option>
              <optgroup label="Preescolar">
                {grades
                  .filter((g) => g.category === 'preescolar')
                  .map((grade) => (
                    <option key={grade.id} value={grade.slug}>
                      {grade.name}
                    </option>
                  ))}
              </optgroup>
              <optgroup label="Educación Básica">
                {grades
                  .filter((g) => g.category === 'basica')
                  .map((grade) => (
                    <option key={grade.id} value={grade.slug}>
                      {grade.name}
                    </option>
                  ))}
              </optgroup>
              <optgroup label="Educación Media">
                {grades
                  .filter((g) => g.category === 'media')
                  .map((grade) => (
                    <option key={grade.id} value={grade.slug}>
                      {grade.name}
                    </option>
                  ))}
              </optgroup>
            </select>
          </div>

          {/* Price Filter */}
          <div>
            <label className="text-sm font-medium mb-2 block">Rango de precio</label>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Mín"
                value={minPrice || ''}
                onChange={(e) => updateFilter('minPrice', e.target.value || null)}
                className="w-full h-9 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <input
                type="number"
                placeholder="Máx"
                value={maxPrice || ''}
                onChange={(e) => updateFilter('maxPrice', e.target.value || null)}
                className="w-full h-9 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

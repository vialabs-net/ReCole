import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { normalizeGradeSearch, normalizeCategorySearch } from '@/lib/search-helpers'

/**
 * API endpoint para búsqueda de listings por el bot de WhatsApp
 *
 * GET /api/bot/search?q=uniforme+talla+8&school=san+jose&limit=5
 *
 * Query params:
 * - q: texto de búsqueda (requerido)
 * - school: nombre del colegio (opcional)
 * - size: talla específica (opcional)
 * - limit: cantidad máxima de resultados (default: 5)
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams

  const query = searchParams.get('q')
  const schoolName = searchParams.get('school')
  const size = searchParams.get('size')
  const limit = Math.min(parseInt(searchParams.get('limit') || '5'), 10)

  if (!query) {
    return NextResponse.json(
      { error: 'Parámetro "q" es requerido' },
      { status: 400 }
    )
  }

  const where: any = {
    status: 'active',
    quantityAvailable: { gt: 0 },
  }

  // Filtro por colegio (búsqueda parcial en nombre)
  if (schoolName) {
    where.school = {
      name: { contains: schoolName, mode: 'insensitive' },
    }
  }

  // Filtro por talla
  if (size) {
    where.size = { equals: size, mode: 'insensitive' }
  }

  // Búsqueda de texto con variantes normalizadas
  const gradeVariants = normalizeGradeSearch(query)
  const categoryVariants = normalizeCategorySearch(query)

  where.OR = [
    { title: { contains: query, mode: 'insensitive' } },
    { description: { contains: query, mode: 'insensitive' } },
    // Buscar en nombre del nivel con variantes
    ...gradeVariants.map(variant => ({
      grade: {
        name: { contains: variant, mode: 'insensitive' },
      },
    })),
    // Buscar en nombre de categoría con variantes
    ...categoryVariants.map(variant => ({
      category: {
        name: { contains: variant, mode: 'insensitive' },
      },
    })),
  ]

  const listings = await prisma.listing.findMany({
    where,
    include: {
      school: true,
      grade: true,
      category: true,
      seller: {
        select: {
          name: true,
          phone: true,
        },
      },
      images: {
        orderBy: { order: 'asc' },
        take: 1,
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: limit,
  })

  const baseUrl = process.env.APP_URL || 'https://recole.cl'

  const results = listings.map(listing => ({
    id: listing.id,
    title: listing.title,
    price: listing.price / 100,
    priceFormatted: `$${(listing.price / 100).toLocaleString('es-CL')}`,
    condition: listing.condition,
    size: listing.size,
    quantityAvailable: listing.quantityAvailable,
    school: listing.school.name,
    grade: listing.grade.name,
    category: listing.category.name,
    seller: listing.seller.name,
    imageUrl: listing.images[0]?.blobUrl || null,
    url: `${baseUrl}/c/${listing.school.slug}/${listing.id}`,
  }))

  return NextResponse.json({
    query,
    count: results.length,
    results,
  })
}

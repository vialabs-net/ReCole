import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { normalizeGradeSearch, normalizeCategorySearch } from '@/lib/search-helpers'
import { Prisma } from '@prisma/client'
import { BOT_API_LIMITS } from '@/lib/constants'

export async function GET(request: NextRequest) {
  const apiKey = process.env.BOT_API_KEY

  // Require API key in production
  if (process.env.NODE_ENV === 'production' && !apiKey) {
    console.error('BOT_API_KEY not configured in production')
    return NextResponse.json({ error: 'API no configurada' }, { status: 500 })
  }

  // Validate API key if configured
  if (apiKey) {
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')
    if (token !== apiKey) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }
  }

  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get('q')
  const schoolName = searchParams.get('school')
  const size = searchParams.get('size')
  const limitParam = parseInt(searchParams.get('limit') || String(BOT_API_LIMITS.DEFAULT_LIMIT))
  const limit = Number.isNaN(limitParam)
    ? BOT_API_LIMITS.DEFAULT_LIMIT
    : Math.min(Math.max(limitParam, 1), BOT_API_LIMITS.MAX_LIMIT)

  if (!query || query.trim().length < BOT_API_LIMITS.MIN_QUERY_LENGTH) {
    return NextResponse.json(
      { error: `Parámetro "q" requerido (mínimo ${BOT_API_LIMITS.MIN_QUERY_LENGTH} caracteres)` },
      { status: 400 }
    )
  }

  try {
    const where: Prisma.ListingWhereInput = {
      status: 'active',
      quantityAvailable: { gt: 0 },
    }

    if (schoolName) {
      where.school = { name: { contains: schoolName, mode: 'insensitive' } }
    }

    if (size) {
      where.size = { equals: size, mode: 'insensitive' }
    }

    const gradeVariants = normalizeGradeSearch(query)
    const categoryVariants = normalizeCategorySearch(query)

    const gradeConditions: Prisma.ListingWhereInput[] = gradeVariants.map(variant => ({
      grade: { is: { name: { contains: variant, mode: 'insensitive' } } },
    }))

    const categoryConditions: Prisma.ListingWhereInput[] = categoryVariants.map(variant => ({
      category: { is: { name: { contains: variant, mode: 'insensitive' } } },
    }))

    where.OR = [
      { title: { contains: query, mode: 'insensitive' } },
      { description: { contains: query, mode: 'insensitive' } },
      ...gradeConditions,
      ...categoryConditions,
    ]

    const listings = await prisma.listing.findMany({
      where,
      select: {
        id: true,
        title: true,
        price: true,
        condition: true,
        size: true,
        quantityAvailable: true,
        school: { select: { name: true, slug: true } },
        grade: { select: { name: true } },
        category: { select: { name: true } },
        seller: { select: { name: true, phone: true } },
        images: { select: { blobUrl: true }, orderBy: { order: 'asc' }, take: 1 },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    })

    const baseUrl = process.env.APP_URL || 'https://recole.cl'

    const results = listings.map(listing => {
      const phone = listing.seller.phone.replace(/\D/g, '')
      const message = encodeURIComponent(`Hola! Vi tu publicación "${listing.title}" en ReCole`)
      return {
        title: listing.title,
        price: `$${(listing.price / 100).toLocaleString('es-CL')}`,
        condition: listing.condition,
        size: listing.size,
        quantity: listing.quantityAvailable,
        school: listing.school.name,
        grade: listing.grade.name,
        category: listing.category.name,
        seller: listing.seller.name,
        image: listing.images[0]?.blobUrl || null,
        url: `${baseUrl}/c/${listing.school.slug}/${listing.id}`,
        whatsapp: `https://wa.me/${phone}?text=${message}`,
      }
    })

    return NextResponse.json({ query, count: results.length, results })
  } catch (error) {
    console.error('Bot search error:', error)
    return NextResponse.json({ error: 'Error en búsqueda' }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { normalizeGradeSearch, normalizeCategorySearch } from '@/lib/search-helpers'
import { Prisma } from '@prisma/client'

export async function GET(request: NextRequest) {
  const apiKey = process.env.BOT_API_KEY
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
  const limitParam = parseInt(searchParams.get('limit') || '5')
  const limit = Number.isNaN(limitParam) ? 5 : Math.min(Math.max(limitParam, 1), 10)

  if (!query || query.trim().length < 2) {
    return NextResponse.json(
      { error: 'Parámetro "q" requerido (mínimo 2 caracteres)' },
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

    where.OR = [
      { title: { contains: query, mode: 'insensitive' } },
      { description: { contains: query, mode: 'insensitive' } },
      ...gradeVariants.map(variant => ({
        grade: { name: { contains: variant, mode: 'insensitive' } },
      })),
      ...categoryVariants.map(variant => ({
        category: { name: { contains: variant, mode: 'insensitive' } },
      })),
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

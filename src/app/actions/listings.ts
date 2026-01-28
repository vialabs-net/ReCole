'use server'

import { prisma } from '@/lib/prisma'
import { ListingFilters } from '@/types'
import { normalizeGradeSearch, normalizeCategorySearch } from '@/lib/search-helpers'
import { revalidatePath } from 'next/cache'
import { getUser, getUserProfile } from './auth'

/**
 * Get listings with filters
 */
export async function getListings(filters: ListingFilters = {}) {
  const where: any = {
    status: 'active',
  }

  // Base filters (siempre se aplican)
  if (filters.schoolSlug) {
    where.school = { slug: filters.schoolSlug }
  }

  if (filters.gradeSlug) {
    where.grade = { slug: filters.gradeSlug }
  }

  if (filters.categorySlug) {
    where.category = { slug: filters.categorySlug }
  }

  if (filters.condition) {
    where.condition = filters.condition
  }

  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    where.price = {}
    if (filters.minPrice !== undefined) {
      where.price.gte = filters.minPrice * 100 // Convert to centavos
    }
    if (filters.maxPrice !== undefined) {
      where.price.lte = filters.maxPrice * 100
    }
  }

  if (filters.size) {
    where.size = filters.size
  }

  // Search filter (usa AND para combinar con otros filtros)
  if (filters.search) {
    const gradeVariants = normalizeGradeSearch(filters.search)
    const categoryVariants = normalizeCategorySearch(filters.search)

    where.AND = [
      {
        OR: [
          { title: { contains: filters.search, mode: 'insensitive' } },
          { description: { contains: filters.search, mode: 'insensitive' } },
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
        ],
      },
    ]
  }

  const listings = await prisma.listing.findMany({
    where,
    include: {
      school: true,
      grade: true,
      category: true,
      seller: true,
      images: {
        orderBy: { order: 'asc' },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 24, // Pagination: 24 items per page
  })

  return listings
}

/**
 * Get listing by ID
 */
export async function getListingById(id: string) {
  return prisma.listing.findUnique({
    where: { id },
    include: {
      school: true,
      grade: true,
      category: true,
      seller: true,
      images: {
        orderBy: { order: 'asc' },
      },
    },
  })
}

/**
 * Get categories
 */
export async function getCategories() {
  return prisma.category.findMany({
    orderBy: { order: 'asc' },
  })
}

/**
 * Get all schools
 */
export async function getSchools() {
  return prisma.school.findMany({
    orderBy: { name: 'asc' },
  })
}

/**
 * Get grades by school
 */
export async function getGradesBySchool(schoolId: string) {
  return prisma.grade.findMany({
    where: { schoolId },
    orderBy: { order: 'asc' },
  })
}

/**
 * Create a new listing
 */
export async function createListing(data: {
  schoolId: string
  gradeId: string
  categoryId: string
  title: string
  description: string
  price: number
  currency: string
  condition: string
  size?: string
  quantityAvailable: number
  images: Array<{ blobUrl: string; order: number }>
}) {
  const user = await getUser()
  if (!user) {
    throw new Error('Debes iniciar sesión para publicar')
  }

  const profile = await getUserProfile()
  if (!profile) {
    throw new Error('Debes completar tu perfil primero')
  }

  // Create listing with images
  const listing = await prisma.listing.create({
    data: {
      schoolId: data.schoolId,
      gradeId: data.gradeId,
      categoryId: data.categoryId,
      sellerId: profile.id,
      title: data.title,
      description: data.description,
      price: Math.round(data.price * 100), // Convert to centavos
      currency: data.currency,
      condition: data.condition,
      size: data.size || null,
      quantityAvailable: data.quantityAvailable,
      status: 'active',
      images: {
        create: data.images.map((img) => ({
          blobUrl: img.blobUrl,
          order: img.order,
        })),
      },
    },
    include: {
      school: true,
    },
  })

  // Revalidate the school page
  revalidatePath(`/c/${listing.school.slug}`)
  revalidatePath('/mis-publicaciones')

  return listing
}

/**
 * Get user's own listings
 */
export async function getMyListings() {
  const user = await getUser()
  if (!user) {
    return []
  }

  const profile = await getUserProfile()
  if (!profile) {
    return []
  }

  return prisma.listing.findMany({
    where: { sellerId: profile.id },
    include: {
      school: true,
      grade: true,
      category: true,
      images: {
        orderBy: { order: 'asc' },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })
}

/**
 * Delete a listing
 */
export async function deleteListing(listingId: string) {
  const user = await getUser()
  if (!user) {
    throw new Error('Debes iniciar sesión')
  }

  const profile = await getUserProfile()
  if (!profile) {
    throw new Error('Perfil no encontrado')
  }

  // Verify ownership
  const listing = await prisma.listing.findUnique({
    where: { id: listingId },
    include: { school: true },
  })

  if (!listing) {
    throw new Error('Publicación no encontrada')
  }

  if (listing.sellerId !== profile.id) {
    throw new Error('No tienes permiso para eliminar esta publicación')
  }

  // Delete listing (images will be cascade deleted)
  await prisma.listing.delete({
    where: { id: listingId },
  })

  revalidatePath(`/c/${listing.school.slug}`)
  revalidatePath('/mis-publicaciones')

  return { success: true }
}

'use server'

import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import { ListingFilters } from '@/types'
import { normalizeGradeSearch, normalizeCategorySearch } from '@/lib/search-helpers'
import { LISTING_LIMITS } from '@/lib/constants'
import { deleteImages } from '@/lib/blob'
import { revalidatePath } from 'next/cache'
import { getUser, getUserProfile } from './auth'

/**
 * Get listings with filters
 */
export async function getListings(filters: ListingFilters = {}) {
  const where: Prisma.ListingWhereInput = {
    status: 'active',
  }

  // Base filters (siempre se aplican)
  if (filters.schoolSlug) {
    where.school = { is: { slug: filters.schoolSlug } }
  }

  if (filters.gradeSlug) {
    where.grade = { is: { slug: filters.gradeSlug } }
  }

  if (filters.categorySlug) {
    where.category = { is: { slug: filters.categorySlug } }
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

    const gradeConditions: Prisma.ListingWhereInput[] = gradeVariants.map(variant => ({
      grade: { is: { name: { contains: variant, mode: 'insensitive' } } },
    }))

    const categoryConditions: Prisma.ListingWhereInput[] = categoryVariants.map(variant => ({
      category: { is: { name: { contains: variant, mode: 'insensitive' } } },
    }))

    where.AND = [
      {
        OR: [
          { title: { contains: filters.search, mode: 'insensitive' } },
          { description: { contains: filters.search, mode: 'insensitive' } },
          ...gradeConditions,
          ...categoryConditions,
        ],
      },
    ]
  }

  // Determine sort order
  let orderBy: Prisma.ListingOrderByWithRelationInput = { createdAt: 'desc' }
  if (filters.sort === 'price_asc') {
    orderBy = { price: 'asc' }
  } else if (filters.sort === 'price_desc') {
    orderBy = { price: 'desc' }
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
    orderBy,
    take: LISTING_LIMITS.ITEMS_PER_PAGE,
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

  // Verify ownership and get images
  const listing = await prisma.listing.findUnique({
    where: { id: listingId },
    include: { school: true, images: true },
  })

  if (!listing) {
    throw new Error('Publicación no encontrada')
  }

  if (listing.sellerId !== profile.id) {
    throw new Error('No tienes permiso para eliminar esta publicación')
  }

  // Delete images from blob storage
  if (listing.images.length > 0) {
    try {
      await deleteImages(listing.images.map(img => img.blobUrl))
    } catch (error) {
      // Log error but continue with deletion - images may already be deleted
      console.error('Error deleting images from blob storage:', error)
    }
  }

  // Delete listing (images records will be cascade deleted from DB)
  await prisma.listing.delete({
    where: { id: listingId },
  })

  revalidatePath(`/c/${listing.school.slug}`)
  revalidatePath('/mis-publicaciones')

  return { success: true }
}

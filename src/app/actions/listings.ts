'use server'

import { prisma } from '@/lib/prisma'
import { ListingFilters } from '@/types'

/**
 * Get listings with filters
 */
export async function getListings(filters: ListingFilters = {}) {
  const where: any = {
    status: 'active',
  }

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

  if (filters.search) {
    where.OR = [
      { title: { contains: filters.search, mode: 'insensitive' } },
      { description: { contains: filters.search, mode: 'insensitive' } },
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

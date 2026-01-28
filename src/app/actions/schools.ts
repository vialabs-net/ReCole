'use server'

import { prisma } from '@/lib/prisma'

/**
 * Get all active schools
 */
export async function getSchools() {
  return prisma.school.findMany({
    where: { isActive: true },
    orderBy: { name: 'asc' },
  })
}

/**
 * Get school by slug
 */
export async function getSchoolBySlug(slug: string) {
  return prisma.school.findUnique({
    where: { slug },
    include: {
      grades: {
        where: { isActive: true },
        orderBy: { order: 'asc' },
      },
    },
  })
}

/**
 * Get school statistics
 */
export async function getSchoolStats(schoolId: string) {
  const [totalListings, activeListings] = await Promise.all([
    prisma.listing.count({
      where: { schoolId },
    }),
    prisma.listing.count({
      where: { schoolId, status: 'active' },
    }),
  ])

  return {
    totalListings,
    activeListings,
  }
}

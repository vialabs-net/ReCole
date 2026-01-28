import { Listing, ListingImage, School, Grade, Category, UserProfile, Cart, CartItem } from '@prisma/client'

// Listing types
export type ListingWithDetails = Listing & {
  school: School
  grade: Grade
  category: Category
  seller: UserProfile
  images: ListingImage[]
}

export type ListingCondition = 'new' | 'like_new' | 'good' | 'fair'
export type ListingStatus = 'active' | 'sold' | 'deleted'

// Cart types
export type CartWithItems = Cart & {
  items: (CartItem & {
    listing: ListingWithDetails
  })[]
}

// User types
export type UserRole = 'user' | 'admin'

// Grade categories
export type GradeCategory = 'preescolar' | 'basica' | 'media'

// Filter types
export interface ListingFilters {
  schoolSlug?: string
  gradeSlug?: string
  categorySlug?: string
  condition?: ListingCondition
  minPrice?: number
  maxPrice?: number
  search?: string
  size?: string
}

// Form types
export interface CreateListingInput {
  schoolId: string
  gradeId: string
  categoryId: string
  title: string
  description: string
  price: number
  condition: ListingCondition
  size?: string
  quantityAvailable: number
  images: File[]
}

export interface UpdateListingInput {
  title?: string
  description?: string
  price?: number
  condition?: ListingCondition
  size?: string
  quantityAvailable?: number
  status?: ListingStatus
}

export interface CreateUserProfileInput {
  authId: string
  email: string
  name: string
  phone: string
  avatarUrl?: string
}

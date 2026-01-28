'use server'

import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { z } from 'zod'

/**
 * Sign in with Google OAuth
 */
export async function signInWithGoogle(redirectTo?: string) {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${process.env.APP_URL}/api/auth/callback${redirectTo ? `?redirect=${redirectTo}` : ''}`,
    },
  })

  if (error) {
    throw new Error(error.message)
  }

  if (data.url) {
    redirect(data.url)
  }
}

/**
 * Sign out
 */
export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/')
}

/**
 * Get current user session
 */
export async function getSession() {
  const supabase = await createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()
  return session
}

/**
 * Get current user
 */
export async function getUser() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
}

/**
 * Get user profile from database
 */
export async function getUserProfile() {
  const user = await getUser()
  if (!user) return null

  const profile = await prisma.userProfile.findUnique({
    where: { authId: user.id },
  })

  return profile
}

/**
 * Check if user has completed onboarding
 */
export async function hasCompletedOnboarding() {
  const profile = await getUserProfile()
  return profile !== null
}

const onboardingSchema = z.object({
  name: z.string().min(2, 'Nombre debe tener al menos 2 caracteres'),
  phone: z
    .string()
    .regex(/^\+569\d{8}$/, 'Teléfono debe ser formato +56912345678'),
  avatarUrl: z.string().url().optional(),
})

/**
 * Complete user onboarding
 */
export async function completeOnboarding(data: z.infer<typeof onboardingSchema>) {
  const user = await getUser()
  if (!user) {
    throw new Error('No authenticated user')
  }

  // Validate input
  const validated = onboardingSchema.parse(data)

  // Check if profile already exists
  const existing = await prisma.userProfile.findUnique({
    where: { authId: user.id },
  })

  if (existing) {
    throw new Error('Profile already exists')
  }

  // Create profile
  const profile = await prisma.userProfile.create({
    data: {
      authId: user.id,
      email: user.email!,
      name: validated.name,
      phone: validated.phone,
      avatarUrl: validated.avatarUrl,
    },
  })

  // Create empty cart
  await prisma.cart.create({
    data: {
      userId: profile.id,
    },
  })

  return profile
}

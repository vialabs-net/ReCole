'use server'

import { prisma } from '@/lib/prisma'
import { getUser, getUserProfile } from './auth'
import { revalidatePath } from 'next/cache'

/**
 * Add item to cart
 */
export async function addToCart(listingId: string, quantity: number = 1) {
  const user = await getUser()
  if (!user) {
    throw new Error('Debes iniciar sesión para agregar al carrito')
  }

  const profile = await getUserProfile()
  if (!profile) {
    throw new Error('Debes completar tu perfil primero')
  }

  // Get or create cart
  let cart = await prisma.cart.findUnique({
    where: { userId: profile.id },
  })

  if (!cart) {
    cart = await prisma.cart.create({
      data: { userId: profile.id },
    })
  }

  // Check if item already in cart
  const existingItem = await prisma.cartItem.findUnique({
    where: {
      cartId_listingId: {
        cartId: cart.id,
        listingId,
      },
    },
  })

  if (existingItem) {
    // Update quantity
    await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: existingItem.quantity + quantity },
    })
  } else {
    // Create new cart item
    await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        listingId,
        quantity,
      },
    })
  }

  revalidatePath('/carrito')
  return { success: true }
}

/**
 * Remove item from cart
 */
export async function removeFromCart(cartItemId: string) {
  await prisma.cartItem.delete({
    where: { id: cartItemId },
  })

  revalidatePath('/carrito')
  return { success: true }
}

/**
 * Update cart item quantity
 */
export async function updateCartItemQuantity(cartItemId: string, quantity: number) {
  if (quantity <= 0) {
    return removeFromCart(cartItemId)
  }

  await prisma.cartItem.update({
    where: { id: cartItemId },
    data: { quantity },
  })

  revalidatePath('/carrito')
  return { success: true }
}

/**
 * Get user cart
 */
export async function getCart() {
  const user = await getUser()
  if (!user) {
    return null
  }

  const profile = await getUserProfile()
  if (!profile) {
    return null
  }

  const cart = await prisma.cart.findUnique({
    where: { userId: profile.id },
    include: {
      items: {
        include: {
          listing: {
            include: {
              school: true,
              grade: true,
              category: true,
              seller: true,
              images: {
                orderBy: { order: 'asc' },
              },
            },
          },
        },
      },
    },
  })

  return cart
}

/**
 * Get cart items count
 */
export async function getCartItemsCount() {
  const cart = await getCart()
  if (!cart) return 0

  return cart.items.reduce((total, item) => total + item.quantity, 0)
}

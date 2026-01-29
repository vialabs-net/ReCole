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

  // Verify listing exists and has stock
  const listing = await prisma.listing.findUnique({
    where: { id: listingId, status: 'active' },
    select: { quantityAvailable: true, sellerId: true },
  })

  if (!listing) {
    throw new Error('Publicación no encontrada o no disponible')
  }

  // Prevent buying your own listing
  if (listing.sellerId === profile.id) {
    throw new Error('No puedes agregar tu propia publicación al carrito')
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

  // Check if item already in cart and calculate total quantity
  const existingItem = await prisma.cartItem.findUnique({
    where: {
      cartId_listingId: {
        cartId: cart.id,
        listingId,
      },
    },
  })

  const newTotalQuantity = (existingItem?.quantity || 0) + quantity

  // Validate quantity against available stock
  if (newTotalQuantity > listing.quantityAvailable) {
    throw new Error(`Solo hay ${listing.quantityAvailable} unidades disponibles`)
  }

  if (existingItem) {
    // Update quantity
    await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: newTotalQuantity },
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
  const user = await getUser()
  if (!user) {
    throw new Error('No autenticado')
  }

  const profile = await getUserProfile()
  if (!profile) {
    throw new Error('Perfil no encontrado')
  }

  // Verify ownership - cart item must belong to user's cart
  const cartItem = await prisma.cartItem.findFirst({
    where: {
      id: cartItemId,
      cart: { userId: profile.id },
    },
  })

  if (!cartItem) {
    throw new Error('Item no encontrado en tu carrito')
  }

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

  const user = await getUser()
  if (!user) {
    throw new Error('No autenticado')
  }

  const profile = await getUserProfile()
  if (!profile) {
    throw new Error('Perfil no encontrado')
  }

  // Verify ownership and get listing info
  const cartItem = await prisma.cartItem.findFirst({
    where: {
      id: cartItemId,
      cart: { userId: profile.id },
    },
    include: {
      listing: {
        select: { quantityAvailable: true },
      },
    },
  })

  if (!cartItem) {
    throw new Error('Item no encontrado en tu carrito')
  }

  // Validate quantity against available stock
  if (quantity > cartItem.listing.quantityAvailable) {
    throw new Error(`Solo hay ${cartItem.listing.quantityAvailable} unidades disponibles`)
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

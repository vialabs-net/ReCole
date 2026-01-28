import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ShoppingBag, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getCart } from '@/app/actions/cart'
import { getUser } from '@/app/actions/auth'
import { CartItem } from '@/components/cart/cart-item'
import { SellerContactCard } from '@/components/cart/seller-contact-card'
import { formatPrice } from '@/lib/utils'

export default async function CartPage() {
  const user = await getUser()
  if (!user) {
    redirect('/login?redirect=/carrito')
  }

  const cart = await getCart()

  if (!cart || cart.items.length === 0) {
    return (
      <div className="flex flex-col min-h-screen">
        <div className="border-b bg-background">
          <div className="container px-4 py-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver al inicio
              </Link>
            </Button>
          </div>
        </div>

        <div className="container px-4 py-16 flex-1">
          <div className="max-w-2xl mx-auto text-center">
            <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h1 className="text-2xl font-bold mb-2">Tu carrito está vacío</h1>
            <p className="text-muted-foreground mb-6">
              Explora los productos disponibles en tu colegio y agrega algunos al carrito.
            </p>
            <Button asChild>
              <Link href="/">Explorar productos</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Group items by seller
  const itemsBySeller = cart.items.reduce((acc, item) => {
    const sellerId = item.listing.seller.id
    if (!acc[sellerId]) {
      acc[sellerId] = {
        seller: item.listing.seller,
        school: item.listing.school,
        items: [],
        total: 0,
      }
    }
    acc[sellerId].items.push(item)
    acc[sellerId].total += item.listing.price * item.quantity
    return acc
  }, {} as Record<string, { seller: any; school: any; items: any[]; total: number }>)

  const grandTotal = Object.values(itemsBySeller).reduce(
    (total, group) => total + group.total,
    0
  )

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <div className="border-b bg-background sticky top-16 z-10">
        <div className="container px-4 py-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Seguir comprando
            </Link>
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="container px-4 py-8 flex-1">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Mi Carrito</h1>
          <p className="text-muted-foreground mb-8">
            {cart.items.length} {cart.items.length === 1 ? 'producto' : 'productos'} de{' '}
            {Object.keys(itemsBySeller).length}{' '}
            {Object.keys(itemsBySeller).length === 1 ? 'vendedor' : 'vendedores'}
          </p>

          <div className="space-y-8">
            {Object.values(itemsBySeller).map((group) => (
              <div key={group.seller.id} className="border rounded-lg p-6 space-y-4">
                {/* Seller Header */}
                <div className="flex items-start justify-between pb-4 border-b">
                  <div>
                    <h2 className="font-semibold text-lg">{group.seller.name}</h2>
                    <p className="text-sm text-muted-foreground">{group.school.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Total</p>
                    <p className="text-xl font-bold text-primary">
                      {formatPrice(group.total, 'CLP')}
                    </p>
                  </div>
                </div>

                {/* Items */}
                <div className="space-y-4">
                  {group.items.map((item) => (
                    <CartItem key={item.id} item={item} />
                  ))}
                </div>

                {/* Contact Seller */}
                <SellerContactCard seller={group.seller} />
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="mt-8 border-t pt-6">
            <div className="flex items-center justify-between text-lg">
              <span className="font-semibold">Total General</span>
              <span className="text-2xl font-bold text-primary">
                {formatPrice(grandTotal, 'CLP')}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Contacta a cada vendedor por WhatsApp para coordinar el pago y la entrega
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

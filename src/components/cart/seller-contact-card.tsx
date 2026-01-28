'use client'

import { Phone, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface SellerContactCardProps {
  seller: {
    name: string
    phone: string
  }
}

export function SellerContactCard({ seller }: SellerContactCardProps) {
  const handleWhatsAppClick = () => {
    // Remove any formatting from phone number
    const cleanPhone = seller.phone.replace(/\D/g, '')

    // Create WhatsApp message
    const message = encodeURIComponent(
      `Hola ${seller.name}, vi tus productos en ReCole y me gustaría coordinar la compra.`
    )

    // Open WhatsApp
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${message}`
    window.open(whatsappUrl, '_blank')
  }

  return (
    <div className="flex items-center justify-between p-4 bg-primary/5 rounded-lg border border-primary/10">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
          <Phone className="h-5 w-5 text-primary" />
        </div>
        <div>
          <p className="text-sm font-medium">Contactar vendedor</p>
          <p className="text-xs text-muted-foreground">{seller.phone}</p>
        </div>
      </div>
      <Button onClick={handleWhatsAppClick} size="sm" className="gap-2">
        <MessageCircle className="h-4 w-4" />
        WhatsApp
      </Button>
    </div>
  )
}

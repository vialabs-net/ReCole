'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { completeOnboarding } from '@/app/actions/auth'
import type { User } from '@supabase/supabase-js'

interface OnboardingFormProps {
  user: User
}

export function OnboardingForm({ user }: OnboardingFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: user.user_metadata?.full_name || user.user_metadata?.name || '',
    phone: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      // Validate phone format
      const phoneRegex = /^\+569\d{8}$/
      if (!phoneRegex.test(formData.phone)) {
        throw new Error('El teléfono debe tener el formato +56912345678')
      }

      await completeOnboarding({
        name: formData.name,
        phone: formData.phone,
      })

      router.push('/')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ocurrió un error')
      setIsLoading(false)
    }
  }

  const formatPhoneInput = (value: string) => {
    // Remove all non-numeric characters except +
    let cleaned = value.replace(/[^\d+]/g, '')

    // Ensure it starts with +56
    if (!cleaned.startsWith('+56')) {
      if (cleaned.startsWith('56')) {
        cleaned = '+' + cleaned
      } else if (cleaned.startsWith('9')) {
        cleaned = '+56' + cleaned
      } else {
        cleaned = '+56' + cleaned
      }
    }

    // Limit to +569XXXXXXXX (13 characters)
    return cleaned.slice(0, 13)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium">
            Nombre completo *
          </label>
          <input
            id="name"
            type="text"
            required
            minLength={2}
            maxLength={100}
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="Ej: María González"
            disabled={isLoading}
          />
          <p className="text-xs text-muted-foreground">
            Tu nombre será visible en tus publicaciones
          </p>
        </div>

        <div className="space-y-2">
          <label htmlFor="phone" className="text-sm font-medium">
            Teléfono móvil *
          </label>
          <input
            id="phone"
            type="tel"
            required
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: formatPhoneInput(e.target.value) })
            }
            className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="+56912345678"
            disabled={isLoading}
          />
          <p className="text-xs text-muted-foreground">
            Los compradores te contactarán por WhatsApp a este número
          </p>
        </div>
      </div>

      {error && (
        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
        {isLoading ? 'Guardando...' : 'Completar Perfil'}
      </Button>

      <p className="text-xs text-muted-foreground text-center">
        * Campos obligatorios
      </p>
    </form>
  )
}

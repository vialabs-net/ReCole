import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(cents: number, currency: string = 'CLP'): string {
  const amount = cents / 100
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
  }).format(amount)
}

export function formatPhone(phone: string): string {
  // Formato: +56912345678 → +56 9 1234 5678
  if (phone.startsWith('+569')) {
    const number = phone.slice(3)
    return `+56 9 ${number.slice(0, 4)} ${number.slice(4)}`
  }
  return phone
}

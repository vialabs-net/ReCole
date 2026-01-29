'use client'

import { Toaster as SonnerToaster } from 'sonner'

export function Toaster() {
  return (
    <SonnerToaster
      position="bottom-center"
      toastOptions={{
        className: 'text-sm',
        duration: 4000,
      }}
      richColors
      closeButton
    />
  )
}

import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Allowed redirect paths (prevent open redirect attacks)
const ALLOWED_REDIRECTS = [
  '/',
  '/publicar',
  '/carrito',
  '/mis-publicaciones',
  '/ayuda',
]

function isValidRedirect(path: string): boolean {
  // Must start with / (relative path only)
  if (!path.startsWith('/')) return false
  // Must not contain protocol or double slashes (prevent //evil.com)
  if (path.includes('//') || path.includes(':')) return false
  // Check against whitelist or allow /c/* school pages
  return ALLOWED_REDIRECTS.includes(path) || path.startsWith('/c/')
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const redirectParam = requestUrl.searchParams.get('redirect') ?? '/'

  // Validate redirect to prevent open redirect attacks
  const redirect = isValidRedirect(redirectParam) ? redirectParam : '/'

  const baseUrl = process.env.APP_URL || requestUrl.origin

  if (code) {
    const supabase = await createClient()
    const { error, data } = await supabase.auth.exchangeCodeForSession(code)

    if (!error && data.user) {
      const profile = await prisma.userProfile.findUnique({
        where: { email: data.user.email! },
      })

      if (!profile) {
        return NextResponse.redirect(new URL('/onboarding', baseUrl))
      }

      return NextResponse.redirect(new URL(redirect, baseUrl))
    }
  }

  return NextResponse.redirect(new URL('/login?error=auth_failed', baseUrl))
}

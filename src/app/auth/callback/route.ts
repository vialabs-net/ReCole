import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const redirect = requestUrl.searchParams.get('redirect')

  if (code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      return NextResponse.redirect(`${requestUrl.origin}/login?error=${error.message}`)
    }

    if (data.user) {
      // Check if user has completed onboarding
      const profile = await prisma.userProfile.findUnique({
        where: { authId: data.user.id },
      })

      if (!profile) {
        // First time user - redirect to onboarding
        return NextResponse.redirect(`${requestUrl.origin}/onboarding`)
      }

      // Existing user - redirect to requested page or home
      const redirectUrl = redirect || '/'
      return NextResponse.redirect(`${requestUrl.origin}${redirectUrl}`)
    }
  }

  // Default redirect to home
  return NextResponse.redirect(requestUrl.origin)
}

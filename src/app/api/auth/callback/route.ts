import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const redirect = requestUrl.searchParams.get('redirect') ?? '/'

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || requestUrl.origin

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

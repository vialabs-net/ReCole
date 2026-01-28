import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = await createClient()
  await supabase.auth.signOut()

  const baseUrl = process.env.APP_URL || new URL(request.url).origin

  return NextResponse.redirect(new URL('/', baseUrl))
}

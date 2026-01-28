import { redirect } from 'next/navigation'
import { getUser, hasCompletedOnboarding } from '@/app/actions/auth'
import { OnboardingForm } from '@/components/auth/onboarding-form'

export default async function OnboardingPage() {
  const user = await getUser()

  if (!user) {
    redirect('/login')
  }

  // Check if already completed onboarding
  const completed = await hasCompletedOnboarding()
  if (completed) {
    redirect('/')
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">
            Completa tu perfil
          </h1>
          <p className="mt-2 text-muted-foreground">
            Necesitamos algunos datos para que puedas publicar y contactar vendedores
          </p>
        </div>

        <div className="rounded-lg border bg-card p-8">
          <OnboardingForm user={user} />
        </div>
      </div>
    </div>
  )
}

import { redirect } from 'next/navigation'
import { getUser } from '@/app/actions/auth'
import { LoginButton } from '@/components/auth/login-button'

interface LoginPageProps {
  searchParams: {
    redirect?: string
  }
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams
  const user = await getUser()

  // If already logged in, redirect
  if (user) {
    redirect(params.redirect || '/')
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">
            Bienvenido a ReCole
          </h1>
          <p className="mt-2 text-muted-foreground">
            Inicia sesión para comprar y vender artículos escolares
          </p>
        </div>

        <div className="rounded-lg border bg-card p-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-lg font-semibold">Ingresa con tu cuenta</h2>
              <p className="text-sm text-muted-foreground">
                Usa tu cuenta de Google para acceder de forma rápida y segura
              </p>
            </div>

            <LoginButton redirectTo={params.redirect} />

            <div className="space-y-4 pt-4 border-t">
              <p className="text-xs text-muted-foreground">
                Al continuar, aceptas nuestros{' '}
                <a href="/terminos" className="underline hover:text-foreground">
                  Términos y Condiciones
                </a>{' '}
                y{' '}
                <a href="/privacidad" className="underline hover:text-foreground">
                  Política de Privacidad
                </a>
              </p>
            </div>
          </div>
        </div>

        <div className="text-center text-sm text-muted-foreground">
          <p>¿Primera vez en ReCole?</p>
          <p className="mt-1">
            Después de iniciar sesión, te pediremos algunos datos para completar
            tu perfil.
          </p>
        </div>
      </div>
    </div>
  )
}

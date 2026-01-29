import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container px-4 py-8 md:py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div>
            <h3 className="mb-4 text-sm font-semibold">ReCole</h3>
            <p className="text-sm text-muted-foreground">
              Marketplace escolar para compra y venta de artículos usados entre familias.
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold">Navegación</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-foreground">
                  Inicio
                </Link>
              </li>
              <li>
                <Link href="/#colegios" className="text-muted-foreground hover:text-foreground">
                  Colegios
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold">Ayuda</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/ayuda" className="text-muted-foreground hover:text-foreground">
                  Centro de Ayuda
                </Link>
              </li>
              <li>
                <Link href="/terminos" className="text-muted-foreground hover:text-foreground">
                  Términos y Condiciones
                </Link>
              </li>
              <li>
                <Link href="/privacidad" className="text-muted-foreground hover:text-foreground">
                  Privacidad
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold">Contacto</h3>
            <a
              href="mailto:lccastellanosm@gmail.com"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              lccastellanosm@gmail.com
            </a>
          </div>
        </div>

        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} ReCole. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}

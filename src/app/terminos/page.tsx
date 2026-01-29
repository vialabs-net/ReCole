import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Términos y Condiciones - ReCole',
  description: 'Términos y condiciones de uso de ReCole',
}

export default function TerminosPage() {
  return (
    <div className="container max-w-4xl px-4 py-8 md:py-12">
      <h1 className="mb-2 text-3xl font-bold">Términos y Condiciones</h1>
      <p className="mb-8 text-sm text-muted-foreground">
        Última actualización: Enero 2026
      </p>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">1. Aceptación de los Términos</h2>
          <p className="text-muted-foreground mb-4">
            Al acceder y utilizar ReCole (en adelante, &quot;la Plataforma&quot;), usted acepta estar
            legalmente obligado por estos Términos y Condiciones. Si no está de acuerdo con
            alguna parte de estos términos, no debe utilizar la Plataforma.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">2. Descripción del Servicio</h2>
          <p className="text-muted-foreground mb-4">
            ReCole es una plataforma que facilita la conexión entre familias para la compra y
            venta de artículos escolares usados, incluyendo uniformes, libros, útiles y otros
            materiales educativos. ReCole actúa únicamente como intermediario tecnológico y
            no participa en las transacciones entre usuarios.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">3. Registro y Cuenta de Usuario</h2>
          <p className="text-muted-foreground mb-4">
            Para utilizar ciertas funcionalidades de la Plataforma, deberá crear una cuenta
            mediante autenticación con Google. Al registrarse, usted:
          </p>
          <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
            <li>Declara ser mayor de 18 años o contar con autorización de un tutor legal.</li>
            <li>Se compromete a proporcionar información veraz y actualizada.</li>
            <li>Es responsable de mantener la confidencialidad de su cuenta.</li>
            <li>Acepta proporcionar un número de teléfono válido para contacto.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">4. Publicación de Artículos</h2>
          <p className="text-muted-foreground mb-4">
            Al publicar artículos en la Plataforma, usted declara y garantiza que:
          </p>
          <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
            <li>Es el legítimo propietario o tiene autorización para vender el artículo.</li>
            <li>La descripción, fotos y estado del artículo son veraces y precisos.</li>
            <li>El artículo no es robado, falsificado ni infringe derechos de terceros.</li>
            <li>El precio indicado es el precio real de venta.</li>
            <li>El artículo cumple con las categorías permitidas (uniformes, libros, útiles escolares, artículos deportivos, tecnología educativa).</li>
          </ul>
          <p className="text-muted-foreground mb-4">
            ReCole se reserva el derecho de eliminar publicaciones que incumplan estas
            condiciones sin previo aviso.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">5. Transacciones entre Usuarios</h2>
          <p className="text-muted-foreground mb-4">
            ReCole no participa en las transacciones entre usuarios. Las negociaciones, pagos
            y entregas son responsabilidad exclusiva de las partes involucradas. En particular:
          </p>
          <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
            <li>ReCole no procesa pagos ni actúa como intermediario financiero.</li>
            <li>ReCole no garantiza la calidad, seguridad o legalidad de los artículos.</li>
            <li>ReCole no garantiza la veracidad de las publicaciones de los usuarios.</li>
            <li>ReCole no es responsable por incumplimientos entre comprador y vendedor.</li>
            <li>La coordinación de entrega es responsabilidad de las partes.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">6. Comunicación entre Usuarios</h2>
          <p className="text-muted-foreground mb-4">
            La Plataforma facilita el contacto entre usuarios mediante WhatsApp. Al utilizar
            esta funcionalidad:
          </p>
          <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
            <li>Acepta que su número de teléfono sea compartido con potenciales compradores.</li>
            <li>Se compromete a utilizar la comunicación únicamente para fines relacionados con las transacciones.</li>
            <li>No enviará mensajes ofensivos, spam ni contenido inapropiado.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">7. Conducta Prohibida</h2>
          <p className="text-muted-foreground mb-4">
            Los usuarios se comprometen a no:
          </p>
          <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
            <li>Publicar artículos robados, falsificados o ilegales.</li>
            <li>Proporcionar información falsa o engañosa.</li>
            <li>Utilizar la Plataforma para fines distintos a la compraventa de artículos escolares.</li>
            <li>Acosar, amenazar o difamar a otros usuarios.</li>
            <li>Intentar acceder a cuentas de otros usuarios.</li>
            <li>Interferir con el funcionamiento de la Plataforma.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">8. Propiedad Intelectual</h2>
          <p className="text-muted-foreground mb-4">
            Los contenidos de la Plataforma, incluyendo diseño, logos, textos y código, son
            propiedad de ReCole o sus licenciantes. Los usuarios conservan los derechos sobre
            el contenido que publican, pero otorgan a ReCole una licencia no exclusiva para
            mostrar dicho contenido en la Plataforma.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">9. Limitación de Responsabilidad</h2>
          <p className="text-muted-foreground mb-4">
            ReCole no será responsable por:
          </p>
          <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
            <li>Daños derivados de transacciones entre usuarios.</li>
            <li>Pérdidas económicas por uso de la Plataforma.</li>
            <li>Interrupciones o errores en el servicio.</li>
            <li>Contenido publicado por los usuarios.</li>
            <li>Acciones de terceros fuera de nuestro control.</li>
          </ul>
          <p className="text-muted-foreground mb-4">
            La Plataforma se proporciona &quot;tal cual&quot; sin garantías de ningún tipo.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">10. Modificaciones</h2>
          <p className="text-muted-foreground mb-4">
            ReCole se reserva el derecho de modificar estos Términos en cualquier momento.
            Los cambios serán efectivos desde su publicación en la Plataforma. El uso
            continuado después de las modificaciones constituye aceptación de los nuevos
            términos.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">11. Terminación</h2>
          <p className="text-muted-foreground mb-4">
            ReCole puede suspender o terminar su cuenta en cualquier momento por
            incumplimiento de estos Términos, sin perjuicio de otras acciones legales.
            Usted puede eliminar su cuenta en cualquier momento contactándonos.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">12. Ley Aplicable y Jurisdicción</h2>
          <p className="text-muted-foreground mb-4">
            Estos Términos se rigen por las leyes de la República de Chile. Cualquier
            controversia será sometida a los tribunales ordinarios de Santiago de Chile.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">13. Contacto</h2>
          <p className="text-muted-foreground mb-4">
            Para consultas sobre estos Términos, contáctenos en:{' '}
            <a href="mailto:lccastellanosm@gmail.com" className="text-primary hover:underline">
              lccastellanosm@gmail.com
            </a>
          </p>
        </section>
      </div>
    </div>
  )
}

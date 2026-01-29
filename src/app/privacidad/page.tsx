import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Política de Privacidad - ReCole',
  description: 'Política de privacidad y protección de datos de ReCole',
}

export default function PrivacidadPage() {
  return (
    <div className="container max-w-4xl px-4 py-8 md:py-12">
      <h1 className="mb-2 text-3xl font-bold">Política de Privacidad</h1>
      <p className="mb-8 text-sm text-muted-foreground">
        Última actualización: Enero 2026
      </p>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">1. Introducción</h2>
          <p className="text-muted-foreground mb-4">
            En ReCole nos comprometemos a proteger su privacidad. Esta Política de Privacidad
            explica cómo recopilamos, usamos, almacenamos y protegemos su información personal
            cuando utiliza nuestra plataforma.
          </p>
          <p className="text-muted-foreground mb-4">
            Al utilizar ReCole, usted acepta las prácticas descritas en esta política. Le
            recomendamos leerla detenidamente.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">2. Información que Recopilamos</h2>

          <h3 className="text-lg font-medium mb-2 mt-4">2.1 Información de Registro</h3>
          <p className="text-muted-foreground mb-4">
            Cuando crea una cuenta mediante Google, recopilamos:
          </p>
          <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
            <li>Nombre completo</li>
            <li>Dirección de correo electrónico</li>
            <li>Identificador único de Google</li>
            <li>Foto de perfil (si está disponible)</li>
          </ul>

          <h3 className="text-lg font-medium mb-2 mt-4">2.2 Información de Perfil</h3>
          <p className="text-muted-foreground mb-4">
            Para completar su perfil y poder publicar o comprar, solicitamos:
          </p>
          <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
            <li>Número de teléfono (para contacto vía WhatsApp)</li>
          </ul>

          <h3 className="text-lg font-medium mb-2 mt-4">2.3 Información de Publicaciones</h3>
          <p className="text-muted-foreground mb-4">
            Cuando publica artículos, recopilamos:
          </p>
          <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
            <li>Título y descripción del artículo</li>
            <li>Precio y cantidad disponible</li>
            <li>Fotografías del artículo</li>
            <li>Colegio, nivel y categoría asociados</li>
            <li>Estado y talla del artículo</li>
          </ul>

          <h3 className="text-lg font-medium mb-2 mt-4">2.4 Información de Uso</h3>
          <p className="text-muted-foreground mb-4">
            Recopilamos automáticamente:
          </p>
          <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
            <li>Artículos agregados al carrito</li>
            <li>Fecha y hora de acceso</li>
            <li>Páginas visitadas dentro de la plataforma</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">3. Uso de la Información</h2>
          <p className="text-muted-foreground mb-4">
            Utilizamos su información para:
          </p>
          <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
            <li>Crear y gestionar su cuenta de usuario</li>
            <li>Publicar y mostrar sus artículos en venta</li>
            <li>Facilitar el contacto entre compradores y vendedores</li>
            <li>Enviar notificaciones relacionadas con sus publicaciones</li>
            <li>Mejorar la experiencia de usuario y funcionalidad de la plataforma</li>
            <li>Prevenir fraudes y usos indebidos</li>
            <li>Cumplir con obligaciones legales</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">4. Compartición de Información</h2>

          <h3 className="text-lg font-medium mb-2 mt-4">4.1 Con Otros Usuarios</h3>
          <p className="text-muted-foreground mb-4">
            Cuando publica un artículo, los siguientes datos son visibles públicamente:
          </p>
          <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
            <li>Su nombre</li>
            <li>Información de sus publicaciones (título, precio, fotos, etc.)</li>
          </ul>
          <p className="text-muted-foreground mb-4">
            Cuando un comprador desea contactarlo, su número de teléfono es compartido
            mediante un enlace de WhatsApp para facilitar la comunicación directa.
          </p>

          <h3 className="text-lg font-medium mb-2 mt-4">4.2 Con Proveedores de Servicios</h3>
          <p className="text-muted-foreground mb-4">
            Utilizamos servicios de terceros para operar la plataforma:
          </p>
          <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
            <li><strong>Google</strong>: Autenticación de usuarios</li>
            <li><strong>Supabase</strong>: Gestión de autenticación y base de datos</li>
            <li><strong>Vercel</strong>: Alojamiento de la plataforma y almacenamiento de imágenes</li>
          </ul>
          <p className="text-muted-foreground mb-4">
            Estos proveedores tienen acceso limitado a su información y están obligados a
            protegerla conforme a sus propias políticas de privacidad.
          </p>

          <h3 className="text-lg font-medium mb-2 mt-4">4.3 Por Obligación Legal</h3>
          <p className="text-muted-foreground mb-4">
            Podemos divulgar información si la ley lo requiere o en respuesta a solicitudes
            válidas de autoridades públicas.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">5. Almacenamiento y Seguridad</h2>
          <p className="text-muted-foreground mb-4">
            Su información se almacena en servidores seguros. Implementamos medidas técnicas
            y organizativas para proteger sus datos, incluyendo:
          </p>
          <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
            <li>Cifrado de datos en tránsito (HTTPS)</li>
            <li>Autenticación segura mediante OAuth 2.0</li>
            <li>Acceso restringido a la base de datos</li>
            <li>Copias de seguridad regulares</li>
          </ul>
          <p className="text-muted-foreground mb-4">
            Sin embargo, ningún sistema es completamente seguro. No podemos garantizar la
            seguridad absoluta de su información.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">6. Retención de Datos</h2>
          <p className="text-muted-foreground mb-4">
            Conservamos su información mientras su cuenta esté activa. Cuando elimina su
            cuenta:
          </p>
          <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
            <li>Su perfil y publicaciones son eliminados</li>
            <li>Las imágenes asociadas son eliminadas</li>
            <li>Podemos retener información anonimizada para estadísticas</li>
            <li>Información requerida por ley puede ser conservada por el período legal correspondiente</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">7. Sus Derechos</h2>
          <p className="text-muted-foreground mb-4">
            Conforme a la Ley N° 19.628 sobre Protección de la Vida Privada de Chile, usted tiene derecho a:
          </p>
          <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
            <li><strong>Acceso</strong>: Solicitar información sobre los datos que tenemos de usted</li>
            <li><strong>Rectificación</strong>: Corregir datos inexactos o incompletos</li>
            <li><strong>Eliminación</strong>: Solicitar la eliminación de sus datos personales</li>
            <li><strong>Oposición</strong>: Oponerse al tratamiento de sus datos en ciertos casos</li>
          </ul>
          <p className="text-muted-foreground mb-4">
            Para ejercer estos derechos, contáctenos a{' '}
            <a href="mailto:lccastellanosm@gmail.com" className="text-primary hover:underline">
              lccastellanosm@gmail.com
            </a>
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">8. Menores de Edad</h2>
          <p className="text-muted-foreground mb-4">
            ReCole no está dirigido a menores de 18 años. No recopilamos intencionalmente
            información de menores. Si detectamos que un menor ha proporcionado información,
            procederemos a eliminarla.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">9. Cookies y Tecnologías Similares</h2>
          <p className="text-muted-foreground mb-4">
            Utilizamos cookies esenciales para:
          </p>
          <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
            <li>Mantener su sesión iniciada</li>
            <li>Recordar sus preferencias</li>
            <li>Garantizar el funcionamiento de la plataforma</li>
          </ul>
          <p className="text-muted-foreground mb-4">
            No utilizamos cookies de seguimiento publicitario ni compartimos información
            con redes publicitarias.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">10. Cambios a esta Política</h2>
          <p className="text-muted-foreground mb-4">
            Podemos actualizar esta Política de Privacidad periódicamente. Los cambios
            serán publicados en esta página con la fecha de actualización. Le recomendamos
            revisar esta política regularmente.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">11. Contacto</h2>
          <p className="text-muted-foreground mb-4">
            Si tiene preguntas sobre esta Política de Privacidad o sobre el tratamiento de
            sus datos personales, contáctenos en:{' '}
            <a href="mailto:lccastellanosm@gmail.com" className="text-primary hover:underline">
              lccastellanosm@gmail.com
            </a>
          </p>
        </section>
      </div>
    </div>
  )
}

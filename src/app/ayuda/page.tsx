import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Centro de Ayuda - ReCole',
  description: 'Preguntas frecuentes y ayuda para usar ReCole',
}

const faqs = [
  {
    question: '¿Qué es ReCole?',
    answer:
      'ReCole es un marketplace donde familias pueden comprar y vender artículos escolares usados como uniformes, libros y útiles. Conectamos a familias del mismo colegio para facilitar el intercambio.',
  },
  {
    question: '¿Cómo publico un artículo?',
    answer:
      'Inicia sesión con tu cuenta de Google, completa tu perfil con tu nombre y teléfono, y luego ve a "Publicar" en el menú. Sube fotos, describe el artículo, indica el precio y listo.',
  },
  {
    question: '¿Cómo contacto a un vendedor?',
    answer:
      'Cuando encuentres un artículo que te interese, agrégalo al carrito. En el carrito verás el botón para contactar al vendedor por WhatsApp directamente.',
  },
  {
    question: '¿ReCole cobra comisión?',
    answer:
      'No. ReCole es completamente gratuito. No cobramos comisión por publicar ni por vender. Las transacciones son directas entre comprador y vendedor.',
  },
  {
    question: '¿Cómo se realiza el pago?',
    answer:
      'El pago es acordado directamente entre comprador y vendedor por WhatsApp. ReCole no procesa pagos. Recomendamos usar transferencia bancaria o efectivo al momento de la entrega.',
  },
  {
    question: '¿Cómo se entrega el producto?',
    answer:
      'La entrega es coordinada entre comprador y vendedor. Generalmente se hace en el mismo colegio o en un punto acordado. ReCole no gestiona envíos.',
  },
  {
    question: '¿Puedo publicar artículos de cualquier colegio?',
    answer:
      'Sí, puedes publicar artículos de cualquier colegio registrado en ReCole. Si tu colegio no aparece, contáctanos para agregarlo.',
  },
  {
    question: '¿Qué artículos puedo vender?',
    answer:
      'Puedes vender uniformes, libros de texto, útiles escolares, mochilas, artículos deportivos y tecnología relacionada con el colegio. No se permiten artículos dañados sin declararlo.',
  },
  {
    question: '¿Cómo elimino una publicación?',
    answer:
      'Ve a "Mis Publicaciones" en tu perfil y encontrarás la opción de eliminar cada publicación.',
  },
  {
    question: '¿Cómo reporto un problema?',
    answer:
      'Escríbenos a lccastellanosm@gmail.com describiendo el problema. Responderemos a la brevedad.',
  },
]

export default function AyudaPage() {
  return (
    <div className="container max-w-4xl px-4 py-8 md:py-12">
      <h1 className="mb-2 text-3xl font-bold">Centro de Ayuda</h1>
      <p className="mb-8 text-muted-foreground">
        Encuentra respuestas a las preguntas más frecuentes sobre ReCole.
      </p>

      <div className="space-y-6">
        {faqs.map((faq, index) => (
          <div key={index} className="rounded-lg border p-6">
            <h2 className="mb-2 text-lg font-semibold">{faq.question}</h2>
            <p className="text-muted-foreground">{faq.answer}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 rounded-lg bg-muted p-6">
        <h2 className="mb-2 text-lg font-semibold">¿No encontraste lo que buscabas?</h2>
        <p className="mb-4 text-muted-foreground">
          Escríbenos y te ayudaremos con tu consulta.
        </p>
        <a
          href="mailto:lccastellanosm@gmail.com"
          className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Contactar soporte
        </a>
      </div>
    </div>
  )
}

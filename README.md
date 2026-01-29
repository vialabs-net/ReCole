# ReCole - Marketplace Escolar

Marketplace multi-colegio en Chile para compra y venta de artículos escolares usados (uniformes, libros, útiles, deportes) entre familias del mismo colegio.

## Stack Tecnológico

- **Framework**: Next.js 14 (App Router)
- **Database**: PostgreSQL (Supabase)
- **ORM**: Prisma
- **Auth**: Supabase Auth (Google OAuth)
- **Storage**: Vercel Blob
- **UI**: Tailwind CSS + shadcn/ui
- **Validation**: Zod
- **Deployment**: Vercel

## Características MVP

- ✅ Multi-tenancy por colegio
- ✅ Autenticación con Google OAuth
- ✅ Publicación de listings con imágenes
- ✅ Sistema de carrito multi-vendedor
- ✅ Contacto directo por WhatsApp
- ✅ Soporte de tallas y cantidades
- ✅ Filtros por nivel, categoría, precio
- ✅ Mobile-first responsive design
- ✅ PWA-ready

## Instalación

### 1. Clonar el repositorio

```bash
git clone <repository-url>
cd ReCole
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Copia `.env.example` a `.env.local` y completa las variables:

```bash
cp .env.example .env.local
```

Edita `.env.local` con tus credenciales de Supabase y Vercel Blob.

### 4. Ejecutar migraciones de base de datos

```bash
npm run db:migrate
```

### 5. Poblar base de datos con datos de prueba

```bash
npm run db:seed
```

### 6. Ejecutar en desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## Scripts Disponibles

- `npm run dev` - Ejecutar servidor de desarrollo
- `npm run build` - Build para producción
- `npm run start` - Ejecutar servidor de producción
- `npm run lint` - Ejecutar linter
- `npm run db:generate` - Generar Prisma Client
- `npm run db:migrate` - Ejecutar migraciones
- `npm run db:seed` - Poblar base de datos
- `npm run db:studio` - Abrir Prisma Studio

## Estructura del Proyecto

```
src/
├── app/
│   ├── actions/        # Server Actions
│   ├── auth/           # Auth callback
│   ├── c/[schoolSlug]/ # Rutas por colegio (próximo commit)
│   ├── layout.tsx      # Layout global
│   └── page.tsx        # Landing page
├── components/
│   ├── layout/         # Header, Footer, Navigation
│   └── ui/             # shadcn/ui components
├── lib/
│   ├── supabase/       # Supabase clients
│   ├── blob.ts         # Vercel Blob helpers
│   ├── prisma.ts       # Prisma client
│   └── utils.ts        # Utilities
└── types/
    └── index.ts        # TypeScript types

prisma/
├── schema.prisma       # Database schema
├── migrations/         # Migrations
└── seed.ts             # Seed data
```

## Configuración de Google OAuth

1. Ir a [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Crear "OAuth 2.0 Client ID" tipo "Web application"
3. Authorized redirect URIs:
   - `https://XXX.supabase.co/auth/v1/callback`
   - `http://localhost:3000/auth/callback` (desarrollo)
4. Copiar Client ID y Client Secret
5. En Supabase Dashboard → Authentication → Providers → Google:
   - Habilitar Google
   - Pegar Client ID y Secret

## Deployment

### Vercel

1. Push a GitHub
2. Importar proyecto en Vercel
3. Configurar variables de entorno en Vercel
4. Deploy automático en cada push a `trunk`

### Variables de Entorno Requeridas

- `DATABASE_URL`
- `DIRECT_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `BLOB_READ_WRITE_TOKEN`

## Testing

```bash
npm run test        # Watch mode
npm run test:run    # Single run
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on how to contribute to this project.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
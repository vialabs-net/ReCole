import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // Clean existing data in development
  if (process.env.NODE_ENV !== 'production') {
    await prisma.cartItem.deleteMany()
    await prisma.cart.deleteMany()
    await prisma.listingImage.deleteMany()
    await prisma.listing.deleteMany()
    await prisma.userProfile.deleteMany()
    await prisma.category.deleteMany()
    await prisma.grade.deleteMany()
    await prisma.school.deleteMany()
    console.log('✅ Cleaned existing data')
  }

  // Create Categories
  console.log('📦 Creating categories...')
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        slug: 'uniformes',
        name: 'Uniformes',
        order: 1,
      },
    }),
    prisma.category.create({
      data: {
        slug: 'libros',
        name: 'Libros',
        order: 2,
      },
    }),
    prisma.category.create({
      data: {
        slug: 'utiles',
        name: 'Útiles Escolares',
        order: 3,
      },
    }),
    prisma.category.create({
      data: {
        slug: 'deportes',
        name: 'Deportes',
        order: 4,
      },
    }),
    prisma.category.create({
      data: {
        slug: 'otros',
        name: 'Otros',
        order: 5,
      },
    }),
  ])
  console.log(`✅ Created ${categories.length} categories`)

  // Create Schools (Lincoln 2 sedes)
  console.log('🏫 Creating schools...')
  const lincolnChicureo = await prisma.school.create({
    data: {
      slug: 'lincoln-chicureo',
      name: 'Lincoln International Academy - Chicureo',
      logoUrl: 'https://lintac.cl/wp-content/uploads/2024/06/Logo-Lintac-2.pdf', // TODO: Extract PNG from PDF
      primaryColor: '#1e40af', // Blue - adjust to actual Lincoln colors
      secondaryColor: '#3b82f6',
      isActive: true,
    },
  })

  const lincolnLoBarnechea = await prisma.school.create({
    data: {
      slug: 'lincoln-lo-barnechea',
      name: 'Lincoln International Academy - Lo Barnechea',
      logoUrl: 'https://lintac.cl/wp-content/uploads/2024/06/Logo-Lintac-2.pdf', // TODO: Extract PNG from PDF
      primaryColor: '#1e40af',
      secondaryColor: '#3b82f6',
      isActive: true,
    },
  })
  console.log('✅ Created 2 schools (Lincoln Chicureo and Lo Barnechea)')

  // Grade levels (Sistema educativo chileno)
  console.log('📚 Creating grade levels...')

  const gradeLevels = [
    // Preescolar
    { slug: 'playgroup-menor', name: 'Playgroup Menor', category: 'preescolar', order: 1 },
    { slug: 'playgroup-mayor', name: 'Playgroup Mayor', category: 'preescolar', order: 2 },
    { slug: 'prekinder', name: 'Prekínder', category: 'preescolar', order: 3 },
    { slug: 'kinder', name: 'Kínder', category: 'preescolar', order: 4 },

    // Educación Básica
    { slug: '1-basico', name: '1° Básico', category: 'basica', order: 5 },
    { slug: '2-basico', name: '2° Básico', category: 'basica', order: 6 },
    { slug: '3-basico', name: '3° Básico', category: 'basica', order: 7 },
    { slug: '4-basico', name: '4° Básico', category: 'basica', order: 8 },
    { slug: '5-basico', name: '5° Básico', category: 'basica', order: 9 },
    { slug: '6-basico', name: '6° Básico', category: 'basica', order: 10 },
    { slug: '7-basico', name: '7° Básico', category: 'basica', order: 11 },
    { slug: '8-basico', name: '8° Básico', category: 'basica', order: 12 },

    // Educación Media
    { slug: '1-medio', name: '1° Medio', category: 'media', order: 13 },
    { slug: '2-medio', name: '2° Medio', category: 'media', order: 14 },
    { slug: '3-medio', name: '3° Medio', category: 'media', order: 15 },
    { slug: '4-medio', name: '4° Medio', category: 'media', order: 16 },
  ]

  // Create grades for both schools
  const gradesChicureo = await Promise.all(
    gradeLevels.map(level =>
      prisma.grade.create({
        data: {
          ...level,
          schoolId: lincolnChicureo.id,
        },
      })
    )
  )

  const gradesLoBarnechea = await Promise.all(
    gradeLevels.map(level =>
      prisma.grade.create({
        data: {
          ...level,
          schoolId: lincolnLoBarnechea.id,
        },
      })
    )
  )

  console.log(`✅ Created ${gradeLevels.length} grades for each school (${gradeLevels.length * 2} total)`)

  // Create demo user
  console.log('👤 Creating demo user...')
  const demoUser = await prisma.userProfile.create({
    data: {
      authId: 'demo-user-auth-id', // Will be replaced by real Supabase auth
      email: 'demo@example.com',
      name: 'Usuario Demo',
      phone: '+56912345678',
      role: 'user',
    },
  })
  console.log('✅ Created demo user')

  // Create demo listings
  console.log('📝 Creating demo listings...')
  const demoListings = [
    {
      schoolId: lincolnChicureo.id,
      gradeId: gradesChicureo.find(g => g.slug === '1-basico')!.id,
      categoryId: categories.find(c => c.slug === 'uniformes')!.id,
      title: 'Pantalón uniforme 1° Básico',
      description: 'Pantalón azul marino del uniforme oficial. En excelente estado, poco uso.',
      price: 15000 * 100, // $15,000 CLP in centavos
      condition: 'like_new',
      size: '6',
      quantityAvailable: 1,
    },
    {
      schoolId: lincolnChicureo.id,
      gradeId: gradesChicureo.find(g => g.slug === '1-basico')!.id,
      categoryId: categories.find(c => c.slug === 'uniformes')!.id,
      title: 'Polera uniforme talla 4 y 6',
      description: 'Polera blanca del uniforme. Tengo 2 unidades: talla 4 y talla 6.',
      price: 8000 * 100,
      condition: 'good',
      size: '4-6',
      quantityAvailable: 2,
    },
    {
      schoolId: lincolnChicureo.id,
      gradeId: gradesChicureo.find(g => g.slug === '2-basico')!.id,
      categoryId: categories.find(c => c.slug === 'libros')!.id,
      title: 'Set completo libros 2° Básico',
      description: 'Todos los libros de lenguaje, matemáticas e inglés. Limpios y sin rayar.',
      price: 45000 * 100,
      condition: 'like_new',
      quantityAvailable: 1,
    },
    {
      schoolId: lincolnLoBarnechea.id,
      gradeId: gradesLoBarnechea.find(g => g.slug === 'kinder')!.id,
      categoryId: categories.find(c => c.slug === 'uniformes')!.id,
      title: 'Buzo deportivo Kínder',
      description: 'Buzo completo (pantalón + chaqueta) talla 4. Impecable.',
      price: 25000 * 100,
      condition: 'like_new',
      size: '4',
      quantityAvailable: 1,
    },
    {
      schoolId: lincolnLoBarnechea.id,
      gradeId: gradesLoBarnechea.find(g => g.slug === '5-basico')!.id,
      categoryId: categories.find(c => c.slug === 'utiles')!.id,
      title: 'Calculadora científica Casio',
      description: 'Calculadora Casio fx-82MS. Funciona perfecto, con su estuche.',
      price: 12000 * 100,
      condition: 'good',
      quantityAvailable: 1,
    },
    {
      schoolId: lincolnChicureo.id,
      gradeId: gradesChicureo.find(g => g.slug === '3-basico')!.id,
      categoryId: categories.find(c => c.slug === 'deportes')!.id,
      title: 'Raqueta de tenis para niños',
      description: 'Raqueta Wilson tamaño junior. Ideal para clases de tenis del colegio.',
      price: 18000 * 100,
      condition: 'good',
      quantityAvailable: 1,
    },
  ]

  const createdListings = await Promise.all(
    demoListings.map(listing =>
      prisma.listing.create({
        data: {
          ...listing,
          sellerId: demoUser.id,
        },
      })
    )
  )

  console.log(`✅ Created ${createdListings.length} demo listings`)

  // Create demo cart
  console.log('🛒 Creating demo cart...')
  const demoCart = await prisma.cart.create({
    data: {
      userId: demoUser.id,
    },
  })
  console.log('✅ Created demo cart')

  console.log('\n🎉 Seed completed successfully!')
  console.log('\n📊 Summary:')
  console.log(`  - Schools: 2`)
  console.log(`  - Categories: ${categories.length}`)
  console.log(`  - Grades: ${gradeLevels.length * 2}`)
  console.log(`  - Users: 1`)
  console.log(`  - Listings: ${createdListings.length}`)
  console.log(`  - Carts: 1`)
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

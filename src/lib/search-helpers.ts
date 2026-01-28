/**
 * Normaliza texto de búsqueda para niveles escolares
 * Acepta variantes como "5 basico", "quinto basico", "5°", etc.
 */
export function normalizeGradeSearch(search: string): string[] {
  const searchLower = search.toLowerCase().trim()
  const variants: string[] = [searchLower]

  // Mapeo de números a palabras
  const numberWords: Record<string, string[]> = {
    '1': ['primero', 'primer', '1°', '1º'],
    '2': ['segundo', '2°', '2º'],
    '3': ['tercero', 'tercer', '3°', '3º'],
    '4': ['cuarto', '4°', '4º'],
    '5': ['quinto', '5°', '5º'],
    '6': ['sexto', '6°', '6º'],
    '7': ['séptimo', 'septimo', '7°', '7º'],
    '8': ['octavo', '8°', '8º'],
  }

  // Mapeo de palabras a números
  const wordNumbers: Record<string, string> = {
    'primero': '1', 'primer': '1',
    'segundo': '2',
    'tercero': '3', 'tercer': '3',
    'cuarto': '4',
    'quinto': '5',
    'sexto': '6',
    'séptimo': '7', 'septimo': '7',
    'octavo': '8',
  }

  // Agregar variantes de niveles
  // Si busca "5 basico", agregar "5° Básico"
  const basicoMatch = searchLower.match(/(\d+)\s*(basico|básico)?/)
  if (basicoMatch) {
    const num = basicoMatch[1]
    variants.push(`${num}° básico`)
    variants.push(`${num} básico`)
    variants.push(`${num}°básico`)

    // Agregar versión en palabras si existe
    if (numberWords[num]) {
      numberWords[num].forEach(word => {
        variants.push(`${word} básico`)
      })
    }
  }

  // Si busca "quinto basico", agregar "5° Básico"
  Object.entries(wordNumbers).forEach(([word, num]) => {
    if (searchLower.includes(word)) {
      variants.push(`${num}° básico`)
      variants.push(`${num} básico`)
    }
  })

  // Lo mismo para medio
  const medioMatch = searchLower.match(/(\d+)\s*(medio)?/)
  if (medioMatch) {
    const num = medioMatch[1]
    variants.push(`${num}° medio`)
    variants.push(`${num} medio`)
    variants.push(`${num}°medio`)

    if (numberWords[num]) {
      numberWords[num].forEach(word => {
        variants.push(`${word} medio`)
      })
    }
  }

  // Preescolar
  if (searchLower.includes('kinder') || searchLower.includes('kínder')) {
    variants.push('kínder', 'kinder')
  }
  if (searchLower.includes('prekinder') || searchLower.includes('prekínder')) {
    variants.push('prekínder', 'prekinder')
  }
  if (searchLower.includes('playgroup')) {
    variants.push('playgroup menor', 'playgroup mayor')
  }

  return [...new Set(variants)] // Remove duplicates
}

/**
 * Normaliza búsqueda de categorías
 */
export function normalizeCategorySearch(search: string): string[] {
  const searchLower = search.toLowerCase().trim()
  const variants: string[] = [searchLower]

  const categoryAliases: Record<string, string[]> = {
    'uniforme': ['uniformes', 'ropa', 'polera', 'pantalón', 'pantalon', 'camisa', 'falda', 'buzo'],
    'libro': ['libros', 'texto', 'textos', 'lectura'],
    'útiles': ['utiles', 'útil', 'util', 'cuaderno', 'lápiz', 'lapiz', 'mochila'],
    'deporte': ['deportes', 'deportivo', 'pelota', 'raqueta'],
    'tecnología': ['tecnologia', 'calculadora', 'tablet', 'computador'],
  }

  Object.entries(categoryAliases).forEach(([category, aliases]) => {
    if (aliases.some(alias => searchLower.includes(alias))) {
      variants.push(category)
    }
  })

  return [...new Set(variants)]
}

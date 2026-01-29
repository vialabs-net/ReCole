import { describe, it, expect } from 'vitest'
import { normalizeGradeSearch, normalizeCategorySearch } from './search-helpers'

describe('normalizeGradeSearch', () => {
  it('returns original search term', () => {
    const result = normalizeGradeSearch('5 basico')
    expect(result).toContain('5 basico')
  })

  it('generates variants for numeric grades', () => {
    const result = normalizeGradeSearch('5 basico')
    expect(result).toContain('5° básico')
    expect(result).toContain('5 básico')
    expect(result).toContain('5°básico')
  })

  it('generates word variants for numeric grades', () => {
    const result = normalizeGradeSearch('5 basico')
    expect(result).toContain('quinto básico')
  })

  it('generates numeric variants for word grades', () => {
    const result = normalizeGradeSearch('quinto basico')
    expect(result).toContain('5° básico')
    expect(result).toContain('5 básico')
  })

  it('handles medio levels', () => {
    const result = normalizeGradeSearch('2 medio')
    expect(result).toContain('2° medio')
    expect(result).toContain('2 medio')
    expect(result).toContain('segundo medio')
  })

  it('handles kinder variants', () => {
    const result = normalizeGradeSearch('kinder')
    expect(result).toContain('kínder')
    expect(result).toContain('kinder')
  })

  it('handles prekinder variants', () => {
    const result = normalizeGradeSearch('prekinder')
    expect(result).toContain('prekínder')
    expect(result).toContain('prekinder')
  })

  it('handles playgroup', () => {
    const result = normalizeGradeSearch('playgroup')
    expect(result).toContain('playgroup menor')
    expect(result).toContain('playgroup mayor')
  })

  it('removes duplicate variants', () => {
    const result = normalizeGradeSearch('5 basico')
    const unique = new Set(result)
    expect(result.length).toBe(unique.size)
  })

  it('handles special characters in grades', () => {
    const result = normalizeGradeSearch('7° básico')
    expect(result.length).toBeGreaterThan(0)
  })

  it('handles edge case - empty string', () => {
    const result = normalizeGradeSearch('')
    expect(result).toContain('')
  })
})

describe('normalizeCategorySearch', () => {
  it('returns original search term', () => {
    const result = normalizeCategorySearch('polera')
    expect(result).toContain('polera')
  })

  it('maps clothing terms to uniforme', () => {
    expect(normalizeCategorySearch('polera')).toContain('uniforme')
    expect(normalizeCategorySearch('pantalon')).toContain('uniforme')
    expect(normalizeCategorySearch('camisa')).toContain('uniforme')
    expect(normalizeCategorySearch('falda')).toContain('uniforme')
    expect(normalizeCategorySearch('buzo')).toContain('uniforme')
  })

  it('maps book terms to libro', () => {
    expect(normalizeCategorySearch('textos')).toContain('libro')
    expect(normalizeCategorySearch('lectura')).toContain('libro')
  })

  it('maps school supply terms to útiles', () => {
    expect(normalizeCategorySearch('cuaderno')).toContain('útiles')
    expect(normalizeCategorySearch('lapiz')).toContain('útiles')
    expect(normalizeCategorySearch('mochila')).toContain('útiles')
  })

  it('maps sports terms to deporte', () => {
    expect(normalizeCategorySearch('pelota')).toContain('deporte')
    expect(normalizeCategorySearch('raqueta')).toContain('deporte')
    expect(normalizeCategorySearch('deportivo')).toContain('deporte')
  })

  it('maps tech terms to tecnología', () => {
    expect(normalizeCategorySearch('calculadora')).toContain('tecnología')
    expect(normalizeCategorySearch('tablet')).toContain('tecnología')
  })

  it('removes duplicate variants', () => {
    const result = normalizeCategorySearch('polera')
    const unique = new Set(result)
    expect(result.length).toBe(unique.size)
  })

  it('handles terms not in aliases', () => {
    const result = normalizeCategorySearch('otro')
    expect(result).toEqual(['otro'])
  })

  it('is case insensitive', () => {
    expect(normalizeCategorySearch('POLERA')).toContain('uniforme')
    expect(normalizeCategorySearch('Polera')).toContain('uniforme')
  })
})

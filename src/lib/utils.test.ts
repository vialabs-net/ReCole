import { describe, it, expect } from 'vitest'
import { cn, formatPrice, formatPhone } from './utils'

describe('cn', () => {
  it('merges class names', () => {
    expect(cn('foo', 'bar')).toBe('foo bar')
  })

  it('handles conditional classes', () => {
    expect(cn('base', true && 'included', false && 'excluded')).toBe('base included')
  })

  it('merges tailwind classes correctly', () => {
    // Same property with different values - later wins
    expect(cn('p-4', 'p-8')).toBe('p-8')
    expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500')
  })

  it('handles undefined and null values', () => {
    expect(cn('base', undefined, null, 'extra')).toBe('base extra')
  })

  it('handles arrays of classes', () => {
    expect(cn(['foo', 'bar'])).toBe('foo bar')
  })

  it('handles objects with boolean values', () => {
    expect(cn({ foo: true, bar: false, baz: true })).toBe('foo baz')
  })
})

describe('formatPrice', () => {
  it('formats price in CLP', () => {
    expect(formatPrice(500000)).toBe('$5.000')
    expect(formatPrice(1000000)).toBe('$10.000')
    expect(formatPrice(100)).toBe('$1')
  })

  it('handles zero', () => {
    expect(formatPrice(0)).toBe('$0')
  })

  it('rounds to whole numbers', () => {
    expect(formatPrice(50)).toBe('$1')
  })

  it('uses CLP as default currency', () => {
    const result = formatPrice(500000)
    expect(result).toBe('$5.000')
  })

  it('supports USD currency', () => {
    const result = formatPrice(500000, 'USD')
    expect(result).toContain('5.000')
    expect(result).toContain('US$')
  })
})

describe('formatPhone', () => {
  it('formats Chilean phone numbers', () => {
    expect(formatPhone('+56912345678')).toBe('+56 9 1234 5678')
    expect(formatPhone('+56987654321')).toBe('+56 9 8765 4321')
  })

  it('returns non-Chilean phones unchanged', () => {
    expect(formatPhone('+1234567890')).toBe('+1234567890')
    expect(formatPhone('12345678')).toBe('12345678')
  })

  it('handles edge cases', () => {
    expect(formatPhone('')).toBe('')
    expect(formatPhone('+56')).toBe('+56')
  })
})

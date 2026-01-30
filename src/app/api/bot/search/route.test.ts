import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

// Mock Prisma
const mockFindMany = vi.fn()
vi.mock('@/lib/prisma', () => ({
  prisma: {
    listing: {
      findMany: mockFindMany,
    },
  },
}))

const mockListing = {
  id: 'listing-1',
  title: 'Polera Colegio Test',
  price: 500000,
  condition: 'like_new',
  size: '8',
  quantityAvailable: 2,
  school: { name: 'Colegio Test', slug: 'colegio-test' },
  grade: { name: '3° Básico' },
  category: { name: 'Uniformes' },
  seller: { name: 'Juan Pérez', phone: '+56912345678' },
  images: [{ blobUrl: 'https://example.com/image.jpg' }],
}

const API_KEY = 'test-api-key'

// Helper to create authenticated request
function createAuthRequest(url: string) {
  return new NextRequest(new URL(url, 'http://localhost'), {
    headers: { authorization: `Bearer ${API_KEY}` },
  })
}

describe('GET /api/bot/search', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.resetModules()
    vi.unstubAllEnvs()
    // Always set API key since endpoint now requires it
    vi.stubEnv('BOT_API_KEY', API_KEY)
  })

  async function importRoute() {
    const routeModule = await import('./route')
    return routeModule.GET
  }

  describe('authentication', () => {
    it('returns 500 when API key is not configured', async () => {
      vi.unstubAllEnvs() // Remove API key

      const GET = await importRoute()
      const request = new NextRequest(new URL('/api/bot/search?q=polera', 'http://localhost'))
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe('API no configurada')
    })

    it('returns 401 without authorization header', async () => {
      const GET = await importRoute()
      const request = new NextRequest(new URL('/api/bot/search?q=polera', 'http://localhost'))
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('No autorizado')
    })

    it('returns 401 with invalid token', async () => {
      const GET = await importRoute()
      const request = new NextRequest(
        new URL('/api/bot/search?q=polera', 'http://localhost'),
        { headers: { authorization: 'Bearer wrong-key' } }
      )
      const response = await GET(request)

      expect(response.status).toBe(401)
    })

    it('returns results with valid token', async () => {
      mockFindMany.mockResolvedValue([mockListing])

      const GET = await importRoute()
      const request = createAuthRequest('/api/bot/search?q=polera')
      const response = await GET(request)

      expect(response.status).toBe(200)
    })
  })

  describe('input validation', () => {
    it('returns 400 when query param is missing', async () => {
      const GET = await importRoute()
      const request = createAuthRequest('/api/bot/search')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toContain('requerido')
    })

    it('returns 400 when query is too short', async () => {
      const GET = await importRoute()
      const request = createAuthRequest('/api/bot/search?q=a')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toContain('mínimo 2 caracteres')
    })

    it('returns 400 when query is too long', async () => {
      const longQuery = 'a'.repeat(101)
      const GET = await importRoute()
      const request = createAuthRequest(`/api/bot/search?q=${longQuery}`)
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toContain('demasiado largo')
    })

    it('returns 400 when school name is too long', async () => {
      const longSchool = 'a'.repeat(101)
      const GET = await importRoute()
      const request = createAuthRequest(`/api/bot/search?q=polera&school=${longSchool}`)
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toContain('colegio demasiado largo')
    })

    it('returns 400 when size is too long', async () => {
      const longSize = 'a'.repeat(21)
      const GET = await importRoute()
      const request = createAuthRequest(`/api/bot/search?q=polera&size=${longSize}`)
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toContain('Talla inválida')
    })
  })

  describe('search functionality', () => {
    it('returns results when query is valid', async () => {
      mockFindMany.mockResolvedValue([mockListing])
      vi.stubEnv('APP_URL', 'https://recole.cl')

      const GET = await importRoute()
      const request = createAuthRequest('/api/bot/search?q=polera')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.query).toBe('polera')
      expect(data.count).toBe(1)
      expect(data.results[0].title).toBe('Polera Colegio Test')
      expect(data.results[0].price).toBe('$5.000')
      expect(data.results[0].seller).toBe('Juan Pérez')
      expect(data.results[0].phone_hint).toBe('****5678')
      expect(data.results[0].whatsapp).toContain('wa.me/56912345678')
    })

    it('returns empty results when no matches', async () => {
      mockFindMany.mockResolvedValue([])

      const GET = await importRoute()
      const request = createAuthRequest('/api/bot/search?q=inexistente')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.count).toBe(0)
      expect(data.results).toEqual([])
    })

    it('respects limit parameter', async () => {
      mockFindMany.mockResolvedValue([mockListing])

      const GET = await importRoute()
      const request = createAuthRequest('/api/bot/search?q=polera&limit=3')
      await GET(request)

      expect(mockFindMany).toHaveBeenCalledWith(
        expect.objectContaining({ take: 3 })
      )
    })

    it('caps limit at 10', async () => {
      mockFindMany.mockResolvedValue([])

      const GET = await importRoute()
      const request = createAuthRequest('/api/bot/search?q=polera&limit=100')
      await GET(request)

      expect(mockFindMany).toHaveBeenCalledWith(
        expect.objectContaining({ take: 10 })
      )
    })

    it('handles invalid limit gracefully', async () => {
      mockFindMany.mockResolvedValue([])

      const GET = await importRoute()
      const request = createAuthRequest('/api/bot/search?q=polera&limit=abc')
      await GET(request)

      expect(mockFindMany).toHaveBeenCalledWith(
        expect.objectContaining({ take: 5 })
      )
    })

    it('filters by school when provided', async () => {
      mockFindMany.mockResolvedValue([])

      const GET = await importRoute()
      const request = createAuthRequest('/api/bot/search?q=uniforme&school=san+jose')
      await GET(request)

      expect(mockFindMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            school: { name: { contains: 'san jose', mode: 'insensitive' } },
          }),
        })
      )
    })

    it('filters by size when provided', async () => {
      mockFindMany.mockResolvedValue([])

      const GET = await importRoute()
      const request = createAuthRequest('/api/bot/search?q=uniforme&size=8')
      await GET(request)

      expect(mockFindMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            size: { equals: '8', mode: 'insensitive' },
          }),
        })
      )
    })

    it('returns 500 on database error', async () => {
      mockFindMany.mockRejectedValue(new Error('DB error'))

      const GET = await importRoute()
      const request = createAuthRequest('/api/bot/search?q=polera')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe('Error en búsqueda')
    })
  })
})

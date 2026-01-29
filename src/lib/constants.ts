/**
 * Centralized constants for ReCole application
 */

// Condition labels for listings (used in multiple components)
export const CONDITION_LABELS: Record<string, string> = {
  new: 'Nuevo',
  like_new: 'Como Nuevo',
  good: 'Bueno',
  fair: 'Aceptable',
}

// Blur placeholder for lazy-loaded images
export const BLUR_DATA_URL =
  'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAUH/8QAIhAAAgEDAwUBAAAAAAAAAAAAAQIDAAQRBSExEhMiQVFh/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAZEQACAwEAAAAAAAAAAAAAAAABAgADESH/2gAMAwEAAhEDEQA/AJmm3V1Bc3KXc0k6d0kLI5YDAGBvgb5PlWrqKSilBOxiT9Soq1K6jMqeP//Z'

// Listing limits
export const LISTING_LIMITS = {
  MAX_IMAGES: 5,
  MAX_IMAGE_SIZE_MB: 1,
  MAX_IMAGE_RESOLUTION: 1920,
  ITEMS_PER_PAGE: 24,
} as const

// Bot API limits
export const BOT_API_LIMITS = {
  MIN_QUERY_LENGTH: 2,
  DEFAULT_LIMIT: 5,
  MAX_LIMIT: 10,
} as const

// Phone validation regex (Chile format: +569XXXXXXXX)
export const PHONE_REGEX = /^\+569\d{8}$/

// Currency formatting
export const DEFAULT_CURRENCY = 'CLP'

// Image placeholder
export const PLACEHOLDER_IMAGE = '/placeholder-product.png'

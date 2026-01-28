import { put, del, list } from '@vercel/blob'

export interface UploadImageResult {
  url: string
  pathname: string
}

/**
 * Upload an image file to Vercel Blob storage
 * @param file File to upload
 * @param pathname Optional custom pathname
 * @returns Object with url and pathname
 */
export async function uploadImage(
  file: File,
  pathname?: string
): Promise<UploadImageResult> {
  const blob = await put(pathname || file.name, file, {
    access: 'public',
    addRandomSuffix: true,
  })

  return {
    url: blob.url,
    pathname: blob.pathname,
  }
}

/**
 * Upload multiple images to Vercel Blob storage
 * @param files Array of files to upload
 * @param prefix Optional prefix for all files
 * @returns Array of upload results
 */
export async function uploadImages(
  files: File[],
  prefix?: string
): Promise<UploadImageResult[]> {
  const uploadPromises = files.map((file, index) => {
    const pathname = prefix
      ? `${prefix}/${index}-${file.name}`
      : `${index}-${file.name}`

    return uploadImage(file, pathname)
  })

  return Promise.all(uploadPromises)
}

/**
 * Delete an image from Vercel Blob storage
 * @param url URL of the image to delete
 */
export async function deleteImage(url: string): Promise<void> {
  await del(url)
}

/**
 * Delete multiple images from Vercel Blob storage
 * @param urls Array of image URLs to delete
 */
export async function deleteImages(urls: string[]): Promise<void> {
  await Promise.all(urls.map(url => del(url)))
}

/**
 * List all blobs with optional prefix
 * @param prefix Optional prefix to filter by
 */
export async function listImages(prefix?: string) {
  return list({ prefix })
}

/**
 * Validate image file before upload
 * - Max size: 5MB
 * - Allowed types: JPEG, PNG, WebP
 * @param file File to validate
 * @throws Error if validation fails
 */
export function validateImageFile(file: File): void {
  const maxSize = 5 * 1024 * 1024 // 5MB
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']

  if (file.size > maxSize) {
    throw new Error(`File size must be less than 5MB. Current size: ${(file.size / 1024 / 1024).toFixed(2)}MB`)
  }

  if (!allowedTypes.includes(file.type)) {
    throw new Error(`File type must be JPEG, PNG, or WebP. Current type: ${file.type}`)
  }
}

/**
 * Validate multiple image files
 * @param files Files to validate
 * @throws Error if any validation fails
 */
export function validateImageFiles(files: File[]): void {
  if (files.length === 0) {
    throw new Error('At least one image is required')
  }

  if (files.length > 10) {
    throw new Error('Maximum 10 images allowed')
  }

  files.forEach((file, index) => {
    try {
      validateImageFile(file)
    } catch (error) {
      throw new Error(`File ${index + 1}: ${error instanceof Error ? error.message : 'Invalid file'}`)
    }
  })
}

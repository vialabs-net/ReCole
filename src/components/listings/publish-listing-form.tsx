'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Upload, X, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { createListing, getGradesBySchool } from '@/app/actions/listings'
import { upload } from '@vercel/blob/client'
import imageCompression from 'browser-image-compression'

interface PublishListingFormProps {
  schools: Array<{ id: string; name: string; slug: string }>
  categories: Array<{ id: string; name: string; slug: string }>
  sellerId: string
}

const CONDITION_OPTIONS = [
  { value: 'new', label: 'Nuevo' },
  { value: 'like_new', label: 'Como Nuevo' },
  { value: 'good', label: 'Bueno' },
  { value: 'fair', label: 'Aceptable' },
]

export function PublishListingForm({ schools, categories, sellerId }: PublishListingFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Form state
  const [schoolId, setSchoolId] = useState('')
  const [gradeId, setGradeId] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [condition, setCondition] = useState('')
  const [size, setSize] = useState('')
  const [quantity, setQuantity] = useState('1')
  const [images, setImages] = useState<Array<{ file: File; preview: string }>>([])
  const [uploadingImages, setUploadingImages] = useState(false)

  // Grades for selected school
  const [grades, setGrades] = useState<Array<{ id: string; name: string }>>([])
  const [loadingGrades, setLoadingGrades] = useState(false)

  // Load grades when school changes
  useEffect(() => {
    if (schoolId) {
      setLoadingGrades(true)
      setGradeId('')
      getGradesBySchool(schoolId)
        .then((grades) => setGrades(grades))
        .finally(() => setLoadingGrades(false))
    } else {
      setGrades([])
    }
  }, [schoolId])

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    // Limit to 5 images total
    if (images.length + files.length > 5) {
      setErrors({ ...errors, images: 'Máximo 5 imágenes permitidas' })
      return
    }

    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }))

    setImages([...images, ...newImages])
    setErrors({ ...errors, images: '' })
  }

  const removeImage = (index: number) => {
    const newImages = [...images]
    URL.revokeObjectURL(newImages[index].preview)
    newImages.splice(index, 1)
    setImages(newImages)
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!schoolId) newErrors.schoolId = 'Selecciona un colegio'
    if (!gradeId) newErrors.gradeId = 'Selecciona un nivel'
    if (!categoryId) newErrors.categoryId = 'Selecciona una categoría'
    if (!title.trim()) newErrors.title = 'El título es requerido'
    if (title.length > 100) newErrors.title = 'Máximo 100 caracteres'
    if (!description.trim()) newErrors.description = 'La descripción es requerida'
    if (description.length > 1000) newErrors.description = 'Máximo 1000 caracteres'
    if (!price || parseFloat(price) <= 0) newErrors.price = 'El precio debe ser mayor a 0'
    if (!condition) newErrors.condition = 'Selecciona el estado'
    if (!quantity || parseInt(quantity) <= 0) newErrors.quantity = 'La cantidad debe ser mayor a 0'
    if (images.length === 0) newErrors.images = 'Debes agregar al menos una imagen'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) return

    try {
      setIsSubmitting(true)
      setUploadingImages(true)

      // Compress and upload images
      const uploadedImages = await Promise.all(
        images.map(async (img, index) => {
          // Compress image
          const options = {
            maxSizeMB: 1,
            maxWidthOrHeight: 1920,
            useWebWorker: true,
          }
          const compressedFile = await imageCompression(img.file, options)

          // Upload to Vercel Blob
          const blob = await upload(compressedFile.name, compressedFile, {
            access: 'public',
            handleUploadUrl: '/api/upload',
          })

          return {
            blobUrl: blob.url,
            order: index,
          }
        })
      )

      setUploadingImages(false)

      // Create listing
      const listing = await createListing({
        schoolId,
        gradeId,
        categoryId,
        title: title.trim(),
        description: description.trim(),
        price: parseFloat(price),
        currency: 'CLP',
        condition,
        size: size.trim() || undefined,
        quantityAvailable: parseInt(quantity),
        images: uploadedImages,
      })

      // Redirect to listing
      router.push(`/listing/${listing.id}`)
    } catch (error) {
      console.error('Error creating listing:', error)
      setErrors({
        submit: error instanceof Error ? error.message : 'Error al crear la publicación',
      })
      setIsSubmitting(false)
      setUploadingImages(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* School Selection */}
      <div>
        <Label htmlFor="school">Colegio *</Label>
        <Select value={schoolId} onValueChange={setSchoolId} disabled={isSubmitting}>
          <SelectTrigger id="school" className={errors.schoolId ? 'border-destructive' : ''}>
            <SelectValue placeholder="Selecciona un colegio" />
          </SelectTrigger>
          <SelectContent>
            {schools.map((school) => (
              <SelectItem key={school.id} value={school.id}>
                {school.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.schoolId && <p className="text-sm text-destructive mt-1">{errors.schoolId}</p>}
      </div>

      {/* Grade Selection */}
      <div>
        <Label htmlFor="grade">Nivel *</Label>
        <Select
          value={gradeId}
          onValueChange={setGradeId}
          disabled={isSubmitting || !schoolId || loadingGrades}
        >
          <SelectTrigger id="grade" className={errors.gradeId ? 'border-destructive' : ''}>
            <SelectValue placeholder={loadingGrades ? 'Cargando...' : 'Selecciona un nivel'} />
          </SelectTrigger>
          <SelectContent>
            {grades.map((grade) => (
              <SelectItem key={grade.id} value={grade.id}>
                {grade.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.gradeId && <p className="text-sm text-destructive mt-1">{errors.gradeId}</p>}
      </div>

      {/* Category Selection */}
      <div>
        <Label htmlFor="category">Categoría *</Label>
        <Select value={categoryId} onValueChange={setCategoryId} disabled={isSubmitting}>
          <SelectTrigger id="category" className={errors.categoryId ? 'border-destructive' : ''}>
            <SelectValue placeholder="Selecciona una categoría" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.categoryId && (
          <p className="text-sm text-destructive mt-1">{errors.categoryId}</p>
        )}
      </div>

      {/* Title */}
      <div>
        <Label htmlFor="title">Título *</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ej: Polera uniforme Lincoln talla 10"
          disabled={isSubmitting}
          className={errors.title ? 'border-destructive' : ''}
          maxLength={100}
        />
        <p className="text-xs text-muted-foreground mt-1">{title.length}/100 caracteres</p>
        {errors.title && <p className="text-sm text-destructive mt-1">{errors.title}</p>}
      </div>

      {/* Description */}
      <div>
        <Label htmlFor="description">Descripción *</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe el estado del artículo, detalles importantes, etc."
          disabled={isSubmitting}
          className={errors.description ? 'border-destructive' : ''}
          rows={4}
          maxLength={1000}
        />
        <p className="text-xs text-muted-foreground mt-1">{description.length}/1000 caracteres</p>
        {errors.description && (
          <p className="text-sm text-destructive mt-1">{errors.description}</p>
        )}
      </div>

      {/* Price and Quantity Row */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="price">Precio (CLP) *</Label>
          <Input
            id="price"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="15000"
            disabled={isSubmitting}
            className={errors.price ? 'border-destructive' : ''}
            min="0"
            step="100"
          />
          {errors.price && <p className="text-sm text-destructive mt-1">{errors.price}</p>}
        </div>

        <div>
          <Label htmlFor="quantity">Cantidad *</Label>
          <Input
            id="quantity"
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="1"
            disabled={isSubmitting}
            className={errors.quantity ? 'border-destructive' : ''}
            min="1"
          />
          {errors.quantity && <p className="text-sm text-destructive mt-1">{errors.quantity}</p>}
        </div>
      </div>

      {/* Condition and Size Row */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="condition">Estado *</Label>
          <Select value={condition} onValueChange={setCondition} disabled={isSubmitting}>
            <SelectTrigger id="condition" className={errors.condition ? 'border-destructive' : ''}>
              <SelectValue placeholder="Selecciona el estado" />
            </SelectTrigger>
            <SelectContent>
              {CONDITION_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.condition && (
            <p className="text-sm text-destructive mt-1">{errors.condition}</p>
          )}
        </div>

        <div>
          <Label htmlFor="size">Talla (opcional)</Label>
          <Input
            id="size"
            value={size}
            onChange={(e) => setSize(e.target.value)}
            placeholder="Ej: 10, M, L"
            disabled={isSubmitting}
            maxLength={10}
          />
          <p className="text-xs text-muted-foreground mt-1">Para uniformes, calzado, etc.</p>
        </div>
      </div>

      {/* Images */}
      <div>
        <Label>Imágenes * (máx. 5)</Label>
        <div className="mt-2 space-y-4">
          {/* Image Previews */}
          {images.length > 0 && (
            <div className="grid grid-cols-3 gap-4">
              {images.map((img, index) => (
                <div key={index} className="relative aspect-square">
                  <img
                    src={img.preview}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-6 w-6"
                    onClick={() => removeImage(index)}
                    disabled={isSubmitting}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  {index === 0 && (
                    <span className="absolute bottom-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                      Principal
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Upload Button */}
          {images.length < 5 && (
            <div>
              <Input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageSelect}
                disabled={isSubmitting}
                className="hidden"
                id="image-upload"
              />
              <Label
                htmlFor="image-upload"
                className="flex items-center justify-center h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition"
              >
                <div className="text-center">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Haz clic para seleccionar imágenes
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {images.length}/5 imágenes
                  </p>
                </div>
              </Label>
            </div>
          )}
        </div>
        {errors.images && <p className="text-sm text-destructive mt-1">{errors.images}</p>}
      </div>

      {/* Submit Error */}
      {errors.submit && (
        <div className="p-4 bg-destructive/10 border border-destructive rounded-lg">
          <p className="text-sm text-destructive">{errors.submit}</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <Button type="submit" disabled={isSubmitting} className="flex-1">
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              {uploadingImages ? 'Subiendo imágenes...' : 'Publicando...'}
            </>
          ) : (
            'Publicar Artículo'
          )}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isSubmitting}
        >
          Cancelar
        </Button>
      </div>
    </form>
  )
}

import type { PhotoRecord } from './api'

const KEEP_EDGE = 4096
const KEEP_BYTES = 30_000_000
const DERIVATIVE_BYTES = 8_000_000

export type PreparedPhoto = {
  name: string
  width: number
  height: number
  originalType: PhotoRecord['originalType']
  original: Blob
  display: Blob
  thumb: Blob
}

function knownType(type: string): type is PhotoRecord['originalType'] {
  return type === 'image/jpeg' || type === 'image/png' || type === 'image/webp'
}

async function encode(bitmap: ImageBitmap, maxEdge: number, quality: number): Promise<Blob> {
  const scale = Math.min(1, maxEdge / Math.max(bitmap.width, bitmap.height))
  const width = Math.max(1, Math.round(bitmap.width * scale))
  const height = Math.max(1, Math.round(bitmap.height * scale))
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const context = canvas.getContext('2d')
  if (!context) throw new Error('This browser could not prepare that photograph.')
  context.drawImage(bitmap, 0, 0, width, height)
  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob((result) => resolve(result), 'image/jpeg', quality)
  })
  if (!blob) throw new Error('This browser could not prepare that photograph.')
  return blob
}

async function jpegUnder(bitmap: ImageBitmap, maxEdge: number, quality: number): Promise<Blob> {
  let q = quality
  let blob = await encode(bitmap, maxEdge, q)
  while (blob.size > DERIVATIVE_BYTES && q > 0.5) {
    q = Math.round((q - 0.08) * 100) / 100
    blob = await encode(bitmap, maxEdge, q)
  }
  if (blob.size > DERIVATIVE_BYTES) throw new Error('That photograph is too large to store.')
  return blob
}

export async function preparePhoto(file: File): Promise<PreparedPhoto> {
  if (file.size > KEEP_BYTES) {
    throw new Error('That photograph is larger than 30 MB. Export a smaller file and try again.')
  }
  const typed = knownType(file.type) ? file.type : null
  const looksSupported = typed !== null || /\.(jpe?g|png|webp)$/i.test(file.name)
  if (!looksSupported) {
    throw new Error('This browser could not read that file. Use a JPEG, PNG, or WebP.')
  }

  let bitmap: ImageBitmap
  try {
    bitmap = await createImageBitmap(file)
  } catch {
    throw new Error('This browser could not read that file. Use a JPEG, PNG, or WebP.')
  }

  try {
    const longEdge = Math.max(bitmap.width, bitmap.height)
    const keep = typed !== null && file.size <= KEEP_BYTES && longEdge <= KEEP_EDGE
    const original = keep ? file : await jpegUnder(bitmap, KEEP_EDGE, 0.9)
    if (original.size > KEEP_BYTES) {
      throw new Error('That photograph is too large to store.')
    }
    const [display, thumb] = await Promise.all([
      jpegUnder(bitmap, 2000, 0.82),
      jpegUnder(bitmap, 900, 0.74),
    ])
    return {
      name: file.name || 'photograph',
      width: bitmap.width,
      height: bitmap.height,
      originalType: keep && typed ? typed : 'image/jpeg',
      original,
      display,
      thumb,
    }
  } finally {
    bitmap.close()
  }
}

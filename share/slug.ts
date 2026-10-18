const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

export function isSlug(value: string): boolean {
  return value.length >= 2 && value.length <= 64 && value !== 'admin' && SLUG_RE.test(value)
}

export function slugify(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48)
}

export function isPhotoId(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value)
}

export function safeFilename(name: string): string {
  const cleaned = name.replace(/[/\\?%*:|"<>]/g, ' ').replace(/\s+/g, ' ').trim()
  return (cleaned || 'photograph').slice(0, 80)
}

export function extForType(type: string): 'jpg' | 'png' | 'webp' | null {
  if (type === 'image/jpeg') return 'jpg'
  if (type === 'image/png') return 'png'
  if (type === 'image/webp') return 'webp'
  return null
}

export function typeForExt(ext: string): PhotoContentType | null {
  if (ext === 'jpg' || ext === 'jpeg') return 'image/jpeg'
  if (ext === 'png') return 'image/png'
  if (ext === 'webp') return 'image/webp'
  return null
}

export type PhotoContentType = 'image/jpeg' | 'image/png' | 'image/webp'

export function downloadName(name: string, ext: 'jpg' | 'png' | 'webp'): string {
  const base = safeFilename(name).replace(/\.(jpe?g|png|webp|heic|heif)$/i, '')
  return `${base || 'photograph'}.${ext}`
}

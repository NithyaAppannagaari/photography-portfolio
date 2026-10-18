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

export function privateSuffix(): string {
  const alphabet = 'abcdefghijkmnopqrstuvwxyz23456789'
  const bytes = crypto.getRandomValues(new Uint8Array(4))
  return Array.from(bytes, (byte) => alphabet[byte % alphabet.length]).join('')
}

export function suggestSlug(title: string): string {
  const base = slugify(title)
  const suffix = privateSuffix()
  return (base ? `${base}-${suffix}` : `album-${suffix}`).slice(0, 64)
}

export function fileName(name: string, ext: 'jpg' | 'png' | 'webp'): string {
  const base = name
    .replace(/\.(jpe?g|png|webp|heic|heif)$/i, '')
    .replace(/[/\\?%*:|"<>]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 80)
  return `${base || 'photograph'}.${ext}`
}

export function extForType(type: string): 'jpg' | 'png' | 'webp' {
  if (type === 'image/png') return 'png'
  if (type === 'image/webp') return 'webp'
  return 'jpg'
}

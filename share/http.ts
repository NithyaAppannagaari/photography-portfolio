import { deleteAlbum, listAlbums, readAlbum, writeAlbum } from './albums.ts'
import { withLock } from './lock.ts'
import { downloadName, extForType, isPhotoId, isSlug, safeFilename } from './slug.ts'
import type { Album, PhotoRecord, ShareStore } from './types.ts'

const MAX_ORIGINAL = 30_000_000
const MAX_DERIVATIVE = 8_000_000
const loginFails = new Map<string, { count: number; reset: number }>()

export type ShareOptions = {
  password: string
  ip: string
}

function json(body: unknown, status = 200, extra?: HeadersInit): Response {
  const headers = new Headers(extra)
  headers.set('content-type', 'application/json; charset=utf-8')
  headers.set('cache-control', 'no-store')
  return new Response(JSON.stringify(body), { status, headers })
}

function safeEqual(a: string, b: string): boolean {
  const enc = new TextEncoder()
  const left = enc.encode(a)
  const right = enc.encode(b)
  const len = Math.max(left.length, right.length)
  let diff = left.length ^ right.length
  for (let i = 0; i < len; i += 1) diff |= (left[i] ?? 0) ^ (right[i] ?? 0)
  return diff === 0
}

function authorized(request: Request, password: string): boolean {
  if (!password) return false
  const header = request.headers.get('authorization') ?? ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : ''
  return safeEqual(token, password)
}

function limited(ip: string): boolean {
  const row = loginFails.get(ip)
  if (!row || row.reset < Date.now()) return false
  return row.count >= 8
}

function recordFailure(ip: string): void {
  const now = Date.now()
  const row = loginFails.get(ip)
  if (!row || row.reset < now) {
    loginFails.set(ip, { count: 1, reset: now + 10 * 60 * 1000 })
    return
  }
  row.count += 1
}

function clearFailures(ip: string): void {
  loginFails.delete(ip)
}

async function readFile(value: FormDataEntryValue | null, max: number): Promise<Uint8Array | Response> {
  if (!(value instanceof File)) return json({ error: 'Choose a photograph to upload.' }, 400)
  if (value.size > max) return json({ error: 'That photograph is too large to store.' }, 413)
  return new Uint8Array(await value.arrayBuffer())
}

function photoExt(photo: PhotoRecord): 'jpg' | 'png' | 'webp' {
  return extForType(photo.originalType) ?? 'jpg'
}

export async function handleShare(request: Request, store: ShareStore, options: ShareOptions): Promise<Response> {
  const url = new URL(request.url)
  const parts = url.pathname.split('/').filter(Boolean)
  if (parts[0] !== 'api' || parts[1] !== 'share') {
    return json({ error: 'Not found.' }, 404)
  }

  if (request.method === 'POST' && parts.length === 3 && parts[2] === 'login') {
    if (!options.password) {
      return json({ error: 'Set SHARE_ADMIN_PASSWORD before opening the album desk.' }, 503)
    }
    if (limited(options.ip)) return json({ error: 'Too many attempts. Wait a few minutes and try again.' }, 429)
    let body: unknown
    try { body = await request.json() } catch { return json({ error: 'Send a password.' }, 400) }
    const password = body && typeof body === 'object' && 'password' in body ? String((body as { password: unknown }).password) : ''
    if (!safeEqual(password, options.password)) {
      recordFailure(options.ip)
      return json({ error: 'That password does not match.' }, 401)
    }
    clearFailures(options.ip)
    return json({ ok: true })
  }

  if (parts[2] === 'albums' && parts.length === 3 && request.method === 'GET') {
    if (!authorized(request, options.password)) return json({ error: 'Unlock the album desk first.' }, 401)
    return json({ albums: await listAlbums(store) })
  }

  if (parts[2] === 'albums' && parts.length === 3 && request.method === 'POST') {
    if (!options.password) return json({ error: 'Set SHARE_ADMIN_PASSWORD before creating an album.' }, 503)
    if (!authorized(request, options.password)) return json({ error: 'Unlock the album desk first.' }, 401)
    let body: unknown
    try { body = await request.json() } catch { return json({ error: 'Send an album title.' }, 400) }
    const record = body && typeof body === 'object' ? body as { slug?: unknown; title?: unknown; note?: unknown } : {}
    const slug = String(record.slug ?? '')
    const title = String(record.title ?? '').trim()
    const note = String(record.note ?? '').trim()
    if (!isSlug(slug)) return json({ error: 'Use a link name of letters, numbers, and hyphens.' }, 400)
    if (!title || title.length > 120) return json({ error: 'Give the album a title.' }, 400)
    if (note.length > 2000) return json({ error: 'The note is too long.' }, 400)
    const created = await withLock(slug, async () => {
      if (await readAlbum(store, slug)) return null
      const album: Album = { slug, title, note, createdAt: new Date().toISOString(), photos: [] }
      await writeAlbum(store, album)
      return album
    })
    if (!created) return json({ error: 'An album with that link already exists.' }, 409)
    return json({ album: created }, 201)
  }

  const slug = parts[3] ?? ''
  if (!isSlug(slug)) return json({ error: 'Not found.' }, 404)

  if (parts.length === 4 && request.method === 'GET') {
    const album = await readAlbum(store, slug)
    if (!album) return json({ error: 'This link does not match an album.' }, 404)
    return json({ album })
  }

  if (parts.length === 4 && request.method === 'PATCH') {
    if (!authorized(request, options.password)) return json({ error: 'Unlock the album desk first.' }, 401)
    let body: unknown
    try { body = await request.json() } catch { return json({ error: 'Send the album details.' }, 400) }
    const record = body && typeof body === 'object' ? body as { title?: unknown; note?: unknown } : {}
    const updated = await withLock(slug, async () => {
      const album = await readAlbum(store, slug)
      if (!album) return undefined
      if (record.title !== undefined) {
        const title = String(record.title).trim()
        if (!title || title.length > 120) return null
        album.title = title
      }
      if (record.note !== undefined) {
        const note = String(record.note).trim()
        if (note.length > 2000) return null
        album.note = note
      }
      await writeAlbum(store, album)
      return album
    })
    if (updated === undefined) return json({ error: 'This link does not match an album.' }, 404)
    if (updated === null) return json({ error: 'Check the title and note.' }, 400)
    return json({ album: updated })
  }

  if (parts.length === 4 && request.method === 'DELETE') {
    if (!authorized(request, options.password)) return json({ error: 'Unlock the album desk first.' }, 401)
    await withLock(slug, async () => { await deleteAlbum(store, slug) })
    return json({ ok: true })
  }

  if (parts[4] === 'photos' && parts.length === 5 && request.method === 'POST') {
    if (!authorized(request, options.password)) return json({ error: 'Unlock the album desk first.' }, 401)
    let form: FormData
    try { form = await request.formData() } catch { return json({ error: 'Send the photograph as a file upload.' }, 400) }
    const name = safeFilename(String(form.get('name') ?? 'photograph'))
    const width = Number(form.get('width'))
    const height = Number(form.get('height'))
    const originalType = String(form.get('originalType') ?? '')
    const ext = extForType(originalType)
    if (!ext || !Number.isFinite(width) || !Number.isFinite(height) || width < 1 || height < 1) {
      return json({ error: 'This photograph could not be prepared.' }, 400)
    }
    const original = await readFile(form.get('original'), MAX_ORIGINAL)
    if (original instanceof Response) return original
    const display = await readFile(form.get('display'), MAX_DERIVATIVE)
    if (display instanceof Response) return display
    const thumb = await readFile(form.get('thumb'), MAX_DERIVATIVE)
    if (thumb instanceof Response) return thumb

    const saved = await withLock(slug, async () => {
      const album = await readAlbum(store, slug)
      if (!album) return null
      const photo: PhotoRecord = {
        id: crypto.randomUUID(),
        name,
        width: Math.round(width),
        height: Math.round(height),
        bytes: original.byteLength,
        originalType: originalType as PhotoRecord['originalType'],
        addedAt: new Date().toISOString(),
      }
      await store.putBytes(`albums/${slug}/original/${photo.id}.${ext}`, original, originalType)
      await store.putBytes(`albums/${slug}/display/${photo.id}.jpg`, display, 'image/jpeg')
      await store.putBytes(`albums/${slug}/thumb/${photo.id}.jpg`, thumb, 'image/jpeg')
      album.photos.push(photo)
      await writeAlbum(store, album)
      return photo
    })
    if (!saved) return json({ error: 'This link does not match an album.' }, 404)
    return json({ photo: saved }, 201)
  }

  const photoId = parts[5] ?? ''
  if (parts[4] === 'photos' && parts.length === 6 && isPhotoId(photoId) && request.method === 'DELETE') {
    if (!authorized(request, options.password)) return json({ error: 'Unlock the album desk first.' }, 401)
    const removed = await withLock(slug, async () => {
      const album = await readAlbum(store, slug)
      if (!album) return false
      const photo = album.photos.find((item) => item.id === photoId)
      if (!photo) return true
      const ext = photoExt(photo)
      await store.deleteKey(`albums/${slug}/original/${photo.id}.${ext}`)
      await store.deleteKey(`albums/${slug}/display/${photo.id}.jpg`)
      await store.deleteKey(`albums/${slug}/thumb/${photo.id}.jpg`)
      album.photos = album.photos.filter((item) => item.id !== photoId)
      await writeAlbum(store, album)
      return true
    })
    if (!removed) return json({ error: 'This link does not match an album.' }, 404)
    return json({ ok: true })
  }

  if (parts[4] === 'photos' && parts.length === 6 && isPhotoId(photoId) && request.method === 'GET') {
    const album = await readAlbum(store, slug)
    const photo = album?.photos.find((item) => item.id === photoId)
    if (!album || !photo) return json({ error: 'Photograph not found.' }, 404)
    const size = url.searchParams.get('size') ?? 'display'
    const ext = photoExt(photo)
    const key = size === 'original'
      ? `albums/${slug}/original/${photo.id}.${ext}`
      : size === 'thumb'
        ? `albums/${slug}/thumb/${photo.id}.jpg`
        : `albums/${slug}/display/${photo.id}.jpg`
    const file = await store.getBytes(key)
    if (!file) return json({ error: 'Photograph not found.' }, 404)
    const filename = downloadName(photo.name, size === 'original' ? ext : 'jpg')
    const download = url.searchParams.get('download') === '1'
    const body = file.bytes.buffer.slice(file.bytes.byteOffset, file.bytes.byteOffset + file.bytes.byteLength) as ArrayBuffer
    return new Response(body, {
      headers: {
        'content-type': file.contentType || 'image/jpeg',
        'content-length': String(file.bytes.byteLength),
        'cache-control': 'public, max-age=31536000, immutable',
        'content-disposition': `${download ? 'attachment' : 'inline'}; filename="${filename.replace(/"/g, '')}"`,
      },
    })
  }

  return json({ error: 'Not found.' }, 404)
}

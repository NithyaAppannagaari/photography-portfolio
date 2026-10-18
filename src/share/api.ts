export type PhotoRecord = {
  id: string
  name: string
  width: number
  height: number
  bytes: number
  originalType: 'image/jpeg' | 'image/png' | 'image/webp'
  addedAt: string
}

export type Album = {
  slug: string
  title: string
  note: string
  createdAt: string
  photos: PhotoRecord[]
}

export type AlbumSummary = {
  slug: string
  title: string
  note: string
  createdAt: string
  photoCount: number
}

const KEY = 'nithya-share-admin'

export class ShareError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'ShareError'
    this.status = status
  }
}

export function shareMessage(error: unknown): string {
  if (error instanceof ShareError) return error.message
  if (error instanceof Error && error.message) return error.message
  return 'Something went wrong. Try again.'
}

export function getToken(): string {
  try {
    return sessionStorage.getItem(KEY) ?? ''
  } catch {
    return ''
  }
}

export function setToken(token: string): void {
  try {
    if (token) sessionStorage.setItem(KEY, token)
    else sessionStorage.removeItem(KEY)
  } catch {
    /* private mode can block storage; the desk still works for this page load */
  }
}

export function photoUrl(
  slug: string,
  id: string,
  size: 'thumb' | 'display' | 'original' = 'display',
  download = false,
): string {
  const params = new URLSearchParams({ size })
  if (download) params.set('download', '1')
  return `/api/share/albums/${encodeURIComponent(slug)}/photos/${encodeURIComponent(id)}?${params}`
}

async function parseError(response: Response): Promise<string> {
  try {
    const data = await response.json() as { error?: unknown }
    if (typeof data.error === 'string' && data.error) return data.error
  } catch {
    /* empty or non-json body */
  }
  return 'Something went wrong. Try again.'
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const headers = new Headers(init?.headers)
  const token = getToken()
  if (token) headers.set('authorization', `Bearer ${token}`)
  if (init?.body && !(init.body instanceof FormData) && !headers.has('content-type')) {
    headers.set('content-type', 'application/json')
  }
  const response = await fetch(path, { ...init, headers })
  if (response.status === 401) setToken('')
  if (!response.ok) throw new ShareError(await parseError(response), response.status)
  return await response.json() as T
}

export async function login(password: string): Promise<void> {
  const response = await fetch('/api/share/login', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ password }),
  })
  if (!response.ok) throw new ShareError(await parseError(response), response.status)
  setToken(password)
}

export function logout(): void {
  setToken('')
}

export function listAlbums(): Promise<{ albums: AlbumSummary[] }> {
  return request('/api/share/albums')
}

export function createAlbum(input: { slug: string; title: string; note: string }): Promise<{ album: Album }> {
  return request('/api/share/albums', { method: 'POST', body: JSON.stringify(input) })
}

export function getAlbum(slug: string): Promise<{ album: Album }> {
  return request(`/api/share/albums/${encodeURIComponent(slug)}`)
}

export function updateAlbum(slug: string, input: { title: string; note: string }): Promise<{ album: Album }> {
  return request(`/api/share/albums/${encodeURIComponent(slug)}`, {
    method: 'PATCH',
    body: JSON.stringify(input),
  })
}

export function removeAlbum(slug: string): Promise<{ ok: true }> {
  return request(`/api/share/albums/${encodeURIComponent(slug)}`, { method: 'DELETE' })
}

export function uploadPhoto(
  slug: string,
  photo: {
    name: string
    width: number
    height: number
    originalType: PhotoRecord['originalType']
    original: Blob
    display: Blob
    thumb: Blob
  },
): Promise<{ photo: PhotoRecord }> {
  const form = new FormData()
  form.set('name', photo.name)
  form.set('width', String(photo.width))
  form.set('height', String(photo.height))
  form.set('originalType', photo.originalType)
  form.set('original', photo.original, 'original')
  form.set('display', photo.display, 'display.jpg')
  form.set('thumb', photo.thumb, 'thumb.jpg')
  return request(`/api/share/albums/${encodeURIComponent(slug)}/photos`, { method: 'POST', body: form })
}

export function removePhoto(slug: string, id: string): Promise<{ ok: true }> {
  return request(`/api/share/albums/${encodeURIComponent(slug)}/photos/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  })
}

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

export type ShareStore = {
  getJson<T>(key: string): Promise<T | null>
  putJson(key: string, value: unknown): Promise<void>
  putBytes(key: string, bytes: Uint8Array, contentType: string): Promise<void>
  getBytes(key: string): Promise<{ bytes: Uint8Array; contentType: string } | null>
  deleteKey(key: string): Promise<void>
  deletePrefix(prefix: string): Promise<void>
}

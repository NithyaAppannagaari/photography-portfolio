import { withLock } from './lock.ts'
import type { Album, AlbumSummary, ShareStore } from './types.ts'

type IndexFile = { albums: AlbumSummary[] }

export function manifestKey(slug: string): string {
  return `albums/${slug}/manifest.json`
}

export function toSummary(album: Album): AlbumSummary {
  return {
    slug: album.slug,
    title: album.title,
    note: album.note,
    createdAt: album.createdAt,
    photoCount: album.photos.length,
  }
}

export function isAlbum(value: unknown): value is Album {
  if (!value || typeof value !== 'object') return false
  const album = value as Album
  return typeof album.slug === 'string'
    && typeof album.title === 'string'
    && typeof album.createdAt === 'string'
    && Array.isArray(album.photos)
}

export async function readAlbum(store: ShareStore, slug: string): Promise<Album | null> {
  const parsed = await store.getJson<unknown>(manifestKey(slug))
  if (!isAlbum(parsed) || parsed.slug !== slug) return null
  return {
    ...parsed,
    note: typeof parsed.note === 'string' ? parsed.note : '',
    photos: parsed.photos.filter((photo) => photo && typeof photo.id === 'string'),
  }
}

export async function writeAlbum(store: ShareStore, album: Album): Promise<void> {
  await store.putJson(manifestKey(album.slug), album)
  await withLock('index', async () => {
    const index = (await store.getJson<IndexFile>('index.json')) ?? { albums: [] }
    const albums = Array.isArray(index.albums) ? index.albums : []
    const summary = toSummary(album)
    const existing = albums.findIndex((item) => item.slug === album.slug)
    if (existing === -1) albums.push(summary)
    else albums[existing] = summary
    albums.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    await store.putJson('index.json', { albums })
  })
}

export async function listAlbums(store: ShareStore): Promise<AlbumSummary[]> {
  const index = await store.getJson<IndexFile>('index.json')
  if (!index || !Array.isArray(index.albums)) return []
  return index.albums
    .filter((item) => item && typeof item.slug === 'string')
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

export async function deleteAlbum(store: ShareStore, slug: string): Promise<void> {
  await store.deletePrefix(`albums/${slug}/`)
  await withLock('index', async () => {
    const index = (await store.getJson<IndexFile>('index.json')) ?? { albums: [] }
    const albums = Array.isArray(index.albums) ? index.albums.filter((item) => item.slug !== slug) : []
    await store.putJson('index.json', { albums })
  })
}

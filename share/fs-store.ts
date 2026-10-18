import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import type { ShareStore } from './types.ts'

function contentTypeFor(ext: string): string {
  if (ext === 'jpg' || ext === 'jpeg') return 'image/jpeg'
  if (ext === 'png') return 'image/png'
  if (ext === 'webp') return 'image/webp'
  if (ext === 'json') return 'application/json'
  return 'application/octet-stream'
}

export function createFsStore(root: string): ShareStore {
  const base = path.resolve(root)

  const fullPath = (key: string) => {
    const resolved = path.resolve(base, key)
    if (resolved !== base && !resolved.startsWith(base + path.sep)) {
      throw new Error('Refusing to leave the album directory.')
    }
    return resolved
  }

  return {
    async getJson<T>(key: string): Promise<T | null> {
      try {
        const text = await readFile(fullPath(key), 'utf8')
        return JSON.parse(text) as T
      } catch {
        return null
      }
    },
    async putJson(key: string, value: unknown): Promise<void> {
      const file = fullPath(key)
      await mkdir(path.dirname(file), { recursive: true })
      await writeFile(file, JSON.stringify(value))
    },
    async putBytes(key: string, bytes: Uint8Array, contentType: string): Promise<void> {
      void contentType
      const file = fullPath(key)
      await mkdir(path.dirname(file), { recursive: true })
      await writeFile(file, bytes)
    },
    async getBytes(key: string) {
      const ext = path.extname(key).slice(1)
      try {
        const bytes = await readFile(fullPath(key))
        return { bytes: new Uint8Array(bytes), contentType: contentTypeFor(ext) }
      } catch {
        return null
      }
    },
    async deleteKey(key: string): Promise<void> {
      await rm(fullPath(key), { force: true })
    },
    async deletePrefix(prefix: string): Promise<void> {
      const match = /^albums\/([a-z0-9]+(?:-[a-z0-9]+)*)\/$/.exec(prefix)
      if (!match) throw new Error('Refusing to delete that prefix.')
      await rm(fullPath(path.join('albums', match[1])), { recursive: true, force: true })
    },
  }
}

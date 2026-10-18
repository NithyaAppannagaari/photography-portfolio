import type { ShareStore } from './types.ts'

export type R2ObjectBody = {
  arrayBuffer(): Promise<ArrayBuffer>
  httpMetadata?: { contentType?: string }
}

export type R2BucketLike = {
  get(key: string): Promise<R2ObjectBody | null>
  put(key: string, value: Uint8Array, options?: { httpMetadata?: { contentType?: string } }): Promise<unknown>
  delete(keys: string | string[]): Promise<unknown>
  list(options: { prefix?: string; cursor?: string }): Promise<{
    objects: { key: string }[]
    truncated: boolean
    cursor?: string
  }>
}

function contentTypeFor(ext: string): string {
  if (ext === 'jpg' || ext === 'jpeg') return 'image/jpeg'
  if (ext === 'png') return 'image/png'
  if (ext === 'webp') return 'image/webp'
  if (ext === 'json') return 'application/json'
  return 'application/octet-stream'
}

export function createR2Store(bucket: R2BucketLike): ShareStore {
  return {
    async getJson<T>(key: string): Promise<T | null> {
      const object = await bucket.get(key)
      if (!object) return null
      try {
        return JSON.parse(new TextDecoder().decode(await object.arrayBuffer())) as T
      } catch {
        return null
      }
    },
    async putJson(key: string, value: unknown): Promise<void> {
      await bucket.put(key, new TextEncoder().encode(JSON.stringify(value)), {
        httpMetadata: { contentType: 'application/json' },
      })
    },
    async putBytes(key: string, bytes: Uint8Array, contentType: string): Promise<void> {
      await bucket.put(key, bytes, { httpMetadata: { contentType } })
    },
    async getBytes(key: string) {
      const object = await bucket.get(key)
      if (!object) return null
      const ext = key.slice(key.lastIndexOf('.') + 1)
      const bytes = new Uint8Array(await object.arrayBuffer())
      return { bytes, contentType: object.httpMetadata?.contentType || contentTypeFor(ext) }
    },
    async deleteKey(key: string): Promise<void> {
      await bucket.delete(key)
    },
    async deletePrefix(prefix: string): Promise<void> {
      let cursor: string | undefined
      do {
        const page = await bucket.list({ prefix, cursor })
        if (page.objects.length > 0) await bucket.delete(page.objects.map((object) => object.key))
        cursor = page.truncated ? page.cursor : undefined
      } while (cursor)
    },
  }
}

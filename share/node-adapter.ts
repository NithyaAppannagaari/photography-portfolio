import type { IncomingMessage, ServerResponse } from 'node:http'
import { createFsStore } from './fs-store.ts'
import { handleShare } from './http.ts'

function readBody(req: IncomingMessage): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = []
    req.on('data', (chunk: Buffer | string) => {
      chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk)
    })
    req.on('end', () => resolve(Buffer.concat(chunks)))
    req.on('error', reject)
  })
}

async function toRequest(req: IncomingMessage): Promise<Request> {
  const host = req.headers.host ?? '127.0.0.1'
  const url = new URL(req.url ?? '/', `http://${host}`)
  const headers = new Headers()
  for (const [key, value] of Object.entries(req.headers)) {
    if (typeof value === 'string') headers.set(key, value)
    else if (Array.isArray(value)) headers.set(key, value.join(', '))
  }
  headers.delete('content-length')
  headers.delete('transfer-encoding')
  const method = req.method ?? 'GET'
  const hasBody = method !== 'GET' && method !== 'HEAD'
  const init: RequestInit & { duplex?: 'half' } = { method, headers }
  if (hasBody) {
    init.body = new Uint8Array(await readBody(req))
    init.duplex = 'half'
  }
  return new Request(url, init)
}

type Connect = {
  use: (handler: (req: IncomingMessage, res: ServerResponse, next: (err?: unknown) => void) => void) => void
}

export function attachShareApi(middlewares: Connect, dataDir: string, password: string): void {
  const store = createFsStore(dataDir)
  middlewares.use((req, res, next) => {
    const url = req.url ?? ''
    if (!url.startsWith('/api/share')) {
      next()
      return
    }
    const length = Number(req.headers['content-length'] ?? 0)
    if (length > 40_000_000) {
      res.statusCode = 413
      res.setHeader('content-type', 'application/json; charset=utf-8')
      res.end(JSON.stringify({ error: 'That upload is too large.' }))
      return
    }
    void (async () => {
      const request = await toRequest(req)
      const response = await handleShare(request, store, {
        password,
        ip: req.socket.remoteAddress ?? 'local',
      })
      res.statusCode = response.status
      response.headers.forEach((value, key) => {
        if (key === 'content-length') return
        res.setHeader(key, value)
      })
      const bytes = Buffer.from(await response.arrayBuffer())
      res.setHeader('content-length', String(bytes.byteLength))
      res.end(bytes)
    })().catch((error: unknown) => {
      next(error)
    })
  })
}

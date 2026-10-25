import path from 'node:path'
import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { handleContactRequest, type ContactEnv } from './api/contact.ts'
import { intrinsicSizePlugin } from './share/intrinsic-plugin.ts'
import { applyResponse, attachShareApi, toRequest } from './share/node-adapter.ts'

function adminPassword(mode: string, root: string): string {
  const file = loadEnv(mode, root, '')
  return file.SHARE_ADMIN_PASSWORD || process.env.SHARE_ADMIN_PASSWORD || ''
}

function contactEnv(mode: string, root: string): ContactEnv {
  const file = loadEnv(mode, root, '')
  return {
    RESEND_API_KEY: file.RESEND_API_KEY || process.env.RESEND_API_KEY,
    CONTACT_TO_EMAIL: file.CONTACT_TO_EMAIL || process.env.CONTACT_TO_EMAIL,
    CONTACT_FROM_EMAIL: file.CONTACT_FROM_EMAIL || process.env.CONTACT_FROM_EMAIL,
  }
}

function contactApi(): Plugin {
  const attach = (middlewares: { use: Parameters<typeof attachShareApi>[0]['use'] }, mode: string, root: string) => {
    const env = contactEnv(mode, root)
    middlewares.use((req, res, next) => {
      const url = req.url ?? ''
      if (!url.startsWith('/api/contact')) {
        next()
        return
      }
      const length = Number(req.headers['content-length'] ?? 0)
      if (length > 20_000) {
        res.statusCode = 413
        res.setHeader('content-type', 'application/json; charset=utf-8')
        res.end(JSON.stringify({ error: 'that note is too long.' }))
        return
      }
      void (async () => {
        const request = await toRequest(req)
        const response = await handleContactRequest(request, env)
        await applyResponse(res, response)
      })().catch((error: unknown) => {
        next(error)
      })
    })
  }
  return {
    name: 'contact-api',
    configureServer(server) {
      attach(server.middlewares, server.config.mode, server.config.root)
    },
    configurePreviewServer(server) {
      attach(server.middlewares, server.config.mode, server.config.root)
    },
  }
}

function shareApi(): Plugin {
  const attach = (middlewares: { use: Parameters<typeof attachShareApi>[0]['use'] }, mode: string, root: string) => {
    attachShareApi(middlewares, path.resolve(root, '.data/share'), adminPassword(mode, root))
  }
  return {
    name: 'share-api',
    configureServer(server) {
      attach(server.middlewares, server.config.mode, server.config.root)
    },
    configurePreviewServer(server) {
      attach(server.middlewares, server.config.mode, server.config.root)
    },
  }
}

export default defineConfig({
  plugins: [intrinsicSizePlugin(), react(), contactApi(), shareApi()],
  assetsInclude: ['**/*.JPG'],
})

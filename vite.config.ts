import path from 'node:path'
import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { attachShareApi } from './share/node-adapter.ts'

function adminPassword(mode: string, root: string): string {
  const file = loadEnv(mode, root, '')
  return file.SHARE_ADMIN_PASSWORD || process.env.SHARE_ADMIN_PASSWORD || ''
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
  plugins: [react(), shareApi()],
  assetsInclude: ['**/*.JPG'],
})

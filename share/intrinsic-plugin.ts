import fs from 'node:fs/promises'
import type { Plugin } from 'vite'
import { readImageSize } from './image-size.ts'

export function intrinsicSizePlugin(): Plugin {
  return {
    name: 'intrinsic-size',
    enforce: 'pre',
    async load(id) {
      const queryAt = id.indexOf('?')
      if (queryAt === -1) return null
      const params = new URLSearchParams(id.slice(queryAt + 1))
      if (!params.has('intrinsic')) return null
      let file = id.slice(0, queryAt)
      try { file = decodeURIComponent(file) } catch { /* path is already plain */ }
      const size = readImageSize(await fs.readFile(file))
      return `export default ${JSON.stringify(size)}\n`
    },
  }
}

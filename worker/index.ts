import { handleContactRequest } from '../api/contact.ts'
import { readAlbum } from '../share/albums.ts'
import { handleShare } from '../share/http.ts'
import { createR2Store, type R2BucketLike } from '../share/r2-store.ts'
import { isSlug } from '../share/slug.ts'

type AssetBinding = {
  fetch: (input: Request | string) => Promise<Response>
}

export interface ShareEnv {
  SHARE_BUCKET: R2BucketLike
  SHARE_ADMIN_PASSWORD?: string
  RESEND_API_KEY?: string
  CONTACT_TO_EMAIL?: string
  CONTACT_FROM_EMAIL?: string
  ASSETS: AssetBinding
}

function escapeAttr(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
}

async function albumHtml(request: Request, env: ShareEnv, slug: string): Promise<Response | null> {
  const album = await readAlbum(createR2Store(env.SHARE_BUCKET), slug)
  const indexUrl = new URL('/index.html', request.url)
  const index = await env.ASSETS.fetch(new Request(indexUrl.toString()))
  if (!index.ok) return null
  let html = await index.text()
  if (!album) return new Response(html, { headers: { 'content-type': 'text/html; charset=utf-8' } })
  const origin = new URL(request.url).origin
  const description = album.note || 'Photographs by Nithya Appannagaari.'
  const title = `${album.title} · Nithya Appannagaari`
  const cover = album.photos[0]
  const image = cover ? `${origin}/api/share/albums/${slug}/photos/${cover.id}?size=display` : ''
  const tags = [
    `<title>${escapeAttr(title)}</title>`,
    `<meta property="og:title" content="${escapeAttr(title)}" />`,
    `<meta property="og:description" content="${escapeAttr(description)}" />`,
    `<meta property="og:url" content="${escapeAttr(request.url)}" />`,
    `<meta name="robots" content="noindex" />`,
    image ? `<meta property="og:image" content="${escapeAttr(image)}" />` : '',
  ].join('')
  html = html.replace(/<title>[\s\S]*?<\/title>/i, '').replace('</head>', `${tags}</head>`)
  return new Response(html, {
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'cache-control': 'no-cache',
    },
  })
}

export default {
  async fetch(request: Request, env: ShareEnv): Promise<Response> {
    const url = new URL(request.url)
    if (url.pathname === '/api/contact') {
      return handleContactRequest(request, {
        RESEND_API_KEY: env.RESEND_API_KEY,
        CONTACT_TO_EMAIL: env.CONTACT_TO_EMAIL,
        CONTACT_FROM_EMAIL: env.CONTACT_FROM_EMAIL,
      })
    }
    if (url.pathname.startsWith('/api/share')) {
      return handleShare(request, createR2Store(env.SHARE_BUCKET), {
        password: env.SHARE_ADMIN_PASSWORD ?? '',
        ip: request.headers.get('cf-connecting-ip') ?? 'unknown',
      })
    }
    const match = /^\/share\/([a-z0-9]+(?:-[a-z0-9]+)*)$/.exec(url.pathname)
    if (request.method === 'GET' && match && isSlug(match[1])) {
      const decorated = await albumHtml(request, env, match[1])
      if (decorated) return decorated
    }
    return env.ASSETS.fetch(request)
  },
}

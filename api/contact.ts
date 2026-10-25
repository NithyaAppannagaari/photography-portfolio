export const INQUIRY_TYPES = [
  'Club or org photography',
  'Event',
  'Portrait or grad',
  'Other',
] as const

export type InquiryType = (typeof INQUIRY_TYPES)[number]

export type ContactEnv = {
  RESEND_API_KEY?: string
  CONTACT_TO_EMAIL?: string
  CONTACT_FROM_EMAIL?: string
}

export type OutboundMail = {
  from: string
  to: string
  replyTo: string
  subject: string
  html: string
  text: string
}

type Inquiry = {
  name: string
  email: string
  inquiryType: InquiryType
  eventDate: string
  location: string
  groupSize: string
  budget: string
  message: string
}

type Result = { status: number; body: { ok?: boolean; error?: string } }

export type InquiryDeps = {
  now?: () => number
  env?: ContactEnv
  send?: (mail: OutboundMail) => Promise<void>
}

const WINDOW_MS = 15 * 60 * 1000
const MAX_HITS = 5
const hits = new Map<string, number[]>()

export function resetInquiryLimits(): void {
  hits.clear()
}

function oneLine(value: string, max: number): string {
  return value.replace(/[\r\n\t]+/g, ' ').replace(/\s+/g, ' ').trim().slice(0, max)
}

function field(body: Record<string, unknown>, key: string): string {
  const value = body[key]
  return typeof value === 'string' ? value : ''
}

function validEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && value.length <= 120
}

function validDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const [year, month, day] = value.split('-').map(Number)
  if (year < 2000 || year > 2100) return false
  const date = new Date(Date.UTC(year, month - 1, day))
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function limited(ip: string, now: number): boolean {
  const recent = (hits.get(ip) ?? []).filter((time) => now - time < WINDOW_MS)
  if (recent.length >= MAX_HITS) {
    hits.set(ip, recent)
    return true
  }
  recent.push(now)
  hits.set(ip, recent)
  return false
}

function readEnv(override?: ContactEnv): ContactEnv {
  if (override) return override
  const env = typeof process !== 'undefined' ? process.env : {}
  return {
    RESEND_API_KEY: env.RESEND_API_KEY,
    CONTACT_TO_EMAIL: env.CONTACT_TO_EMAIL,
    CONTACT_FROM_EMAIL: env.CONTACT_FROM_EMAIL,
  }
}

export function formatFrom(value: string | undefined): string {
  const raw = (value ?? '').trim()
  if (!raw) return 'Nithya Appannagaari <onboarding@resend.dev>'
  if (raw.includes('<') && raw.includes('>')) return raw
  return `Nithya Appannagaari <${raw}>`
}

function originAllowed(origin: string | null | undefined, host: string | null | undefined): boolean {
  if (!origin || origin === 'null') return true
  if (!host) return true
  try {
    return new URL(origin).host === host
  } catch {
    return false
  }
}

function clientIp(headers: Headers): string {
  const cf = headers.get('cf-connecting-ip')
  if (cf) return cf.trim()
  const real = headers.get('x-real-ip')
  if (real) return real.trim()
  const forwarded = headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0]?.trim() || 'unknown'
  return 'unknown'
}

export function buildMail(inquiry: Inquiry, env: ContactEnv): OutboundMail {
  const to = (env.CONTACT_TO_EMAIL ?? '').trim()
  const budget = inquiry.budget || 'not given'
  const rows: [string, string][] = [
    ['Name', inquiry.name],
    ['Reply to', inquiry.email],
    ['Kind of shoot', inquiry.inquiryType],
    ['Date', inquiry.eventDate],
    ['Location', inquiry.location],
    ['Group size', inquiry.groupSize],
    ['Budget', budget],
  ]
  const text = [
    'New inquiry from the portfolio site.',
    '',
    ...rows.map(([label, value]) => `${label}: ${value}`),
    '',
    'Message:',
    inquiry.message,
    '',
    'Reply to this email to write back.',
  ].join('\n')
  const htmlRows = rows.map(([label, value]) => (
    `<tr><th style="text-align:left;padding:8px 16px 8px 0;vertical-align:top;font-weight:600;">${escapeHtml(label)}</th><td style="padding:8px 0;vertical-align:top;">${escapeHtml(value)}</td></tr>`
  )).join('')
  const html = `<!DOCTYPE html><html><body style="margin:0;padding:24px;background:#ffffff;color:#4a1038;font-family:Georgia,serif;line-height:1.5;">
<div style="max-width:560px;">
<p style="margin:0 0 8px;font-size:12px;letter-spacing:0.14em;text-transform:uppercase;color:#e86aa6;">New inquiry</p>
<h1 style="margin:0 0 18px;font-size:28px;font-weight:500;color:#6e1848;">${escapeHtml(inquiry.inquiryType)}</h1>
<table style="width:100%;border-collapse:collapse;font-size:16px;">${htmlRows}</table>
<h2 style="margin:22px 0 8px;font-size:16px;">Message</h2>
<p style="margin:0;white-space:pre-wrap;">${escapeHtml(inquiry.message)}</p>
<p style="margin:22px 0 0;font-size:14px;">Reply to this email to write back.</p>
</div>
</body></html>`
  return {
    from: formatFrom(env.CONTACT_FROM_EMAIL),
    to,
    replyTo: inquiry.email,
    subject: `${inquiry.inquiryType} inquiry from ${inquiry.name}`,
    html,
    text,
  }
}

async function sendWithResend(mail: OutboundMail, env: ContactEnv): Promise<void> {
  const key = env.RESEND_API_KEY?.trim()
  if (!key || !mail.to) throw new Error('missing-config')
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: mail.from,
      to: [mail.to],
      reply_to: mail.replyTo,
      subject: mail.subject,
      html: mail.html,
      text: mail.text,
    }),
  })
  if (!response.ok) throw new Error(`resend-${response.status}`)
}

function parseInquiry(body: unknown): { inquiry?: Inquiry; error?: string; trap?: boolean } {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return { error: 'that note could not be read.' }
  }
  const record = body as Record<string, unknown>
  if (field(record, 'b_field').trim()) return { trap: true }
  const name = oneLine(field(record, 'name'), 80)
  const email = oneLine(field(record, 'email'), 120)
  const inquiryType = oneLine(field(record, 'inquiryType'), 40)
  const eventDate = oneLine(field(record, 'eventDate'), 20)
  const location = oneLine(field(record, 'location'), 120)
  const groupSize = oneLine(field(record, 'groupSize'), 40)
  const budget = oneLine(field(record, 'budget'), 80)
  const message = field(record, 'message').replace(/\r\n/g, '\n').trim().slice(0, 4000)
  if (!name) return { error: 'add your name.' }
  if (!validEmail(email)) return { error: "that email doesn't look right." }
  if (!INQUIRY_TYPES.includes(inquiryType as InquiryType)) return { error: 'pick what kind of shoot.' }
  if (!validDate(eventDate)) return { error: 'add the date.' }
  if (!location) return { error: 'add the location.' }
  if (!groupSize) return { error: 'add about how many people.' }
  if (!message) return { error: 'add a short note.' }
  if (message.length > 2000) return { error: 'that note is too long.' }
  return {
    inquiry: {
      name,
      email,
      inquiryType: inquiryType as InquiryType,
      eventDate,
      location,
      groupSize,
      budget,
      message,
    },
  }
}

export async function submitInquiry(input: {
  body: unknown
  ip: string
  contentLength?: number
  origin?: string | null
  host?: string | null
}, deps: InquiryDeps = {}): Promise<Result> {
  const packed = JSON.stringify(input.body ?? '')
  if ((input.contentLength ?? 0) > 20_000 || packed.length > 20_000) {
    return { status: 413, body: { error: 'that note is too long.' } }
  }
  if (!originAllowed(input.origin, input.host)) {
    return { status: 403, body: { error: "that didn't send. try again in a minute." } }
  }
  const parsed = parseInquiry(input.body)
  const now = (deps.now ?? Date.now)()
  const over = limited(input.ip || 'unknown', now)
  if (parsed.trap) return { status: 200, body: { ok: true } }
  if (over) return { status: 429, body: { error: 'too many notes at once. wait a bit and try again.' } }
  if (!parsed.inquiry) return { status: 400, body: { error: parsed.error ?? 'that note could not be read.' } }
  const env = readEnv(deps.env)
  if (!env.RESEND_API_KEY?.trim() || !env.CONTACT_TO_EMAIL?.trim()) {
    return { status: 503, body: { error: "the form isn't ready yet." } }
  }
  const mail = buildMail(parsed.inquiry, env)
  try {
    if (deps.send) await deps.send(mail)
    else await sendWithResend(mail, env)
  } catch (error) {
    if (error instanceof Error && error.message === 'missing-config') {
      return { status: 503, body: { error: "the form isn't ready yet." } }
    }
    return { status: 502, body: { error: "that didn't send. try again in a minute." } }
  }
  return { status: 200, body: { ok: true } }
}

export async function handleContactRequest(request: Request, env?: ContactEnv): Promise<Response> {
  if (request.method !== 'POST') {
    return Response.json({ error: 'use the form on the site.' }, { status: 405, headers: { Allow: 'POST', 'cache-control': 'no-store' } })
  }
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'that note could not be read.' }, { status: 400, headers: { 'cache-control': 'no-store' } })
  }
  const url = new URL(request.url)
  const result = await submitInquiry({
    body,
    ip: clientIp(request.headers),
    contentLength: Number(request.headers.get('content-length') ?? 0),
    origin: request.headers.get('origin'),
    host: request.headers.get('host') ?? url.host,
  }, { env })
  return Response.json(result.body, {
    status: result.status,
    headers: { 'cache-control': 'no-store' },
  })
}

type NodeRequest = {
  method?: string
  headers: Record<string, string | string[] | undefined>
  body?: unknown
  socket?: { remoteAddress?: string }
}

type NodeResponse = {
  statusCode: number
  setHeader: (name: string, value: string) => void
  end: (body?: string) => void
}

function headerValue(headers: NodeRequest['headers'], name: string): string | undefined {
  const value = headers[name] ?? headers[name.toLowerCase()]
  if (Array.isArray(value)) return value[0]
  return value
}

export default async function handler(req: NodeRequest, res: NodeResponse): Promise<void> {
  const finish = (status: number, body: Result['body']) => {
    res.statusCode = status
    res.setHeader('content-type', 'application/json; charset=utf-8')
    res.setHeader('cache-control', 'no-store')
    res.end(JSON.stringify(body))
  }
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    finish(405, { error: 'use the form on the site.' })
    return
  }
  const forwarded = headerValue(req.headers, 'x-forwarded-for')
  const ip = headerValue(req.headers, 'x-real-ip') || forwarded?.split(',')[0]?.trim() || req.socket?.remoteAddress || 'unknown'
  const result = await submitInquiry({
    body: req.body,
    ip,
    contentLength: Number(headerValue(req.headers, 'content-length') ?? 0),
    origin: headerValue(req.headers, 'origin'),
    host: headerValue(req.headers, 'host'),
  })
  finish(result.status, result.body)
}

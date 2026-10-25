import assert from 'node:assert/strict'
import { afterEach, test } from 'node:test'
import {
  buildMail,
  formatFrom,
  handleContactRequest,
  resetInquiryLimits,
  submitInquiry,
  type OutboundMail,
} from './contact.ts'

const valid = {
  name: 'Ada Lovelace',
  email: 'ada@example.com',
  inquiryType: 'Club or org photography',
  eventDate: '2026-05-02',
  location: 'Berkeley',
  groupSize: 'about 30',
  budget: '',
  message: 'We need headshots at the spring showcase.',
  b_field: '',
}

const ready = {
  RESEND_API_KEY: 're_test_key',
  CONTACT_TO_EMAIL: 'photographer@example.com',
}

afterEach(() => {
  resetInquiryLimits()
})

test('formatFrom uses the onboarding sender until a domain is set', () => {
  assert.equal(formatFrom(undefined), 'Nithya Appannagaari <onboarding@resend.dev>')
  assert.equal(formatFrom(''), 'Nithya Appannagaari <onboarding@resend.dev>')
  assert.equal(formatFrom('hello@example.com'), 'Nithya Appannagaari <hello@example.com>')
  assert.equal(formatFrom('Studio <hello@example.com>'), 'Studio <hello@example.com>')
})

test('rejects a bad email and a missing date', async () => {
  const email = await submitInquiry({
    body: { ...valid, email: 'not-an-email' },
    ip: '10.0.0.1',
  }, { env: ready, send: async () => { throw new Error('should not send') } })
  assert.equal(email.status, 400)
  assert.equal(email.body.error, "that email doesn't look right.")

  const date = await submitInquiry({
    body: { ...valid, eventDate: 'May' },
    ip: '10.0.0.2',
  }, { env: ready, send: async () => { throw new Error('should not send') } })
  assert.equal(date.status, 400)
  assert.equal(date.body.error, 'add the date.')
})

test('rejects an unknown inquiry type', async () => {
  const result = await submitInquiry({
    body: { ...valid, inquiryType: 'Wedding' },
    ip: '10.0.0.3',
  }, { env: ready, send: async () => { throw new Error('should not send') } })
  assert.equal(result.status, 400)
  assert.equal(result.body.error, 'pick what kind of shoot.')
})

test('honeypot returns success and does not send', async () => {
  let sent = false
  const result = await submitInquiry({
    body: { ...valid, b_field: 'https://spam.example' },
    ip: '10.0.0.4',
  }, {
    env: ready,
    send: async () => { sent = true },
  })
  assert.equal(result.status, 200)
  assert.equal(result.body.ok, true)
  assert.equal(sent, false)
})

test('rate limit blocks the sixth note from one address', async () => {
  let count = 0
  const send = async () => { count += 1 }
  for (let i = 0; i < 5; i += 1) {
    const result = await submitInquiry({ body: valid, ip: '10.0.0.5' }, { env: ready, send })
    assert.equal(result.status, 200)
  }
  const blocked = await submitInquiry({ body: valid, ip: '10.0.0.5' }, { env: ready, send })
  assert.equal(blocked.status, 429)
  assert.equal(count, 5)
})

test('missing server config does not send', async () => {
  let sent = false
  const result = await submitInquiry({
    body: valid,
    ip: '10.0.0.6',
  }, { env: {}, send: async () => { sent = true } })
  assert.equal(result.status, 503)
  assert.equal(result.body.error, "the form isn't ready yet.")
  assert.equal(sent, false)
})

test('mail sets reply_to to the sender and keeps budget optional', async () => {
  let mail: OutboundMail | undefined
  const result = await submitInquiry({
    body: valid,
    ip: '10.0.0.7',
  }, {
    env: ready,
    send: async (next) => { mail = next },
  })
  assert.equal(result.status, 200)
  assert.ok(mail)
  assert.equal(mail.replyTo, 'ada@example.com')
  assert.equal(mail.to, 'photographer@example.com')
  assert.equal(mail.from, 'Nithya Appannagaari <onboarding@resend.dev>')
  assert.match(mail.text, /Budget: not given/)
  assert.match(mail.text, /Reply to: ada@example.com/)
  assert.match(mail.html, /ada@example.com/)
  assert.doesNotMatch(mail.html, /<script/i)
})

test('resend payload uses reply_to', async () => {
  const calls: { url: string; body: Record<string, unknown> }[] = []
  const original = globalThis.fetch
  globalThis.fetch = (async (url: string | URL | Request, init?: RequestInit) => {
    calls.push({ url: String(url), body: JSON.parse(String(init?.body)) as Record<string, unknown> })
    return new Response(JSON.stringify({ id: 'email_123' }), { status: 200 })
  }) as typeof fetch
  try {
    const result = await submitInquiry({ body: valid, ip: '10.0.0.8' }, { env: ready })
    assert.equal(result.status, 200)
    assert.equal(calls.length, 1)
    assert.equal(calls[0].url, 'https://api.resend.com/emails')
    assert.equal(calls[0].body.reply_to, 'ada@example.com')
    assert.deepEqual(calls[0].body.to, ['photographer@example.com'])
    assert.equal(calls[0].body.from, 'Nithya Appannagaari <onboarding@resend.dev>')
    assert.equal(typeof calls[0].body.html, 'string')
    assert.equal(typeof calls[0].body.text, 'string')
  } finally {
    globalThis.fetch = original
  }
})

test('a failed resend call stays a plain error', async () => {
  const original = globalThis.fetch
  globalThis.fetch = (async () => new Response('nope', { status: 403 })) as typeof fetch
  try {
    const result = await submitInquiry({ body: valid, ip: '10.0.0.9' }, { env: ready })
    assert.equal(result.status, 502)
    assert.equal(result.body.error, "that didn't send. try again in a minute.")
  } finally {
    globalThis.fetch = original
  }
})

test('request helper rejects anything but POST', async () => {
  const response = await handleContactRequest(new Request('http://localhost/api/contact', { method: 'GET' }))
  assert.equal(response.status, 405)
})

test('buildMail escapes html in the note', () => {
  const mail = buildMail({
    name: 'Ada',
    email: 'ada@example.com',
    inquiryType: 'Event',
    eventDate: '2026-05-02',
    location: 'Berkeley',
    groupSize: '12',
    budget: '<b>80</b>',
    message: 'hello <script>',
  }, ready)
  assert.match(mail.html, /&lt;script&gt;/)
  assert.match(mail.html, /&lt;b&gt;80&lt;\/b&gt;/)
  assert.match(mail.text, /hello <script>/)
})

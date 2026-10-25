import { useState, type FormEvent } from 'react'
import './ContactForm.css'

const TYPES = [
  'Club or org photography',
  'Event',
  'Portrait or grad',
  'Other',
] as const

type Fields = {
  name: string
  email: string
  inquiryType: string
  eventDate: string
  location: string
  groupSize: string
  budget: string
  message: string
  b_field: string
}

const EMPTY: Fields = {
  name: '',
  email: '',
  inquiryType: '',
  eventDate: '',
  location: '',
  groupSize: '',
  budget: '',
  message: '',
  b_field: '',
}

export default function ContactForm() {
  const [fields, setFields] = useState<Fields>(EMPTY)
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [error, setError] = useState('')

  function set<K extends keyof Fields>(key: K, value: Fields[K]) {
    setFields((current) => ({ ...current, [key]: value }))
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (status === 'sending') return
    setStatus('sending')
    setError('')
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(fields),
      })
      const data = await response.json().catch(() => ({})) as { ok?: boolean; error?: string }
      if (!response.ok || !data.ok) {
        setStatus('error')
        setError(data.error || "that didn't send. try again in a minute.")
        return
      }
      setStatus('sent')
      setFields(EMPTY)
    } catch {
      setStatus('error')
      setError("that didn't send. try again in a minute.")
    }
  }

  if (status === 'sent') {
    return (
      <div className="inquiry inquiry--sent" role="status">
        <p className="kicker">got it</p>
        <p className="inquiry__thanks">got it. i'll write back soon.</p>
        <button type="button" className="sticker sticker--sage" onClick={() => setStatus('idle')}>
          send another
        </button>
      </div>
    )
  }

  return (
    <form className="inquiry" onSubmit={(event) => { void onSubmit(event) }} noValidate>
      <div className="inquiry__trap" aria-hidden="true">
        <label htmlFor="b_field">Leave this blank</label>
        <input
          id="b_field"
          name="b_field"
          tabIndex={-1}
          autoComplete="off"
          value={fields.b_field}
          onChange={(event) => set('b_field', event.target.value)}
        />
      </div>
      <div className="inquiry__grid">
        <label>
          <span>name</span>
          <input
            name="name"
            autoComplete="name"
            required
            value={fields.name}
            onChange={(event) => set('name', event.target.value)}
          />
        </label>
        <label>
          <span>email</span>
          <input
            name="email"
            type="email"
            autoComplete="email"
            required
            value={fields.email}
            onChange={(event) => set('email', event.target.value)}
          />
        </label>
        <label className="inquiry__wide">
          <span>what kind of shoot</span>
          <select
            name="inquiryType"
            required
            value={fields.inquiryType}
            onChange={(event) => set('inquiryType', event.target.value)}
          >
            <option value="">pick one</option>
            {TYPES.map((type) => <option key={type} value={type}>{type}</option>)}
          </select>
        </label>
        <label>
          <span>event date</span>
          <input
            name="eventDate"
            type="date"
            required
            value={fields.eventDate}
            onChange={(event) => set('eventDate', event.target.value)}
          />
        </label>
        <label>
          <span>location</span>
          <input
            name="location"
            autoComplete="off"
            required
            value={fields.location}
            onChange={(event) => set('location', event.target.value)}
          />
        </label>
        <label>
          <span>approximate group size</span>
          <input
            name="groupSize"
            required
            value={fields.groupSize}
            onChange={(event) => set('groupSize', event.target.value)}
          />
        </label>
        <label>
          <span>budget, if you have one</span>
          <input
            name="budget"
            value={fields.budget}
            onChange={(event) => set('budget', event.target.value)}
          />
        </label>
        <label className="inquiry__wide">
          <span>message</span>
          <textarea
            name="message"
            required
            rows={5}
            value={fields.message}
            onChange={(event) => set('message', event.target.value)}
          />
        </label>
      </div>
      {error ? <p className="inquiry__error" role="alert">{error}</p> : null}
      <button className="sticker sticker--marigold inquiry__send" type="submit" disabled={status === 'sending'}>
        {status === 'sending' ? 'sending...' : 'send it'}
      </button>
    </form>
  )
}

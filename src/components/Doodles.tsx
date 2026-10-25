export function Sparkle({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" aria-hidden="true">
      <path d="M24 4c.6 7.2 3.4 11 12.4 13.2C27.4 19.6 24.8 23.2 24 31c-.8-7.8-3.6-11.4-12.4-13.8C20.6 15 23.4 11.2 24 4Z" fill="currentColor" />
      <path d="M40 6.5c.2 2.4 1.2 3.6 4 4.4-2.8.8-3.8 2-4 4.4-.2-2.4-1.2-3.6-4-4.4 2.8-.8 3.8-2 4-4.4Z" fill="currentColor" />
    </svg>
  )
}

export function StarDoodle({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <path d="M32 7.5 37.6 23.2l16.2 1.2-12.4 9.6 4.2 16.4L32 42.8 18.4 50.4l4.2-16.4L10.2 24.4l16.2-1.2L32 7.5Z" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" />
    </svg>
  )
}

export function FlowerDoodle({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <circle cx="32" cy="32" r="5" fill="currentColor" />
      <path d="M32 14c4 5 4 9 0 12-4-3-4-7 0-12Zm0 24c4 3 4 7 0 12-4-5-4-9 0-12ZM14 32c5-4 9-4 12 0-3 4-7 4-12 0Zm24 0c3 4 7 4 12 0-5-4-9-4-12 0Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  )
}

export function HeartDoodle({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <path d="M32 52C18 42 10 34.5 10 24.5 10 17 15.5 12 22.2 12c4.2 0 7.4 2.2 9.8 6 2.4-3.8 5.6-6 9.8-6C48.5 12 54 17 54 24.5 54 34.5 46 42 32 52Z" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" />
    </svg>
  )
}

export function Squiggle({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 120 28" fill="none" aria-hidden="true">
      <path d="M2 18c8-12 14-12 20 0s12 12 20 0 12-12 20 0 12 12 20 0 12-12 16 0" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  )
}

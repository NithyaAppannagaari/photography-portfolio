type MarkProps = {
  className?: string
}

export default function Mark({ className }: MarkProps) {
  return (
    <svg className={className} viewBox="0 0 340 460" fill="none" aria-hidden="true">
      <path
        pathLength="100"
        stroke="currentColor"
        strokeWidth="28"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M86 424C74 292 92 148 78 58C74 28 108 16 118 52C162 168 214 300 262 418C272 286 250 146 280 54C290 22 254 8 240 40"
      />
    </svg>
  )
}

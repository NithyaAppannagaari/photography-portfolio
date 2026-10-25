export const homeLayout = [
  { kind: 'highlights' },
  { kind: 'work' },
  { kind: 'contact' },
] as const

export type HomeBlock = (typeof homeLayout)[number]

export const homeLayout = [
  { kind: 'hero' },
  { kind: 'highlights' },
  { kind: 'work' },
  { kind: 'contact' },
] as const

export type HomeBlock = (typeof homeLayout)[number]

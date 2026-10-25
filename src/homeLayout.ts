export const homeLayout = [
  { kind: 'hero' },
  { kind: 'scallop', tone: 'sage' },
  { kind: 'highlights' },
  { kind: 'work' },
  { kind: 'scallop', tone: 'rose' },
  { kind: 'contact' },
] as const

export type HomeBlock = (typeof homeLayout)[number]

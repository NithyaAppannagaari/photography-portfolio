export const homeLayout = [
  { kind: 'hero' },
  { kind: 'scallop', tone: 'lavender' },
  { kind: 'highlights' },
  { kind: 'work' },
  { kind: 'scallop', tone: 'pink' },
  { kind: 'contact' },
] as const

export type HomeBlock = (typeof homeLayout)[number]

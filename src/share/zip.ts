import { zipSync } from 'fflate'

export function zipPhotos(files: { name: string; bytes: Uint8Array }[]): Blob {
  const data: Record<string, Uint8Array> = {}
  const used = new Map<string, number>()
  for (const file of files) {
    const seen = used.get(file.name) ?? 0
    used.set(file.name, seen + 1)
    let name = file.name
    if (seen > 0) {
      const dot = name.lastIndexOf('.')
      const suffix = `-${seen + 1}`
      name = dot > 0 ? `${name.slice(0, dot)}${suffix}${name.slice(dot)}` : `${name}${suffix}`
    }
    data[name] = file.bytes
  }
  const zipped = zipSync(data, { level: 0 })
  const copy = zipped.buffer.slice(zipped.byteOffset, zipped.byteOffset + zipped.byteLength) as ArrayBuffer
  return new Blob([copy], { type: 'application/zip' })
}

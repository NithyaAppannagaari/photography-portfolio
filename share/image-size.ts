export type ImageSize = { width: number; height: number }

const SWAP_ORIENTATION = new Set([5, 6, 7, 8])

export function applyOrientation(size: ImageSize, orientation: number): ImageSize {
  if (SWAP_ORIENTATION.has(orientation)) return { width: size.height, height: size.width }
  return size
}

export function readImageSize(bytes: Uint8Array): ImageSize {
  if (isPng(bytes)) return readPng(bytes)
  if (isWebp(bytes)) return readWebp(bytes)
  if (isJpeg(bytes)) return readJpeg(bytes)
  throw new Error('Could not read image dimensions')
}

function isPng(bytes: Uint8Array): boolean {
  return bytes.length >= 24
    && bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47
}

function isWebp(bytes: Uint8Array): boolean {
  return bytes.length >= 16
    && bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46
    && bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50
}

function isJpeg(bytes: Uint8Array): boolean {
  return bytes.length >= 4 && bytes[0] === 0xff && bytes[1] === 0xd8
}

function viewOf(bytes: Uint8Array): DataView {
  return new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength)
}

function readPng(bytes: Uint8Array): ImageSize {
  const view = viewOf(bytes)
  return { width: view.getUint32(16), height: view.getUint32(20) }
}

function readWebp(bytes: Uint8Array): ImageSize {
  const kind = String.fromCharCode(bytes[12], bytes[13], bytes[14], bytes[15])
  const view = viewOf(bytes)
  if (kind === 'VP8 ' && bytes.length >= 30) {
    return {
      width: view.getUint16(26, true) & 0x3fff,
      height: view.getUint16(28, true) & 0x3fff,
    }
  }
  if (kind === 'VP8L' && bytes.length >= 25 && bytes[20] === 0x2f) {
    const bits = view.getUint32(21, true)
    return {
      width: (bits & 0x3fff) + 1,
      height: ((bits >> 14) & 0x3fff) + 1,
    }
  }
  if (kind === 'VP8X' && bytes.length >= 30) {
    return {
      width: 1 + (bytes[24] | (bytes[25] << 8) | (bytes[26] << 16)),
      height: 1 + (bytes[27] | (bytes[28] << 8) | (bytes[29] << 16)),
    }
  }
  throw new Error('Could not read WebP dimensions')
}

function readJpeg(bytes: Uint8Array): ImageSize {
  const view = viewOf(bytes)
  let offset = 2
  let size: ImageSize | null = null
  let orientation = 1
  while (offset + 1 < bytes.length) {
    if (bytes[offset] !== 0xff) break
    while (offset < bytes.length && bytes[offset] === 0xff) offset += 1
    if (offset >= bytes.length) break
    const marker = bytes[offset]
    offset += 1
    if (marker === 0xd9 || marker === 0xda) break
    if (marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) continue
    if (offset + 2 > bytes.length) break
    const length = view.getUint16(offset)
    if (length < 2 || offset + length > bytes.length) break
    const sof = (marker >= 0xc0 && marker <= 0xc3)
      || (marker >= 0xc5 && marker <= 0xc7)
      || (marker >= 0xc9 && marker <= 0xcb)
      || (marker >= 0xcd && marker <= 0xcf)
    if (sof) {
      size = { height: view.getUint16(offset + 3), width: view.getUint16(offset + 5) }
    } else if (marker === 0xe1) {
      const found = readExifOrientation(bytes, offset + 2, length - 2)
      if (found) orientation = found
    }
    offset += length
    if (size) break
  }
  if (!size || size.width < 1 || size.height < 1) throw new Error('Could not read JPEG dimensions')
  return applyOrientation(size, orientation)
}

function readExifOrientation(bytes: Uint8Array, start: number, length: number): number | null {
  if (length < 16) return null
  if (
    bytes[start] !== 0x45 || bytes[start + 1] !== 0x78 || bytes[start + 2] !== 0x69
    || bytes[start + 3] !== 0x66 || bytes[start + 4] !== 0 || bytes[start + 5] !== 0
  ) return null
  const tiff = start + 6
  const little = bytes[tiff] === 0x49 && bytes[tiff + 1] === 0x49
  const big = bytes[tiff] === 0x4d && bytes[tiff + 1] === 0x4d
  if (!little && !big) return null
  const view = viewOf(bytes)
  const end = start + length
  const ifd = tiff + view.getUint32(tiff + 4, little)
  if (ifd + 2 > end) return null
  const count = view.getUint16(ifd, little)
  for (let i = 0; i < count; i += 1) {
    const entry = ifd + 2 + i * 12
    if (entry + 12 > bytes.length) return null
    if (view.getUint16(entry, little) !== 0x0112) continue
    if (view.getUint16(entry + 2, little) !== 3) return null
    return view.getUint16(entry + 8, little)
  }
  return null
}

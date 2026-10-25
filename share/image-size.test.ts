import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import test from 'node:test'
import { applyOrientation, readImageSize } from './image-size.ts'

const root = path.resolve(import.meta.dirname, '..')

test('orientation 6 swaps width and height', () => {
  assert.deepEqual(applyOrientation({ width: 2000, height: 1333 }, 6), { width: 1333, height: 2000 })
  assert.deepEqual(applyOrientation({ width: 2000, height: 1333 }, 1), { width: 2000, height: 1333 })
})

test('reads real portfolio image dimensions', () => {
  const cases: Array<[string, number, number]> = [
    ['src/assets/about.webp', 1600, 1066],
    ['src/assets/sunny/jump.webp', 2000, 1425],
    ['src/assets/sunny/blue-sky.webp', 1333, 2000],
    ['src/assets/sunny/golden-trio.webp', 2000, 1458],
    ['src/assets/sunny/sky-dancers.webp', 1334, 2000],
    ['src/assets/club_photoshoots/DSC08853 (1).jpg', 2048, 1425],
    ['src/assets/club_photoshoots/CLUB_PIC.png', 1578, 1054],
    ['src/assets/event_photography/vertical7.jpeg', 3623, 5430],
  ]
  for (const [file, width, height] of cases) {
    const size = readImageSize(fs.readFileSync(path.join(root, file)))
    assert.deepEqual(size, { width, height }, file)
  }
})

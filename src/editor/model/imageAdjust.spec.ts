import { describe, expect, it } from 'vitest'
import {
  DEFAULT_DOCUMENT_DPI,
  MAX_IMAGE_EDGE,
  clampCropRect,
  createCenteredCropRect,
  listCropRatios,
  normalizeDegrees,
  resizeCropRectFromHandle,
  sizeFromScale,
  spriteMaskRectFromCropRect,
  unitFromPx,
  updateDisplaySize,
} from './imageAdjust'

describe('listCropRatios', () => {
  it('returns the supported ratios in product order', () => {
    expect(listCropRatios().map(item => item.label)).toEqual([
      '原比例',
      '1:1',
      '4:3',
      '3:4',
      '16:9',
      '9:16',
      '3:2',
      '2:3',
    ])
  })
})

describe('clampCropRect', () => {
  it('keeps the crop rect inside the image and preserves the ratio', () => {
    const next = clampCropRect(
      { x: 150, y: -10, width: 200, height: 200 },
      { width: 200, height: 100 },
      { width: 4, height: 3 },
    )

    expect(next.x).toBeGreaterThanOrEqual(0)
    expect(next.y).toBeGreaterThanOrEqual(0)
    expect(next.x + next.width).toBeLessThanOrEqual(200)
    expect(next.y + next.height).toBeLessThanOrEqual(100)
    expect(next.width / next.height).toBeCloseTo(4 / 3)
  })

  it('rejects non-positive crop size', () => {
    expect(() =>
      clampCropRect({ x: 0, y: 0, width: 0, height: 40 }, { width: 200, height: 100 }, { width: 1, height: 1 }),
    ).toThrow('crop size must be finite and positive')
  })
})

describe('createCenteredCropRect', () => {
  it('creates a centered crop for a fixed ratio', () => {
    expect(createCenteredCropRect({ width: 200, height: 100 }, { width: 1, height: 1 })).toEqual({
      x: 50,
      y: 0,
      width: 100,
      height: 100,
    })
  })
})

describe('resizeCropRectFromHandle', () => {
  const imageSize = { width: 200, height: 100 }
  const start = { x: 20, y: 10, width: 80, height: 40 }
  const ratio = { width: 2, height: 1 }

  it('keeps the opposite edge fixed and does not change the other dimension', () => {
    const east = resizeCropRectFromHandle(start, 'e', 20, 0, imageSize, ratio)
    expect(east.x).toBeCloseTo(20)
    expect(east.width).toBeCloseTo(100)
    expect(east.height).toBeCloseTo(40)
    expect(east.y).toBeCloseTo(10)

    const west = resizeCropRectFromHandle(start, 'w', -20, 0, imageSize, ratio)
    expect(west.x + west.width).toBeCloseTo(100)
    expect(west.width).toBeCloseTo(100)
    expect(west.height).toBeCloseTo(40)
    expect(west.y).toBeCloseTo(10)

    const south = resizeCropRectFromHandle(start, 's', 0, 20, imageSize, ratio)
    expect(south.y).toBeCloseTo(10)
    expect(south.height).toBeCloseTo(60)
    expect(south.width).toBeCloseTo(80)
    expect(south.x).toBeCloseTo(20)

    const north = resizeCropRectFromHandle(start, 'n', 0, -10, imageSize, ratio)
    expect(north.y + north.height).toBeCloseTo(50)
    expect(north.height).toBeCloseTo(50)
    expect(north.width).toBeCloseTo(80)
    expect(north.x).toBeCloseTo(20)
  })

  it('keeps the crop inside the image and preserves ratio from a corner handle', () => {
    const next = resizeCropRectFromHandle(start, 'se', 40, 30, imageSize, ratio)
    expect(next.x).toBe(20)
    expect(next.y).toBe(10)
    expect(next.width / next.height).toBeCloseTo(2)
    expect(next.x + next.width).toBeLessThanOrEqual(200)
    expect(next.y + next.height).toBeLessThanOrEqual(100)
  })
})

describe('spriteMaskRectFromCropRect', () => {
  it('places the mask around the visible crop center', () => {
    expect(spriteMaskRectFromCropRect({ x: 10, y: 20, width: 80, height: 40 })).toEqual({
      x: -40,
      y: -20,
      width: 80,
      height: 40,
    })
  })
})

describe('normalizeDegrees', () => {
  it('normalizes positive, negative, and full-turn angles', () => {
    expect(normalizeDegrees(450)).toBe(90)
    expect(normalizeDegrees(-90)).toBe(270)
    expect(normalizeDegrees(360)).toBe(0)
  })
})

describe('unitFromPx', () => {
  it('round-trips px, in, and cm at the default dpi', () => {
    const inch = unitFromPx(1200, 'in', DEFAULT_DOCUMENT_DPI)
    const cm = unitFromPx(1200, 'cm', DEFAULT_DOCUMENT_DPI)

    expect(unitFromPx(1200, 'px', DEFAULT_DOCUMENT_DPI)).toBe(1200)
    expect(inch).toBeCloseTo(12.5)
    expect(cm).toBeCloseTo(31.75)
  })
})

describe('updateDisplaySize', () => {
  it('keeps the aspect ratio when locked and allows independent edits when unlocked', () => {
    const lockedWidth = updateDisplaySize(
      { width: 1200, height: 800 },
      { width: 1200, height: 800 },
      'width',
      600,
      true,
    )
    expect(lockedWidth).toEqual({ width: 600, height: 400 })

    const lockedHeight = updateDisplaySize(
      { width: 1200, height: 800 },
      { width: 1200, height: 800 },
      'height',
      400,
      true,
    )
    expect(lockedHeight).toEqual({ width: 600, height: 400 })

    const unlocked = updateDisplaySize({ width: 1200, height: 800 }, { width: 1200, height: 800 }, 'width', 600, false)
    expect(unlocked).toEqual({ width: 600, height: 800 })
  })

  it('rejects invalid or oversized display sizes', () => {
    expect(() =>
      updateDisplaySize({ width: 1200, height: 800 }, { width: 1200, height: 800 }, 'width', 0, true),
    ).toThrow('display size must be finite and positive')
    expect(() =>
      updateDisplaySize({ width: 1200, height: 800 }, { width: 1200, height: 800 }, 'width', -1, true),
    ).toThrow('display size must be finite and positive')
    expect(() =>
      updateDisplaySize(
        { width: 1200, height: 800 },
        { width: 1200, height: 800 },
        'width',
        Number.POSITIVE_INFINITY,
        true,
      ),
    ).toThrow('display size must be finite and positive')
    expect(() =>
      updateDisplaySize(
        { width: MAX_IMAGE_EDGE, height: 800 },
        { width: MAX_IMAGE_EDGE, height: 800 },
        'width',
        MAX_IMAGE_EDGE + 1,
        false,
      ),
    ).toThrow(`display size must not exceed ${MAX_IMAGE_EDGE}`)
  })
})

describe('sizeFromScale', () => {
  it('uses visible crop size when crop exists', () => {
    expect(sizeFromScale({ width: 80, height: 60 }, { scaleX: 2, scaleY: 3 })).toEqual({ width: 160, height: 180 })
  })
})

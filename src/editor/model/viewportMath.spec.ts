import { describe, expect, it } from 'vitest'
import { createImageLayer } from './imageLayer'
import {
  clampViewportScale,
  fitViewportToBounds,
  imageLayerWorldBounds,
  panViewport,
  viewCenterToWorld,
  zoomViewportAt,
} from './viewportMath'

describe('clampViewportScale', () => {
  it('rejects non-finite or non-positive values and clamps to [0.1, 8]', () => {
    expect(() => clampViewportScale(Number.NaN)).toThrow()
    expect(() => clampViewportScale(Number.POSITIVE_INFINITY)).toThrow()
    expect(() => clampViewportScale(0)).toThrow()
    expect(() => clampViewportScale(-1)).toThrow()
    expect(clampViewportScale(0.05)).toBe(0.1)
    expect(clampViewportScale(10)).toBe(8)
    expect(clampViewportScale(1)).toBe(1)
  })
})

describe('zoomViewportAt', () => {
  it('keeps the same world point under the pointer after the scale change', () => {
    const next = zoomViewportAt({ x: 0, y: 0, scale: 1 }, 100, 50, 2)
    const worldBefore = { x: 100, y: 50 }
    const worldAfter = {
      x: (100 - next.x) / next.scale,
      y: (50 - next.y) / next.scale,
    }

    expect(next.scale).toBe(2)
    expect(worldAfter.x).toBeCloseTo(worldBefore.x)
    expect(worldAfter.y).toBeCloseTo(worldBefore.y)
  })
})

describe('fitViewportToBounds and panViewport', () => {
  it('places the bounds inside the view with padding and pans only x/y', () => {
    const fitted = fitViewportToBounds({ x: 0, y: 0, width: 200, height: 100 }, 400, 400)
    expect(fitted.scale).toBeCloseTo(1.8)
    expect(fitted.x).toBeCloseTo(20)
    expect(fitted.y).toBeCloseTo(110)

    const left = fitted.x
    const right = fitted.x + 200 * fitted.scale
    const top = fitted.y
    const bottom = fitted.y + 100 * fitted.scale
    expect(left).toBeGreaterThanOrEqual(0)
    expect(top).toBeGreaterThanOrEqual(0)
    expect(right).toBeLessThanOrEqual(400)
    expect(bottom).toBeLessThanOrEqual(400)

    const panned = panViewport({ x: 10, y: 20, scale: 2 }, 3, -4)
    expect(panned).toEqual({ x: 13, y: 16, scale: 2 })
  })
})

describe('viewCenterToWorld and imageLayerWorldBounds', () => {
  it('maps identity view center to (viewW/2, viewH/2) and uses anchor-0.5 size', () => {
    expect(viewCenterToWorld({ x: 0, y: 0, scale: 1 }, 400, 300)).toEqual({ x: 200, y: 150 })

    const layer = createImageLayer({
      id: 'layer-1',
      name: 'a.png',
      objectUrl: 'blob:http://localhost/1',
      naturalWidth: 80,
      naturalHeight: 60,
      transform: { x: 200, y: 150, scaleX: 1, scaleY: 1, rotation: 0 },
    })
    expect(imageLayerWorldBounds(layer)).toEqual({ x: 160, y: 120, width: 80, height: 60 })
  })
})

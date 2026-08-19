import { describe, expect, it } from 'vitest'
import { createImageLayer } from './imageLayer'
import {
  clampViewportScale,
  cropOverlayLayout,
  fitViewportToBounds,
  imageLayerWorldBounds,
  panViewport,
  rebaseTransformToVisibleCenter,
  screenDeltaToImageLocal,
  viewCenterToWorld,
  visibleImageAnchor,
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

  it('uses a rotated AABB so a 90° image swaps visual width and height', () => {
    const layer = createImageLayer({
      id: 'layer-1',
      name: 'a.png',
      objectUrl: 'blob:http://localhost/1',
      naturalWidth: 80,
      naturalHeight: 60,
      transform: { x: 200, y: 150, scaleX: 1, scaleY: 1, rotation: Math.PI / 2 },
    })

    expect(imageLayerWorldBounds(layer).width).toBeCloseTo(60)
    expect(imageLayerWorldBounds(layer).height).toBeCloseTo(80)
    expect(imageLayerWorldBounds(layer).x).toBeCloseTo(170)
    expect(imageLayerWorldBounds(layer).y).toBeCloseTo(110)
  })

  it('places an offset crop AABB on the cropped pixels after rebasing to the visible center', () => {
    const layer = createImageLayer({
      id: 'layer-1',
      name: 'a.png',
      objectUrl: 'blob:http://localhost/1',
      naturalWidth: 80,
      naturalHeight: 60,
      transform: { x: 200, y: 150, scaleX: 1, scaleY: 1, rotation: 0 },
    })
    const nextCrop = { x: 0, y: 0, width: 40, height: 60 }
    layer.transform = rebaseTransformToVisibleCenter(layer, nextCrop)
    layer.crop = nextCrop

    expect(layer.transform.x).toBeCloseTo(180)
    expect(layer.transform.y).toBeCloseTo(150)
    expect(imageLayerWorldBounds(layer)).toEqual({ x: 160, y: 120, width: 40, height: 60 })
  })

  it('rotates a cropped image around the visible center, not the original center', () => {
    const layer = createImageLayer({
      id: 'layer-1',
      name: 'a.png',
      objectUrl: 'blob:http://localhost/1',
      naturalWidth: 200,
      naturalHeight: 100,
      transform: { x: 100, y: 50, scaleX: 1, scaleY: 1, rotation: 0 },
    })
    const nextCrop = { x: 0, y: 0, width: 80, height: 100 }
    layer.transform = rebaseTransformToVisibleCenter(layer, nextCrop)
    layer.crop = nextCrop
    layer.transform = { ...layer.transform, rotation: Math.PI / 2 }

    const bounds = imageLayerWorldBounds(layer)
    expect(layer.transform.x).toBeCloseTo(40)
    expect(layer.transform.y).toBeCloseTo(50)
    expect(bounds.x + bounds.width / 2).toBeCloseTo(40)
    expect(bounds.y + bounds.height / 2).toBeCloseTo(50)
    expect(bounds.width).toBeCloseTo(100)
    expect(bounds.height).toBeCloseTo(80)
  })
})

describe('visibleImageAnchor', () => {
  it('puts the sprite anchor on the visible crop center', () => {
    const layer = createImageLayer({
      id: 'layer-1',
      name: 'a.png',
      objectUrl: 'blob:http://localhost/1',
      naturalWidth: 200,
      naturalHeight: 100,
    })
    layer.crop = { x: 0, y: 0, width: 80, height: 100 }
    expect(visibleImageAnchor(layer).x).toBeCloseTo(0.2)
    expect(visibleImageAnchor(layer).y).toBeCloseTo(0.5)
  })
})

describe('cropOverlayLayout and screenDeltaToImageLocal', () => {
  it('maps crop onto the unrotated image quad and reports rotation', () => {
    const layer = createImageLayer({
      id: 'layer-1',
      name: 'a.png',
      objectUrl: 'blob:http://localhost/1',
      naturalWidth: 200,
      naturalHeight: 100,
      transform: { x: 100, y: 50, scaleX: 1, scaleY: 1, rotation: Math.PI / 2 },
    })
    const layout = cropOverlayLayout(layer, { x: 50, y: 25, width: 100, height: 50 }, { x: 10, y: 20, scale: 2 })

    expect(layout.stageLeft).toBeCloseTo(10)
    expect(layout.stageTop).toBeCloseTo(20)
    expect(layout.stageWidth).toBeCloseTo(400)
    expect(layout.stageHeight).toBeCloseTo(200)
    expect(layout.rotationDeg).toBeCloseTo(90)
    expect(layout.boxLeft).toBeCloseTo(100)
    expect(layout.boxTop).toBeCloseTo(50)
    expect(layout.boxWidth).toBeCloseTo(200)
    expect(layout.boxHeight).toBeCloseTo(100)
  })

  it('maps a committed crop as the working image so the box can fill the new picture', () => {
    const layer = createImageLayer({
      id: 'layer-1',
      name: 'a.png',
      objectUrl: 'blob:http://localhost/1',
      naturalWidth: 200,
      naturalHeight: 100,
      transform: { x: 100, y: 50, scaleX: 1, scaleY: 1, rotation: 0 },
    })
    layer.crop = { x: 50, y: 0, width: 100, height: 100 }
    const layout = cropOverlayLayout(layer, layer.crop, { x: 0, y: 0, scale: 1 })

    expect(layout.stageLeft).toBeCloseTo(50)
    expect(layout.stageTop).toBeCloseTo(0)
    expect(layout.stageWidth).toBeCloseTo(100)
    expect(layout.stageHeight).toBeCloseTo(100)
    expect(layout.boxLeft).toBeCloseTo(0)
    expect(layout.boxTop).toBeCloseTo(0)
    expect(layout.boxWidth).toBeCloseTo(100)
    expect(layout.boxHeight).toBeCloseTo(100)
  })

  it('converts a screen drag into image-local delta after 90° rotation', () => {
    const local = screenDeltaToImageLocal(10, 0, Math.PI / 2, false, false)
    expect(local.x).toBeCloseTo(0)
    expect(local.y).toBeCloseTo(-10)
  })
})

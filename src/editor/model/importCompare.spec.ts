import { describe, expect, it } from 'vitest'
import { createImageLayer } from './imageLayer'
import { deriveImportCompareAppearance } from './importCompare'

describe('deriveImportCompareAppearance', () => {
  it('keeps the visible-center world anchor and strips crop, rotation, flip, and resize scale', () => {
    const layer = createImageLayer({
      id: 'a',
      name: 'a.png',
      objectUrl: 'blob:http://localhost/a',
      naturalWidth: 200,
      naturalHeight: 100,
      transform: { x: 40, y: 50, scaleX: 2, scaleY: 1.5, rotation: Math.PI / 2 },
    })
    layer.crop = { x: 0, y: 0, width: 80, height: 100 }
    layer.flipX = true
    layer.flipY = true

    const appearance = deriveImportCompareAppearance(layer)

    expect(appearance.transform).toEqual({
      x: 40,
      y: 50,
      scaleX: 1,
      scaleY: 1,
      rotation: 0,
    })
    expect(appearance.crop).toBeUndefined()
    expect(appearance.flipX).toBe(false)
    expect(appearance.flipY).toBe(false)
  })

  it('does not mutate the source layer', () => {
    const layer = createImageLayer({
      id: 'a',
      name: 'a.png',
      objectUrl: 'blob:http://localhost/a',
      naturalWidth: 200,
      naturalHeight: 100,
      transform: { x: 10, y: 20, scaleX: 3, scaleY: 4, rotation: 0.4 },
    })
    layer.crop = { x: 10, y: 10, width: 50, height: 50 }
    layer.flipX = true

    deriveImportCompareAppearance(layer)

    expect(layer.transform).toEqual({ x: 10, y: 20, scaleX: 3, scaleY: 4, rotation: 0.4 })
    expect(layer.crop).toEqual({ x: 10, y: 10, width: 50, height: 50 })
    expect(layer.flipX).toBe(true)
  })
})

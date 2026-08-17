import { describe, expect, it } from 'vitest'
import { centerImageTransform, createImageLayer } from './imageLayer'

describe('createImageLayer', () => {
  it('stores objectUrl, natural size, and identity-scale transform fields', () => {
    const layer = createImageLayer({
      id: 'layer-1',
      name: 'cat.png',
      objectUrl: 'blob:http://localhost/1',
      naturalWidth: 800,
      naturalHeight: 600,
    })

    expect(layer.kind).toBe('image')
    expect(layer.objectUrl).toBe('blob:http://localhost/1')
    expect(layer.naturalWidth).toBe(800)
    expect(layer.naturalHeight).toBe(600)
    expect(layer.visible).toBe(true)
    expect(layer.locked).toBe(false)
    expect(layer.transform.scaleX).toBe(1)
    expect(layer.transform.scaleY).toBe(1)
    expect(layer.transform.rotation).toBe(0)
  })
})

describe('centerImageTransform', () => {
  it('places x/y at the view center with scale 1 and rotation 0', () => {
    const transform = centerImageTransform(400, 300)

    expect(transform.x).toBe(200)
    expect(transform.y).toBe(150)
    expect(transform.scaleX).toBe(1)
    expect(transform.scaleY).toBe(1)
    expect(transform.rotation).toBe(0)
  })
})

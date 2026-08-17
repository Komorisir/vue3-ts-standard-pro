import { createPinia, setActivePinia } from 'pinia'
import { describe, expect, it, vi } from 'vitest'
import { createImageLayer } from '@/editor/model/imageLayer'
import { useEditorStore } from './editor'

function makeLayer(id: string, objectUrl: string) {
  return createImageLayer({
    id,
    name: `${id}.png`,
    objectUrl,
    naturalWidth: 10,
    naturalHeight: 10,
  })
}

describe('useEditorStore', () => {
  it('addImageLayer replaces the previous main image and does not hold DisplayObject', () => {
    setActivePinia(createPinia())
    const revoke = vi.spyOn(URL, 'revokeObjectURL')
    const store = useEditorStore()
    const first = makeLayer('layer-a', 'blob:http://localhost/a')
    const second = makeLayer('layer-b', 'blob:http://localhost/b')

    store.addImageLayer(first)
    store.addImageLayer(second)

    expect(store.layers.map(layer => layer.id)).toEqual(['layer-b'])
    expect(store.layers).toHaveLength(1)
    expect(revoke).toHaveBeenCalledWith('blob:http://localhost/a')
    expect(store.layers.every(layer => !('parent' in layer) && !('texture' in layer))).toBe(true)

    revoke.mockRestore()
  })

  it('panBy and zoomAt update viewport without changing layer transforms, and fitView with no layers resets identity', () => {
    setActivePinia(createPinia())
    const store = useEditorStore()

    store.panBy(8, 2)
    store.fitView()
    expect(store.viewport).toEqual({ x: 0, y: 0, scale: 1 })

    const layer = makeLayer('layer-a', 'blob:http://localhost/a')
    store.addImageLayer(layer)
    const transformBefore = { ...store.layers[0]!.transform }

    store.panBy(10, -4)
    expect(store.viewport).toEqual({ x: 10, y: -4, scale: 1 })
    expect(store.layers[0]!.transform).toEqual(transformBefore)

    store.zoomAt(100, 50, 2)
    expect(store.viewport.scale).toBe(2)
    expect(store.layers[0]!.transform).toEqual(transformBefore)
  })

  it('addImageLayer fits the main image into the current view size without changing the layer transform', () => {
    setActivePinia(createPinia())
    const store = useEditorStore()
    store.setViewSize(400, 400)
    const layer = createImageLayer({
      id: 'a',
      name: 'a.png',
      objectUrl: 'blob:http://localhost/a',
      naturalWidth: 200,
      naturalHeight: 100,
      transform: { x: 100, y: 50, scaleX: 1, scaleY: 1, rotation: 0 },
    })

    store.addImageLayer(layer)

    expect(store.viewport.scale).toBeCloseTo(1.8)
    expect(store.viewport.x).toBeCloseTo(20)
    expect(store.viewport.y).toBeCloseTo(110)
    expect(store.layers[0]!.transform).toEqual({
      x: 100,
      y: 50,
      scaleX: 1,
      scaleY: 1,
      rotation: 0,
    })
  })

  it('setViewSize with a main image fits the new host, and the same size does not undo pan', () => {
    setActivePinia(createPinia())
    const store = useEditorStore()
    store.setViewSize(400, 400)
    store.addImageLayer(
      createImageLayer({
        id: 'a',
        name: 'a.png',
        objectUrl: 'blob:http://localhost/a',
        naturalWidth: 200,
        naturalHeight: 100,
        transform: { x: 100, y: 50, scaleX: 1, scaleY: 1, rotation: 0 },
      }),
    )
    const transformBefore = { ...store.layers[0]!.transform }

    store.panBy(12, 0)
    store.setViewSize(400, 400)
    expect(store.viewport.x).toBeCloseTo(32)
    expect(store.layers[0]!.transform).toEqual(transformBefore)

    store.setViewSize(800, 400)
    expect(store.viewport.scale).toBeCloseTo(3.6)
    expect(store.viewport.x).toBeCloseTo(40)
    expect(store.viewport.y).toBeCloseTo(20)
    expect(store.layers[0]!.transform).toEqual(transformBefore)
  })
})

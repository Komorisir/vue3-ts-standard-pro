import { createPinia, setActivePinia } from 'pinia'
import { describe, expect, it, vi } from 'vitest'
import { createImageLayer } from '@/editor/model/imageLayer'
import { cropOverlayLayout } from '@/editor/model/viewportMath'
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

  it('no-ops adjust actions when there is no main image', () => {
    setActivePinia(createPinia())
    const store = useEditorStore()

    store.beginCropSession()
    store.previewCrop({ x: 0, y: 0, width: 10, height: 10 })
    store.commitCropSession()
    store.rotateMainByDegrees(90)
    store.flipMain('x')
    store.beginAngleEdit()
    store.previewAngleDegrees(45)
    store.commitAngleEdit()
    store.beginResizeEdit()
    store.commitResizeEdit()

    expect(store.layers).toEqual([])
    expect(store.canUndo).toBe(false)
  })

  it('commits rotate and flip as separate undoable commands', () => {
    setActivePinia(createPinia())
    const store = useEditorStore()
    store.addImageLayer(makeLayer('layer-a', 'blob:http://localhost/a'))

    store.rotateMainByDegrees(90)
    store.flipMain('x')

    expect(store.canUndo).toBe(true)
    expect(store.layers[0]!.transform.rotation).toBeCloseTo(Math.PI / 2)
    expect(store.layers[0]!.flipX).toBe(true)

    store.undo()
    expect(store.layers[0]!.transform.rotation).toBeCloseTo(Math.PI / 2)
    expect(store.layers[0]!.flipX).toBe(false)

    store.undo()
    expect(store.layers[0]!.transform.rotation).toBe(0)
    expect(store.canRedo).toBe(true)
  })

  it('commits angle and resize once from preview state', () => {
    setActivePinia(createPinia())
    const store = useEditorStore()
    store.addImageLayer(
      createImageLayer({
        id: 'a',
        name: 'a.png',
        objectUrl: 'blob:http://localhost/a',
        naturalWidth: 1200,
        naturalHeight: 800,
      }),
    )

    store.beginAngleEdit()
    store.previewAngleDegrees(450)
    expect(store.layers[0]!.transform.rotation).toBeCloseTo(Math.PI / 2)
    store.commitAngleEdit()

    store.beginResizeEdit()
    store.previewDisplaySize('width', 600, true)
    expect(store.mainImageDisplaySize).toEqual({ width: 600, height: 400 })
    store.commitResizeEdit()

    store.undo()
    expect(store.mainImageDisplaySize).toEqual({ width: 1200, height: 800 })
    store.undo()
    expect(store.layers[0]!.transform.rotation).toBe(0)
  })

  it('restores the previous crop on cancel and commits crop on confirm', () => {
    setActivePinia(createPinia())
    const store = useEditorStore()
    store.addImageLayer(
      createImageLayer({
        id: 'a',
        name: 'a.png',
        objectUrl: 'blob:http://localhost/a',
        naturalWidth: 1200,
        naturalHeight: 800,
      }),
    )

    store.beginCropSession()
    store.previewCrop({ x: 100, y: 100, width: 400, height: 400 })
    store.cancelCropSession()
    expect(store.layers[0]!.crop).toBeUndefined()

    store.beginCropSession()
    store.previewCrop({ x: 100, y: 100, width: 400, height: 400 })
    store.commitCropSession()
    expect(store.layers[0]!.crop).toEqual({ x: 100, y: 100, width: 400, height: 400 })

    store.undo()
    expect(store.layers[0]!.crop).toBeUndefined()
  })

  it('refits the viewport after rotate and after crop commit, and remaps crop draft after rotate', () => {
    setActivePinia(createPinia())
    const store = useEditorStore()
    store.setViewSize(400, 200)
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
    expect(store.viewport.scale).toBeCloseTo(1.8)

    store.rotateMainByDegrees(90)
    expect(store.layers[0]!.transform.rotation).toBeCloseTo(Math.PI / 2)
    expect(store.viewport.scale).toBeCloseTo(0.9)

    store.beginCropSession()
    expect(store.cropSessionDraft).toEqual({ x: 0, y: 0, width: 200, height: 100 })
    store.cancelCropSession()

    store.beginCropSession()
    store.previewCrop({ x: 50, y: 0, width: 100, height: 100 })
    store.commitCropSession()
    expect(store.layers[0]!.crop).toEqual({ x: 50, y: 0, width: 100, height: 100 })
    expect(store.viewport.scale).toBeCloseTo(1.8)

    store.beginCropSession()
    expect(store.cropSessionDraft).toEqual({ x: 50, y: 0, width: 100, height: 100 })
    const recropLayout = cropOverlayLayout(store.layers[0]!, store.cropSessionDraft!, store.viewport)
    expect(recropLayout.boxLeft).toBeCloseTo(0)
    expect(recropLayout.boxTop).toBeCloseTo(0)
    expect(recropLayout.boxWidth).toBeCloseTo(recropLayout.stageWidth)
    expect(recropLayout.boxHeight).toBeCloseTo(recropLayout.stageHeight)
  })

  it('rebases transform to the cropped image center so later rotate spins around that center', () => {
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

    store.beginCropSession()
    store.previewCrop({ x: 0, y: 0, width: 80, height: 100 })
    store.commitCropSession()
    expect(store.layers[0]!.transform.x).toBeCloseTo(40)
    expect(store.layers[0]!.transform.y).toBeCloseTo(50)

    store.rotateMainByDegrees(90)
    expect(store.layers[0]!.transform.rotation).toBeCloseTo(Math.PI / 2)
    expect(store.layers[0]!.transform.x).toBeCloseTo(40)
    expect(store.layers[0]!.transform.y).toBeCloseTo(50)
    expect(store.viewport.scale).toBeCloseTo(3.6)
  })

  it('places a new ratio box inside the current visible crop', () => {
    setActivePinia(createPinia())
    const store = useEditorStore()
    store.addImageLayer(
      createImageLayer({
        id: 'a',
        name: 'a.png',
        objectUrl: 'blob:http://localhost/a',
        naturalWidth: 1200,
        naturalHeight: 800,
      }),
    )
    store.beginCropSession()
    store.previewCrop({ x: 100, y: 100, width: 600, height: 400 })
    store.commitCropSession()

    store.beginCropSession()
    store.selectCropRatio({ width: 1, height: 1 })
    expect(store.cropSessionDraft).toEqual({ x: 200, y: 100, width: 400, height: 400 })
  })

  it('setComparingOriginal is ignored without a main image and resets on replace', () => {
    setActivePinia(createPinia())
    const store = useEditorStore()

    store.setComparingOriginal(true)
    expect(store.isComparingOriginal).toBe(false)

    store.addImageLayer(makeLayer('layer-a', 'blob:http://localhost/a'))
    store.setComparingOriginal(true)
    expect(store.isComparingOriginal).toBe(true)

    store.setComparingOriginal(false)
    expect(store.isComparingOriginal).toBe(false)
  })

  it('addImageLayer clears the adjust command stack, compare preview, and crop session', () => {
    setActivePinia(createPinia())
    const revoke = vi.spyOn(URL, 'revokeObjectURL')
    const store = useEditorStore()
    store.addImageLayer(makeLayer('layer-a', 'blob:http://localhost/a'))
    store.rotateMainByDegrees(90)
    store.beginCropSession()
    store.setComparingOriginal(true)

    expect(store.canUndo).toBe(true)
    expect(store.isCropSessionActive).toBe(true)
    expect(store.isComparingOriginal).toBe(true)

    store.addImageLayer(makeLayer('layer-b', 'blob:http://localhost/b'))

    expect(store.layers.map(layer => layer.id)).toEqual(['layer-b'])
    expect(store.canUndo).toBe(false)
    expect(store.canRedo).toBe(false)
    expect(store.isComparingOriginal).toBe(false)
    expect(store.isCropSessionActive).toBe(false)
    expect(store.layers[0]!.transform.rotation).toBe(0)

    revoke.mockRestore()
  })
})

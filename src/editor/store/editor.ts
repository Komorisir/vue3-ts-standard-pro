/**
 * 编辑器文档 store。
 * 保存图层、视口变换与当前工具；不持有 Application 或 DisplayObject。
 */
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { StoreEnum } from '@/constants/enum/store'
import { createCommandStack } from '@/editor/history/commandStack'
import {
  createCenteredCropRect,
  normalizeDegrees,
  scaleFromSize,
  sizeFromScale,
  updateDisplaySize,
} from '@/editor/model/imageAdjust'
import type { CropRect, EditorToolId, ImageLayer, ViewportState } from '@/editor/model/types'
import {
  fitViewportToBounds,
  IDENTITY_VIEWPORT,
  imageLayerWorldBounds,
  panViewport,
  rebaseTransformToVisibleCenter,
  zoomViewportAt,
} from '@/editor/model/viewportMath'

function revokeObjectUrl(url: string): void {
  if (!url.startsWith('blob:')) {
    return
  }
  try {
    URL.revokeObjectURL(url)
  } catch (error) {
    console.error('useEditorStore: revokeObjectURL failed', error)
  }
}

/**
 * 编辑器文档。主图仅一张；视口与图层变换分离。
 *
 * @returns 图层、视口、工具与文档 actions
 */
export const useEditorStore = defineStore(StoreEnum.EDITOR, () => {
  const layers = ref<ImageLayer[]>([])
  const viewWidth = ref(0)
  const viewHeight = ref(0)
  const viewport = ref<ViewportState>({ ...IDENTITY_VIEWPORT })
  const activeTool = ref<EditorToolId | null>(null)
  const spacePan = ref(false)
  const cropSessionStart = ref<CropRect | undefined | null>(null)
  const cropSessionDraft = ref<CropRect | null>(null)
  const cropSessionTouched = ref(false)
  const cropSessionRatio = ref<{ width: number; height: number } | null>(null)
  const angleEditStart = ref<number | null>(null)
  const resizeEditStart = ref<{ width: number; height: number } | null>(null)
  const historyVersion = ref(0)
  const commandStack = createCommandStack()

  const isViewportReady = computed(() => viewWidth.value > 0 && viewHeight.value > 0)
  const isPanMode = computed(() => activeTool.value === 'pan' || spacePan.value)
  const mainImage = computed(() => layers.value[0] ?? null)
  const canUndo = computed(() => {
    void historyVersion.value
    return commandStack.canUndo
  })
  const canRedo = computed(() => {
    void historyVersion.value
    return commandStack.canRedo
  })
  const mainImageDisplaySize = computed(() => {
    const main = mainImage.value
    if (!main) {
      return null
    }
    return getMainDisplaySize(main)
  })
  const isCropSessionActive = computed(() => cropSessionStart.value !== null)

  /**
   * 将主图设为这一张。若已有主图，替换并释放旧 objectURL。
   * 有可见尺寸时自动适配 host，使整张主图落在可见区域内。
   *
   * @param layer 已创建的图片图层（不含 DisplayObject）
   */
  function addImageLayer(layer: ImageLayer): void {
    const previous = layers.value
    layers.value = [layer]
    for (const existing of previous) {
      if (existing.objectUrl !== layer.objectUrl) {
        revokeObjectUrl(existing.objectUrl)
      }
    }
    fitView()
  }

  function pushImageCommand(before: ImageLayer, after: ImageLayer, refitView = false): void {
    commandStack.push({
      execute() {
        replaceMainImage(cloneImageLayer(after))
        if (refitView) {
          fitView()
        }
      },
      undo() {
        replaceMainImage(cloneImageLayer(before))
        if (refitView) {
          fitView()
        }
      },
      redo() {
        replaceMainImage(cloneImageLayer(after))
        if (refitView) {
          fitView()
        }
      },
    })
    historyVersion.value += 1
  }

  function replaceMainImage(next: ImageLayer): void {
    if (layers.value.length === 0) {
      return
    }
    layers.value = [next]
  }

  /**
   * 记录当前可见区域尺寸，供导入放置与适配使用。
   * 尺寸相对上次有变化且已有主图时，自动适配到新的 host。
   *
   * @param width CSS 像素宽
   * @param height CSS 像素高
   */
  function setViewSize(width: number, height: number): void {
    if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) {
      return
    }
    if (width === viewWidth.value && height === viewHeight.value) {
      return
    }
    viewWidth.value = width
    viewHeight.value = height
    if (layers.value.length > 0) {
      fitView()
    }
  }

  /**
   * 按屏幕像素平移视口，不改图层 transform。
   *
   * @param dx 屏幕位移 X
   * @param dy 屏幕位移 Y
   */
  function panBy(dx: number, dy: number): void {
    if (!Number.isFinite(dx) || !Number.isFinite(dy)) {
      return
    }
    viewport.value = panViewport(viewport.value, dx, dy)
  }

  /**
   * 以指针为锚点缩放视口。
   *
   * @param pointerX 相对 host 的 X
   * @param pointerY 相对 host 的 Y
   * @param factor 缩放倍率
   */
  function zoomAt(pointerX: number, pointerY: number, factor: number): void {
    try {
      viewport.value = zoomViewportAt(viewport.value, pointerX, pointerY, factor)
    } catch (error) {
      console.error('useEditorStore: zoomAt failed', error)
    }
  }

  /**
   * 适配主图到可见区域；无图时回到单位视口。
   */
  function fitView(): void {
    const main = layers.value[0]
    if (!main || viewWidth.value <= 0 || viewHeight.value <= 0) {
      viewport.value = { ...IDENTITY_VIEWPORT }
      return
    }
    try {
      viewport.value = fitViewportToBounds(imageLayerWorldBounds(main), viewWidth.value, viewHeight.value)
    } catch (error) {
      console.error('useEditorStore: fitView failed', error)
    }
  }

  /**
   * 设置持久工具；`null` 表示未选工具。
   *
   * @param tool 工具 id 或空
   */
  function setActiveTool(tool: EditorToolId | null): void {
    activeTool.value = tool
  }

  /**
   * 空格暂切平移。不改变 `activeTool`。
   *
   * @param active 是否按住空格
   */
  function setSpacePan(active: boolean): void {
    spacePan.value = active
  }

  function setMainCrop(crop?: CropRect): void {
    const main = mainImage.value
    if (!main) {
      return
    }
    replaceMainImage({
      ...cloneImageLayer(main),
      crop: crop ? { ...crop } : undefined,
    })
  }

  function beginCropSession(): void {
    const main = mainImage.value
    if (!main) {
      cropSessionStart.value = null
      return
    }
    cropSessionStart.value = cloneCropRect(main.crop)
    cropSessionRatio.value = null
    cropSessionDraft.value =
      cloneCropRect(main.crop) ??
      createCenteredCropRect({
        width: main.naturalWidth,
        height: main.naturalHeight,
      })
    cropSessionTouched.value = false
  }

  function previewCrop(crop: CropRect): void {
    if (cropSessionStart.value === null) {
      return
    }
    cropSessionDraft.value = { ...crop }
    cropSessionTouched.value = true
  }

  function commitCropSession(): void {
    const main = mainImage.value
    if (!main || cropSessionStart.value === null) {
      return
    }
    if (!cropSessionTouched.value) {
      cropSessionStart.value = null
      cropSessionDraft.value = null
      cropSessionRatio.value = null
      return
    }
    const before = cloneImageLayer({ ...main, crop: cloneCropRect(cropSessionStart.value) ?? undefined })
    const after = cloneImageLayer(main)
    const nextCrop = cloneCropRect(cropSessionDraft.value) ?? undefined
    after.transform = rebaseTransformToVisibleCenter(main, nextCrop)
    after.crop = nextCrop
    cropSessionStart.value = null
    cropSessionDraft.value = null
    cropSessionTouched.value = false
    if (sameImageAdjustState(before, after)) {
      return
    }
    pushImageCommand(before, after, true)
  }

  function cancelCropSession(): void {
    const main = mainImage.value
    if (!main || cropSessionStart.value === null) {
      return
    }
    replaceMainImage({
      ...cloneImageLayer(main),
      crop: cloneCropRect(cropSessionStart.value) ?? undefined,
    })
    cropSessionStart.value = null
    cropSessionDraft.value = null
    cropSessionTouched.value = false
    cropSessionRatio.value = null
  }

  function selectCropRatio(ratio?: { width: number; height: number }): void {
    const main = mainImage.value
    if (!main || cropSessionStart.value === null) {
      return
    }
    cropSessionRatio.value = ratio ? { ...ratio } : null
    const working = {
      x: main.crop?.x ?? 0,
      y: main.crop?.y ?? 0,
      width: main.crop?.width ?? main.naturalWidth,
      height: main.crop?.height ?? main.naturalHeight,
    }
    const local = createCenteredCropRect({ width: working.width, height: working.height }, ratio)
    cropSessionDraft.value = {
      x: working.x + local.x,
      y: working.y + local.y,
      width: local.width,
      height: local.height,
    }
    cropSessionTouched.value = true
  }

  function rotateMainByDegrees(deltaDegrees: number): void {
    const main = mainImage.value
    if (!main) {
      return
    }
    const currentDegrees = radiansToDegrees(main.transform.rotation)
    const nextDegrees = normalizeDegrees(currentDegrees + deltaDegrees)
    const before = cloneImageLayer(main)
    const after = cloneImageLayer(main)
    after.transform.rotation = degreesToRadians(nextDegrees)
    pushImageCommand(before, after, true)
  }

  function beginAngleEdit(): void {
    const main = mainImage.value
    angleEditStart.value = main ? radiansToDegrees(main.transform.rotation) : null
  }

  function previewAngleDegrees(nextDegrees: number): void {
    const main = mainImage.value
    if (!main) {
      return
    }
    const next = cloneImageLayer(main)
    next.transform.rotation = degreesToRadians(normalizeDegrees(nextDegrees))
    replaceMainImage(next)
    fitView()
  }

  function commitAngleEdit(): void {
    const main = mainImage.value
    if (!main || angleEditStart.value == null) {
      return
    }
    const before = cloneImageLayer(main)
    before.transform.rotation = degreesToRadians(normalizeDegrees(angleEditStart.value))
    const after = cloneImageLayer(main)
    angleEditStart.value = null
    if (sameImageAdjustState(before, after)) {
      return
    }
    pushImageCommand(before, after, true)
  }

  function flipMain(axis: 'x' | 'y'): void {
    const main = mainImage.value
    if (!main) {
      return
    }
    const before = cloneImageLayer(main)
    const after = cloneImageLayer(main)
    if (axis === 'x') {
      after.flipX = !after.flipX
    } else {
      after.flipY = !after.flipY
    }
    pushImageCommand(before, after, true)
  }

  function beginResizeEdit(): void {
    resizeEditStart.value = mainImageDisplaySize.value ? { ...mainImageDisplaySize.value } : null
  }

  function previewDisplaySize(field: 'width' | 'height', nextValue: number, locked: boolean): void {
    const main = mainImage.value
    const currentSize = mainImageDisplaySize.value
    const baseSize = resizeEditStart.value
    if (!main || !currentSize || !baseSize) {
      return
    }
    const nextSize = updateDisplaySize(currentSize, baseSize, field, nextValue, locked)
    const scale = scaleFromSize(getVisibleNaturalSize(main), nextSize)
    const next = cloneImageLayer(main)
    next.transform.scaleX = scale.scaleX
    next.transform.scaleY = scale.scaleY
    replaceMainImage(next)
  }

  function commitResizeEdit(): void {
    const main = mainImage.value
    const baseSize = resizeEditStart.value
    if (!main || !baseSize) {
      return
    }
    const before = cloneImageLayer(main)
    const beforeScale = scaleFromSize(getVisibleNaturalSize(before), baseSize)
    before.transform.scaleX = beforeScale.scaleX
    before.transform.scaleY = beforeScale.scaleY
    const after = cloneImageLayer(main)
    resizeEditStart.value = null
    if (sameImageAdjustState(before, after)) {
      return
    }
    pushImageCommand(before, after)
  }

  function undo(): void {
    commandStack.undo()
    historyVersion.value += 1
  }

  function redo(): void {
    commandStack.redo()
    historyVersion.value += 1
  }

  /**
   * 释放 blob URL 并清空文档与视口；离开编辑页时调用。
   */
  function resetSession(): void {
    for (const layer of layers.value) {
      revokeObjectUrl(layer.objectUrl)
    }
    layers.value = []
    viewWidth.value = 0
    viewHeight.value = 0
    viewport.value = { ...IDENTITY_VIEWPORT }
    activeTool.value = null
    spacePan.value = false
    cropSessionStart.value = null
    cropSessionDraft.value = null
    cropSessionTouched.value = false
    cropSessionRatio.value = null
    angleEditStart.value = null
    resizeEditStart.value = null
    commandStack.clear()
    historyVersion.value += 1
  }

  return {
    layers,
    viewWidth,
    viewHeight,
    viewport,
    activeTool,
    spacePan,
    mainImage,
    mainImageDisplaySize,
    cropSessionDraft,
    isCropSessionActive,
    isViewportReady,
    isPanMode,
    canUndo,
    canRedo,
    addImageLayer,
    setViewSize,
    panBy,
    zoomAt,
    fitView,
    setActiveTool,
    setSpacePan,
    setMainCrop,
    beginCropSession,
    previewCrop,
    commitCropSession,
    cancelCropSession,
    selectCropRatio,
    rotateMainByDegrees,
    beginAngleEdit,
    previewAngleDegrees,
    commitAngleEdit,
    flipMain,
    beginResizeEdit,
    previewDisplaySize,
    commitResizeEdit,
    undo,
    redo,
    resetSession,
  }
})

function cloneImageLayer(layer: ImageLayer): ImageLayer {
  return {
    ...layer,
    crop: cloneCropRect(layer.crop) ?? undefined,
    transform: {
      ...layer.transform,
    },
  }
}

function cloneCropRect(crop?: CropRect | null): CropRect | null | undefined {
  if (crop === undefined) {
    return undefined
  }
  if (crop === null) {
    return null
  }
  return { ...crop }
}

function sameImageAdjustState(left: ImageLayer, right: ImageLayer): boolean {
  return (
    left.transform.x === right.transform.x &&
    left.transform.y === right.transform.y &&
    left.transform.scaleX === right.transform.scaleX &&
    left.transform.scaleY === right.transform.scaleY &&
    left.transform.rotation === right.transform.rotation &&
    left.flipX === right.flipX &&
    left.flipY === right.flipY &&
    left.crop?.x === right.crop?.x &&
    left.crop?.y === right.crop?.y &&
    left.crop?.width === right.crop?.width &&
    left.crop?.height === right.crop?.height
  )
}

function getVisibleNaturalSize(layer: ImageLayer): { width: number; height: number } {
  return {
    width: layer.crop?.width ?? layer.naturalWidth,
    height: layer.crop?.height ?? layer.naturalHeight,
  }
}

function getMainDisplaySize(layer: ImageLayer): { width: number; height: number } {
  return sizeFromScale(getVisibleNaturalSize(layer), {
    scaleX: layer.transform.scaleX,
    scaleY: layer.transform.scaleY,
  })
}

function radiansToDegrees(radians: number): number {
  return (radians * 180) / Math.PI
}

function degreesToRadians(degrees: number): number {
  return (degrees * Math.PI) / 180
}

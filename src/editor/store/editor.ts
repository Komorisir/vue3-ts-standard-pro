/**
 * 编辑器文档 store。
 * 保存图层、视口变换与当前工具；不持有 Application 或 DisplayObject。
 */
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { StoreEnum } from '@/constants/enum/store'
import type { EditorToolId, ImageLayer, ViewportState } from '@/editor/model/types'
import {
  fitViewportToBounds,
  IDENTITY_VIEWPORT,
  imageLayerWorldBounds,
  panViewport,
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

  const isViewportReady = computed(() => viewWidth.value > 0 && viewHeight.value > 0)
  const isPanMode = computed(() => activeTool.value === 'pan' || spacePan.value)

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
  }

  return {
    layers,
    viewWidth,
    viewHeight,
    viewport,
    activeTool,
    spacePan,
    isViewportReady,
    isPanMode,
    addImageLayer,
    setViewSize,
    panBy,
    zoomAt,
    fitView,
    setActiveTool,
    setSpacePan,
    resetSession,
  }
})

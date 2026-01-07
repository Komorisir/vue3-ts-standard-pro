import { ref, type Ref } from 'vue'
import type { Editor } from '@/editor'

/**
 * 画布操作 Hook
 * 提供画布相关的操作方法
 */
export function useCanvas(editor: Ref<Editor | null>) {
  const zoom = ref(1)
  const panX = ref(0)
  const panY = ref(0)

  /**
   * 设置缩放
   */
  const setZoom = (value: number) => {
    if (!editor.value) return
    zoom.value = Math.max(0.1, Math.min(10, value))
    // TODO: 实现缩放逻辑（需要 ViewportManager）
  }

  /**
   * 放大
   */
  const zoomIn = () => {
    setZoom(zoom.value * 1.2)
  }

  /**
   * 缩小
   */
  const zoomOut = () => {
    setZoom(zoom.value / 1.2)
  }

  /**
   * 重置缩放
   */
  const zoomReset = () => {
    setZoom(1)
  }

  /**
   * 适应画布
   */
  const fitCanvas = () => {
    if (!editor.value) return
    // TODO: 实现适应画布逻辑
  }

  /**
   * 设置平移
   */
  const setPan = (x: number, y: number) => {
    if (!editor.value) return
    panX.value = x
    panY.value = y
    // TODO: 实现平移逻辑（需要 ViewportManager）
  }

  return {
    zoom,
    panX,
    panY,
    setZoom,
    zoomIn,
    zoomOut,
    zoomReset,
    fitCanvas,
    setPan,
  }
}

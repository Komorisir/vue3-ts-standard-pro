/**
 * 视口平移 / 缩放 / 适配的纯函数。
 * 不读写 store，不创建 DisplayObject。
 */
import { clamp } from '@/shared/math/clamp'
import type { ImageLayer, ViewportState, WorldRect } from './types'

export const VIEWPORT_SCALE_MIN = 0.1
export const VIEWPORT_SCALE_MAX = 8
export const VIEWPORT_FIT_PADDING = 0.9

export const IDENTITY_VIEWPORT: ViewportState = { x: 0, y: 0, scale: 1 }

/**
 * 将视口缩放限制在 [0.1, 8]。
 *
 * @param scale 待限制的缩放
 * @returns 落在允许区间内的缩放
 * @throws 当 scale 不是正有限数
 */
export function clampViewportScale(scale: number): number {
  if (!Number.isFinite(scale) || scale <= 0) {
    throw new Error('clampViewportScale: scale must be finite and positive')
  }
  return clamp(scale, VIEWPORT_SCALE_MIN, VIEWPORT_SCALE_MAX)
}

/**
 * 平移视口，不改变缩放。
 *
 * @param viewport 当前视口
 * @param dx 屏幕像素位移 X
 * @param dy 屏幕像素位移 Y
 * @returns 新的视口状态
 */
export function panViewport(viewport: ViewportState, dx: number, dy: number): ViewportState {
  return {
    x: viewport.x + dx,
    y: viewport.y + dy,
    scale: viewport.scale,
  }
}

/**
 * 以屏幕指针为锚点缩放视口，使指针下的世界点保持不动。
 *
 * @param viewport 当前视口
 * @param pointerX 相对 host 的指针 X
 * @param pointerY 相对 host 的指针 Y
 * @param factor 缩放倍率（>1 放大）
 * @returns 新的视口状态
 */
export function zoomViewportAt(
  viewport: ViewportState,
  pointerX: number,
  pointerY: number,
  factor: number,
): ViewportState {
  const worldX = (pointerX - viewport.x) / viewport.scale
  const worldY = (pointerY - viewport.y) / viewport.scale
  const scale = clampViewportScale(viewport.scale * factor)
  return {
    x: pointerX - worldX * scale,
    y: pointerY - worldY * scale,
    scale,
  }
}

/**
 * 把世界矩形适配进可见区域（留边 padding）。
 *
 * @param bounds 世界轴对齐矩形
 * @param viewWidth 可见宽
 * @param viewHeight 可见高
 * @returns 使矩形落在视图内的视口
 * @throws 当尺寸不是正有限数
 */
export function fitViewportToBounds(bounds: WorldRect, viewWidth: number, viewHeight: number): ViewportState {
  if (!Number.isFinite(viewWidth) || !Number.isFinite(viewHeight) || viewWidth <= 0 || viewHeight <= 0) {
    throw new Error('fitViewportToBounds: view size must be finite and positive')
  }
  if (!Number.isFinite(bounds.width) || !Number.isFinite(bounds.height) || bounds.width <= 0 || bounds.height <= 0) {
    throw new Error('fitViewportToBounds: bounds size must be finite and positive')
  }

  const scale = clampViewportScale(
    Math.min(viewWidth / bounds.width, viewHeight / bounds.height) * VIEWPORT_FIT_PADDING,
  )
  const centerX = bounds.x + bounds.width / 2
  const centerY = bounds.y + bounds.height / 2
  return {
    x: viewWidth / 2 - centerX * scale,
    y: viewHeight / 2 - centerY * scale,
    scale,
  }
}

/**
 * 把可见区域中心换成世界坐标。
 *
 * @param viewport 当前视口
 * @param viewWidth 可见宽
 * @param viewHeight 可见高
 * @returns 屏幕中心对应的世界点
 */
export function viewCenterToWorld(
  viewport: ViewportState,
  viewWidth: number,
  viewHeight: number,
): { x: number; y: number } {
  return {
    x: (viewWidth / 2 - viewport.x) / viewport.scale,
    y: (viewHeight / 2 - viewport.y) / viewport.scale,
  }
}

/**
 * 图片层在世界空间的轴对齐包围盒（Sprite anchor 0.5）。
 *
 * @param layer 图片图层
 * @returns 左上角 + 宽高
 */
export function imageLayerWorldBounds(layer: ImageLayer): WorldRect {
  const width = layer.naturalWidth * layer.transform.scaleX
  const height = layer.naturalHeight * layer.transform.scaleY
  return {
    x: layer.transform.x - width / 2,
    y: layer.transform.y - height / 2,
    width,
    height,
  }
}

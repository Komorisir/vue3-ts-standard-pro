/**
 * 视口平移 / 缩放 / 适配的纯函数。
 * 不读写 store，不创建 DisplayObject。
 */
import { clamp } from '@/shared/math/clamp'
import type { CropRect, ImageLayer, Transform2D, ViewportState, WorldRect } from './types'

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
 * 当前可见主图在自然像素中的矩形（已裁则为 crop，否则为整张原图）。
 *
 * @param layer 图片图层
 * @returns 左上原点的可见矩形
 */
export function visibleImageRect(layer: ImageLayer): CropRect {
  if (layer.crop) {
    return { ...layer.crop }
  }
  return {
    x: 0,
    y: 0,
    width: layer.naturalWidth,
    height: layer.naturalHeight,
  }
}

/**
 * 可见主图中心对应的 Sprite 归一化锚点。
 *
 * @param layer 图片图层
 * @returns 锚点，范围 [0, 1]
 */
export function visibleImageAnchor(layer: ImageLayer): { x: number; y: number } {
  const visible = visibleImageRect(layer)
  return {
    x: (visible.x + visible.width / 2) / layer.naturalWidth,
    y: (visible.y + visible.height / 2) / layer.naturalHeight,
  }
}

/**
 * 把图层位置改到下一可见图的中心，使旋转绕画布上当前图的中心进行。
 *
 * @param layer 当前图层（`crop` 表示此刻可见图）
 * @param nextCrop 即将生效的裁剪；为空表示仍用当前可见图
 * @returns 新的 transform
 */
export function rebaseTransformToVisibleCenter(layer: ImageLayer, nextCrop?: CropRect): Transform2D {
  const current = visibleImageRect(layer)
  const next = nextCrop ?? current
  const currentCx = current.x + current.width / 2
  const currentCy = current.y + current.height / 2
  const nextCx = next.x + next.width / 2
  const nextCy = next.y + next.height / 2
  const flipX = layer.flipX ? -1 : 1
  const flipY = layer.flipY ? -1 : 1
  const dx = (nextCx - currentCx) * layer.transform.scaleX * flipX
  const dy = (nextCy - currentCy) * layer.transform.scaleY * flipY
  const cos = Math.cos(layer.transform.rotation)
  const sin = Math.sin(layer.transform.rotation)
  return {
    ...layer.transform,
    x: layer.transform.x + dx * cos - dy * sin,
    y: layer.transform.y + dx * sin + dy * cos,
  }
}

/**
 * 图片层在世界空间的轴对齐包围盒。
 * `transform.x/y` 是当前可见图中心；宽高为可见矩形，再按旋转展开 AABB。
 *
 * @param layer 图片图层
 * @returns 左上角 + 宽高
 */
export function imageLayerWorldBounds(layer: ImageLayer): WorldRect {
  const visible = visibleImageRect(layer)
  return spriteLocalRectWorldAabb(
    {
      x: -visible.width / 2,
      y: -visible.height / 2,
      width: visible.width,
      height: visible.height,
    },
    layer.transform,
  )
}

function spriteLocalRectWorldAabb(local: CropRect, transform: Transform2D): WorldRect {
  const cos = Math.cos(transform.rotation)
  const sin = Math.sin(transform.rotation)
  const corners = [
    { x: local.x, y: local.y },
    { x: local.x + local.width, y: local.y },
    { x: local.x + local.width, y: local.y + local.height },
    { x: local.x, y: local.y + local.height },
  ]
  let minX = Number.POSITIVE_INFINITY
  let minY = Number.POSITIVE_INFINITY
  let maxX = Number.NEGATIVE_INFINITY
  let maxY = Number.NEGATIVE_INFINITY
  for (const corner of corners) {
    const scaledX = corner.x * transform.scaleX
    const scaledY = corner.y * transform.scaleY
    const worldX = transform.x + scaledX * cos - scaledY * sin
    const worldY = transform.y + scaledX * sin + scaledY * cos
    minX = Math.min(minX, worldX)
    minY = Math.min(minY, worldY)
    maxX = Math.max(maxX, worldX)
    maxY = Math.max(maxY, worldY)
  }
  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY,
  }
}

export interface CropOverlayLayout {
  stageLeft: number
  stageTop: number
  stageWidth: number
  stageHeight: number
  originX: number
  originY: number
  rotationDeg: number
  flipX: boolean
  flipY: boolean
  boxLeft: number
  boxTop: number
  boxWidth: number
  boxHeight: number
  workingWidth: number
  workingHeight: number
}

/**
 * 把自然像素裁剪框映射到当前可见主图的未旋转屏幕四边形上，旋转由 overlay CSS 承担。
 *
 * @param layer 主图图层
 * @param crop 自然像素裁剪框
 * @param viewport 当前视口
 * @returns 舞台与裁剪框的屏幕布局
 */
export function cropOverlayLayout(layer: ImageLayer, crop: CropRect, viewport: ViewportState): CropOverlayLayout {
  const working = visibleImageRect(layer)
  const worldWidth = working.width * layer.transform.scaleX
  const worldHeight = working.height * layer.transform.scaleY
  const worldLeft = layer.transform.x - worldWidth / 2
  const worldTop = layer.transform.y - worldHeight / 2
  const stageWidth = worldWidth * viewport.scale
  const stageHeight = worldHeight * viewport.scale

  return {
    stageLeft: viewport.x + worldLeft * viewport.scale,
    stageTop: viewport.y + worldTop * viewport.scale,
    stageWidth,
    stageHeight,
    originX: 50,
    originY: 50,
    rotationDeg: (layer.transform.rotation * 180) / Math.PI,
    flipX: Boolean(layer.flipX),
    flipY: Boolean(layer.flipY),
    boxLeft: ((crop.x - working.x) / working.width) * stageWidth,
    boxTop: ((crop.y - working.y) / working.height) * stageHeight,
    boxWidth: (crop.width / working.width) * stageWidth,
    boxHeight: (crop.height / working.height) * stageHeight,
    workingWidth: working.width,
    workingHeight: working.height,
  }
}

/**
 * 将屏幕位移转换到图片局部（先逆旋转，再逆翻转）。
 *
 * @param deltaX 屏幕 X 位移
 * @param deltaY 屏幕 Y 位移
 * @param rotationRad 图层旋转（弧度，顺时针为正）
 * @param flipX 是否水平翻转
 * @param flipY 是否垂直翻转
 * @returns 图片局部位移
 */
export function screenDeltaToImageLocal(
  deltaX: number,
  deltaY: number,
  rotationRad: number,
  flipX: boolean,
  flipY: boolean,
): { x: number; y: number } {
  const cos = Math.cos(rotationRad)
  const sin = Math.sin(rotationRad)
  let x = deltaX * cos + deltaY * sin
  let y = -deltaX * sin + deltaY * cos
  if (flipX) {
    x = -x
  }
  if (flipY) {
    y = -y
  }
  return { x, y }
}

/**
 * 调整模块的纯逻辑：裁剪、角度、单位、显示尺寸。
 * 不读写 store，不创建 Pixi 对象。
 */

export const DEFAULT_DOCUMENT_DPI = 96
export const MAX_IMAGE_EDGE = 8192
const MIN_CROP_EDGE = 1

export type ImageSizeUnit = 'px' | 'in' | 'cm'
export type DisplaySizeField = 'width' | 'height'

export interface CropRatioOption {
  label: string
  ratio?: {
    width: number
    height: number
  }
}

export interface CropRect {
  x: number
  y: number
  width: number
  height: number
}

export interface Size2D {
  width: number
  height: number
}

export interface Scale2D {
  scaleX: number
  scaleY: number
}

export type CropResizeHandle = 'nw' | 'n' | 'ne' | 'w' | 'e' | 'sw' | 's' | 'se'

const CROP_RATIO_OPTIONS: CropRatioOption[] = [
  { label: '原比例' },
  { label: '1:1', ratio: { width: 1, height: 1 } },
  { label: '4:3', ratio: { width: 4, height: 3 } },
  { label: '3:4', ratio: { width: 3, height: 4 } },
  { label: '16:9', ratio: { width: 16, height: 9 } },
  { label: '9:16', ratio: { width: 9, height: 16 } },
  { label: '3:2', ratio: { width: 3, height: 2 } },
  { label: '2:3', ratio: { width: 2, height: 3 } },
]

/**
 * 返回产品要求的比例预设。
 *
 * @returns 按展示顺序排列的比例列表
 */
export function listCropRatios(): readonly CropRatioOption[] {
  return CROP_RATIO_OPTIONS
}

/**
 * 约束裁剪矩形落在原图内，并保持给定比例。
 *
 * @param rect 待约束的裁剪矩形
 * @param imageSize 原图自然尺寸
 * @param ratio 目标比例；为空表示保持当前宽高比
 * @returns 可用的裁剪矩形
 * @throws 当输入尺寸非法时抛错
 */
export function clampCropRect(rect: CropRect, imageSize: Size2D, ratio?: { width: number; height: number }): CropRect {
  assertFinitePositive(imageSize.width, 'image width must be finite and positive')
  assertFinitePositive(imageSize.height, 'image height must be finite and positive')
  assertFinitePositive(rect.width, 'crop size must be finite and positive')
  assertFinitePositive(rect.height, 'crop size must be finite and positive')

  const targetRatio = ratio ? ratio.width / ratio.height : rect.width / rect.height
  const maxWidth = imageSize.width
  const maxHeight = imageSize.height

  let width = Math.min(rect.width, maxWidth)
  let height = width / targetRatio
  if (height > maxHeight) {
    height = maxHeight
    width = height * targetRatio
  }

  width = Math.max(width, MIN_CROP_EDGE)
  height = Math.max(height, MIN_CROP_EDGE)

  let x = rect.x
  let y = rect.y
  x = clampNumber(x, 0, imageSize.width - width)
  y = clampNumber(y, 0, imageSize.height - height)

  return { x, y, width, height }
}

/**
 * 按目标比例生成居中的初始裁剪框。
 *
 * @param imageSize 原图自然尺寸
 * @param ratio 目标比例；为空表示全图
 * @returns 居中的裁剪矩形
 */
export function createCenteredCropRect(imageSize: Size2D, ratio?: { width: number; height: number }): CropRect {
  if (!ratio) {
    return {
      x: 0,
      y: 0,
      width: imageSize.width,
      height: imageSize.height,
    }
  }
  const targetRatio = ratio.width / ratio.height
  let width = imageSize.width
  let height = width / targetRatio
  if (height > imageSize.height) {
    height = imageSize.height
    width = height * targetRatio
  }
  return {
    x: (imageSize.width - width) / 2,
    y: (imageSize.height - height) / 2,
    width,
    height,
  }
}

/**
 * 按控制点拖动裁剪框。
 *
 * 边中点只移动该边，对边与另一维保持不动。角点保持给定比例。
 *
 * @param rect 拖动开始时的裁剪矩形
 * @param handle 角点或边中点
 * @param deltaX 图片局部 X 位移（自然像素）
 * @param deltaY 图片局部 Y 位移（自然像素）
 * @param imageSize 允许的工作区尺寸（左上为原点时）
 * @param ratio 角点锁定比例
 * @param bounds 工作区在自然像素中的矩形；缺省为 `(0,0,imageSize)`
 * @returns 约束后的裁剪矩形
 */
export function resizeCropRectFromHandle(
  rect: CropRect,
  handle: CropResizeHandle,
  deltaX: number,
  deltaY: number,
  imageSize: Size2D,
  ratio: { width: number; height: number },
  bounds?: CropRect,
): CropRect {
  const area = bounds ?? { x: 0, y: 0, width: imageSize.width, height: imageSize.height }
  if (handle === 'n' || handle === 's' || handle === 'e' || handle === 'w') {
    return resizeCropRectFromEdge(rect, handle, deltaX, deltaY, area)
  }
  return resizeCropRectFromCorner(rect, handle, deltaX, deltaY, area, ratio)
}

/**
 * 把裁剪框限制在工作区内，不强制比例。
 *
 * @param rect 待约束矩形
 * @param bounds 工作区
 * @returns 落在工作区内的矩形
 */
export function clampCropRectFree(rect: CropRect, bounds: CropRect): CropRect {
  const width = Math.min(Math.max(rect.width, MIN_CROP_EDGE), bounds.width)
  const height = Math.min(Math.max(rect.height, MIN_CROP_EDGE), bounds.height)
  return {
    x: clampNumber(rect.x, bounds.x, bounds.x + bounds.width - width),
    y: clampNumber(rect.y, bounds.y, bounds.y + bounds.height - height),
    width,
    height,
  }
}

/**
 * 把裁剪框限制在工作区内，并可保持比例。
 *
 * @param rect 待约束矩形（自然像素）
 * @param bounds 工作区（自然像素）
 * @param ratio 目标比例；为空则保持当前宽高比
 * @returns 落在工作区内的矩形
 */
export function clampCropRectToBounds(
  rect: CropRect,
  bounds: CropRect,
  ratio?: { width: number; height: number },
): CropRect {
  const local = clampCropRect(
    {
      x: rect.x - bounds.x,
      y: rect.y - bounds.y,
      width: rect.width,
      height: rect.height,
    },
    { width: bounds.width, height: bounds.height },
    ratio,
  )
  return {
    x: local.x + bounds.x,
    y: local.y + bounds.y,
    width: local.width,
    height: local.height,
  }
}

/**
 * 将自然像素裁剪框转换为 Sprite 局部 mask 矩形（原点为可见图中心）。
 *
 * @param crop 裁剪框（左上原点，自然像素）
 * @returns 以可见裁切中心为原点的局部矩形
 */
export function spriteMaskRectFromCropRect(crop: CropRect): CropRect {
  return {
    x: -crop.width / 2,
    y: -crop.height / 2,
    width: crop.width,
    height: crop.height,
  }
}

/**
 * 角度归一化到 [0, 360)。
 *
 * @param degrees 输入角度（度）
 * @returns 归一化结果
 * @throws 当输入不是有限数时抛错
 */
export function normalizeDegrees(degrees: number): number {
  if (!Number.isFinite(degrees)) {
    throw new Error('degrees must be finite')
  }
  return ((degrees % 360) + 360) % 360
}

/**
 * 像素转换为 UI 单位。
 *
 * @param px 像素值
 * @param unit 目标单位
 * @param dpi 文档 dpi
 * @returns 目标单位数值
 */
export function unitFromPx(px: number, unit: ImageSizeUnit, dpi: number): number {
  assertFinitePositive(px, 'px must be finite and positive')
  assertFinitePositive(dpi, 'dpi must be finite and positive')
  if (unit === 'px') {
    return px
  }
  const inch = px / dpi
  return unit === 'in' ? inch : inch * 2.54
}

/**
 * UI 单位转换回像素。
 *
 * @param value 当前单位数值
 * @param unit 当前单位
 * @param dpi 文档 dpi
 * @returns 像素值
 */
export function pxFromUnit(value: number, unit: ImageSizeUnit, dpi: number): number {
  assertFinitePositive(value, 'value must be finite and positive')
  assertFinitePositive(dpi, 'dpi must be finite and positive')
  if (unit === 'px') {
    return value
  }
  const inch = unit === 'in' ? value : value / 2.54
  return inch * dpi
}

/**
 * 计算显示尺寸改动后的宽高。
 *
 * @param current 当前显示宽高
 * @param base 焦点开始时的宽高
 * @param field 被修改的字段
 * @param nextValue 新值
 * @param locked 是否锁定比例
 * @returns 更新后的宽高
 */
export function updateDisplaySize(
  current: Size2D,
  base: Size2D,
  field: DisplaySizeField,
  nextValue: number,
  locked: boolean,
): Size2D {
  assertFinitePositive(current.width, 'current size must be finite and positive')
  assertFinitePositive(current.height, 'current size must be finite and positive')
  assertFinitePositive(base.width, 'base size must be finite and positive')
  assertFinitePositive(base.height, 'base size must be finite and positive')
  assertFinitePositive(nextValue, 'display size must be finite and positive')
  if (nextValue > MAX_IMAGE_EDGE) {
    throw new Error(`display size must not exceed ${MAX_IMAGE_EDGE}`)
  }

  if (!locked) {
    return field === 'width'
      ? { width: nextValue, height: current.height }
      : { width: current.width, height: nextValue }
  }

  const aspectRatio = base.width / base.height
  const width = field === 'width' ? nextValue : nextValue * aspectRatio
  const height = field === 'width' ? nextValue / aspectRatio : nextValue
  if (width > MAX_IMAGE_EDGE || height > MAX_IMAGE_EDGE) {
    throw new Error(`display size must not exceed ${MAX_IMAGE_EDGE}`)
  }
  return { width, height }
}

/**
 * 根据可见像素尺寸与正向缩放返回显示尺寸。
 *
 * @param visibleSize 裁剪后的可见像素尺寸
 * @param scale 缩放
 * @returns 显示宽高
 */
export function sizeFromScale(visibleSize: Size2D, scale: Scale2D): Size2D {
  return {
    width: visibleSize.width * scale.scaleX,
    height: visibleSize.height * scale.scaleY,
  }
}

/**
 * 根据显示尺寸换算正向缩放。
 *
 * @param visibleSize 裁剪后的可见像素尺寸
 * @param displaySize 目标显示宽高
 * @returns 正向缩放
 */
export function scaleFromSize(visibleSize: Size2D, displaySize: Size2D): Scale2D {
  assertFinitePositive(visibleSize.width, 'visible width must be finite and positive')
  assertFinitePositive(visibleSize.height, 'visible height must be finite and positive')
  assertFinitePositive(displaySize.width, 'display width must be finite and positive')
  assertFinitePositive(displaySize.height, 'display height must be finite and positive')
  return {
    scaleX: displaySize.width / visibleSize.width,
    scaleY: displaySize.height / visibleSize.height,
  }
}

function resizeCropRectFromEdge(
  rect: CropRect,
  handle: 'n' | 's' | 'e' | 'w',
  deltaX: number,
  deltaY: number,
  bounds: CropRect,
): CropRect {
  let next: CropRect = { ...rect }

  if (handle === 'e') {
    next = { ...rect, width: Math.max(MIN_CROP_EDGE, rect.width + deltaX) }
  } else if (handle === 'w') {
    const width = Math.max(MIN_CROP_EDGE, rect.width - deltaX)
    next = { ...rect, x: rect.x + rect.width - width, width }
  } else if (handle === 's') {
    next = { ...rect, height: Math.max(MIN_CROP_EDGE, rect.height + deltaY) }
  } else {
    const height = Math.max(MIN_CROP_EDGE, rect.height - deltaY)
    next = { ...rect, y: rect.y + rect.height - height, height }
  }

  return clampCropRectFree(next, bounds)
}

function resizeCropRectFromCorner(
  rect: CropRect,
  handle: 'nw' | 'ne' | 'sw' | 'se',
  deltaX: number,
  deltaY: number,
  bounds: CropRect,
  ratio: { width: number; height: number },
): CropRect {
  const left = rect.x
  const top = rect.y
  const right = rect.x + rect.width
  const bottom = rect.y + rect.height
  const fixedLeft = handle === 'ne' || handle === 'se' ? left : right
  const fixedTop = handle === 'sw' || handle === 'se' ? top : bottom
  const movingX = handle === 'ne' || handle === 'se' ? right + deltaX : left + deltaX
  const movingY = handle === 'sw' || handle === 'se' ? bottom + deltaY : top + deltaY
  const targetRatio = ratio.width / ratio.height

  const rawWidth = Math.max(MIN_CROP_EDGE, Math.abs(movingX - fixedLeft))
  const rawHeight = Math.max(MIN_CROP_EDGE, Math.abs(movingY - fixedTop))
  let width = rawWidth
  let height = width / targetRatio
  if (height > rawHeight) {
    height = rawHeight
    width = height * targetRatio
  }

  const x = handle === 'ne' || handle === 'se' ? fixedLeft : fixedLeft - width
  const y = handle === 'sw' || handle === 'se' ? fixedTop : fixedTop - height
  return clampCropRectToBounds({ x, y, width, height }, bounds, ratio)
}

function assertFinitePositive(value: number, message: string): void {
  if (!Number.isFinite(value) || value <= 0) {
    throw new Error(message)
  }
}

function clampNumber(value: number, min: number, max: number): number {
  if (value < min) {
    return min
  }
  if (value > max) {
    return max
  }
  return value
}

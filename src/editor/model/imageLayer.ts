/**
 * 图片图层工厂与居中变换。
 * 只生成文档数据，不创建 Sprite。
 */
import type { ImageLayer, Transform2D } from './types'

const IDENTITY_SCALE: Pick<Transform2D, 'scaleX' | 'scaleY' | 'rotation'> = {
  scaleX: 1,
  scaleY: 1,
  rotation: 0,
}

export interface CreateImageLayerInput {
  id: string
  name: string
  objectUrl: string
  naturalWidth: number
  naturalHeight: number
  transform?: Transform2D
}

/**
 * 创建图片图层。未传入 transform 时位置为原点、缩放为 1。
 *
 * @param input 图层标识、资源 URL 与自然尺寸
 * @returns 可写入文档的 ImageLayer
 */
export function createImageLayer(input: CreateImageLayerInput): ImageLayer {
  return {
    id: input.id,
    name: input.name,
    kind: 'image',
    visible: true,
    locked: false,
    objectUrl: input.objectUrl,
    naturalWidth: input.naturalWidth,
    naturalHeight: input.naturalHeight,
    flipX: false,
    flipY: false,
    transform: input.transform ?? { x: 0, y: 0, ...IDENTITY_SCALE },
  }
}

/**
 * 以视口中心为锚点生成变换（配合 Sprite anchor 0.5）。
 *
 * @param viewWidth 可见区域宽（CSS 像素）
 * @param viewHeight 可见区域高（CSS 像素）
 * @returns 位于视口中心、缩放 1、无旋转的变换
 * @throws 当宽或高不是正有限数
 */
export function centerImageTransform(viewWidth: number, viewHeight: number): Transform2D {
  if (!Number.isFinite(viewWidth) || !Number.isFinite(viewHeight) || viewWidth <= 0 || viewHeight <= 0) {
    throw new Error('centerImageTransform: view size must be finite and positive')
  }

  return {
    x: viewWidth / 2,
    y: viewHeight / 2,
    ...IDENTITY_SCALE,
  }
}

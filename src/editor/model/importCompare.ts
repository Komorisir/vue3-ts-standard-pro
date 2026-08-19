/**
 * 对比原图的视图外观推导。
 * 只读图层，不改文档、不产生命令。
 */
import type { ImageLayer, Transform2D } from './types'

/** 对比期间 Sprite 使用的外观切片，不含图层身份与资源。 */
export interface ImportCompareAppearance {
  transform: Transform2D
  crop?: undefined
  flipX: false
  flipY: false
}

/**
 * 把主图还原成导入位图外观：锚在当前可见中心，去掉裁剪、旋转、翻转与改尺寸缩放。
 *
 * @param layer 当前主图（含已提交的调整）
 * @returns 对比预览用的 transform / crop / flip；x/y 与可见中心相同
 */
export function deriveImportCompareAppearance(layer: ImageLayer): ImportCompareAppearance {
  return {
    transform: {
      x: layer.transform.x,
      y: layer.transform.y,
      scaleX: 1,
      scaleY: 1,
      rotation: 0,
    },
    crop: undefined,
    flipX: false,
    flipY: false,
  }
}

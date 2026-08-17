/**
 * 本地导入文件的入口校验。
 * 只判断 MIME / 扩展名与空文件，不加载纹理。
 */

const ACCEPTED_MIME = new Set(['image/jpeg', 'image/png', 'image/webp'])
const ACCEPTED_EXT = /\.(jpe?g|png|webp)$/i

/** 文件选择器 `accept`，与 `isAcceptedImageFile` 允许的类型一致。 */
export const ACCEPTED_IMAGE_ACCEPT = 'image/jpeg,image/png,image/webp'

/**
 * 是否为本次允许导入的图片文件。
 *
 * @param file 用户选择或拖入的文件
 * @returns MIME 或扩展名为 JPEG/PNG/WebP 且 size > 0
 */
export function isAcceptedImageFile(file: File): boolean {
  if (!file || file.size <= 0) {
    return false
  }

  if (ACCEPTED_MIME.has(file.type)) {
    return true
  }

  return ACCEPTED_EXT.test(file.name)
}

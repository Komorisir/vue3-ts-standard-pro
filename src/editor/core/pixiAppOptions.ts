/**
 * PixiJS Application 的 init / destroy 选项契约。
 * 只描述配置，不创建渲染器、不持有 DisplayObject。
 */
import type { ApplicationOptions } from 'pixi.js'
import { CHROME_HOST_BACKGROUND } from '@/editor/model/chromeTheme'

/** 卸载时传给 `app.destroy` 的第一参：移除 canvas 并释放全局 GPU 池。 */
export const PIXI_APP_DESTROY_RENDERER = {
  removeView: true,
  releaseGlobalResources: true,
} as const

/** 卸载时传给 `app.destroy` 的第二参：拆掉舞台子树与纹理。 */
export const PIXI_APP_DESTROY_STAGE = {
  children: true,
  texture: true,
  textureSource: true,
} as const

/**
 * 为指定 host 生成 v8 `app.init` 选项。
 * `resizeTo` 必须是 host 本身，不能是 window。
 * `background` 跟壳层 host 色板，不用强调色。
 *
 * @param host 画布宿主元素
 * @returns 可供 `Application.init` 使用的选项
 */
export function createPixiAppInitOptions(host: HTMLElement): Partial<ApplicationOptions> {
  return {
    resizeTo: host,
    background: CHROME_HOST_BACKGROUND,
    antialias: true,
    autoDensity: true,
    resolution: window.devicePixelRatio || 1,
    preference: 'webgl',
  }
}

/**
 * 把文档视口状态写到场景 viewport 容器。
 * 不读写 store，不持有图层 Sprite。
 */
import type { Container } from 'pixi.js'
import type { ViewportState } from '@/editor/model/types'

/**
 * 用均匀缩放与位移更新 viewport 容器。
 *
 * @param viewport 场景视口节点
 * @param state 文档中的视口状态
 */
export function applyViewport(viewport: Container, state: ViewportState): void {
  viewport.position.set(state.x, state.y)
  viewport.scale.set(state.scale)
}

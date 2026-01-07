/**
 * 图标库配置
 */
import type { App } from 'vue'
import { install } from '@icon-park/vue-next/es/all'

/**
 * 安装 IconPark 图标库
 */
export function setupIcon(app: App) {
  install(app, 'icon')
}

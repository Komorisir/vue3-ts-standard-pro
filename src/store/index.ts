import { createPinia } from 'pinia'
import type { App } from 'vue'

/**
 * 创建 store 示例
 */
const store = createPinia()

/**
 * 初始化 store
 */
export const setupStore = (app: App<Element>) => {
  app.use(store)
}

/**
 * @example setup 内使用 useXxxStore，setup 外使用 useXxxStoreWithout
 * const store = useXxxStore()
 * const { xx, xxx } = storeToRefs(store)
 *
 * @example 修改更新 state 使用 $patch 或 actions
 * √ store.$patch({ key: value })
 * √ store.add(xxx)
 * × store.key = value // 不要直接修改
 */
export { store }
export * from './modules/global'

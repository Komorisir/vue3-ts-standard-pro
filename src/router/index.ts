/**
 * 应用级 router 实例（HTML5 history）。
 * 只组装 `routes`，不声明业务页面内部结构。
 */
import { createRouter, createWebHistory } from 'vue-router'
import { routes } from './routes'

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

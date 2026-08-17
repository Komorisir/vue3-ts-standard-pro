/**
 * 可单测的路由表（路径 / 重定向 / 名称）。
 * 不负责创建 router 实例，也不包含编辑器业务。
 */
import type { RouteRecordRaw } from 'vue-router'

/** 编辑器页路径，站点默认入口。 */
export const EDITOR_PATH = '/editor'

/** 编辑器页路由名，供声明式导航使用。 */
export const EDITOR_ROUTE_NAME = 'editor'

/**
 * 根路径与未知路径一律回到编辑器，保证刷新后仍有稳定入口。
 */
export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: EDITOR_PATH,
  },
  {
    path: EDITOR_PATH,
    name: EDITOR_ROUTE_NAME,
    component: () => import('@/views/editor/EditorPage.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: EDITOR_PATH,
  },
]

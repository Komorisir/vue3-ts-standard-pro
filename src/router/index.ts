import type { App } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { RouteName } from '@/constants/enum/route'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: `/${RouteName.ADD}`,
    },
    {
      path: `/${RouteName.ADD}`,
      component: () => import('@/view/Add/AddView.vue'),
      name: RouteName.ADD,
    },
    {
      path: `/${RouteName.ADJUST}`,
      component: () => import('@/view/Adjust/AdjustView.vue'),
      name: RouteName.ADJUST,
    },
    {
      path: `/${RouteName.TEXT}`,
      component: () => import('@/view/Text/TextView.vue'),
      name: RouteName.TEXT,
    },
  ],
})

export const setupRouter = (app: App<Element>) => {
  app.use(router)
}

export default router

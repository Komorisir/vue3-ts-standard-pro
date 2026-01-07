import type { App } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { RouteName } from '@/constants/enum/route'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/home',
    },
    {
      path: '/home',
      name: 'Home',
      component: () => import('@/views/Home/HomeView.vue'),
    },
    {
      path: '/editor',
      name: 'Editor',
      component: () => import('@/views/Editor/EditorView.vue'),
    },
    {
      path: `/${RouteName.ADD}`,
      component: () => import('@/views/Add/AddView.vue'),
      name: RouteName.ADD,
    },
    {
      path: `/${RouteName.ADJUST}`,
      component: () => import('@/views/Adjust/AdjustView.vue'),
      name: RouteName.ADJUST,
    },
    {
      path: `/${RouteName.TEXT}`,
      component: () => import('@/views/Text/TextView.vue'),
      name: RouteName.TEXT,
    },
    {
      path: '/empty',
      component: () => import('@/views/Empty/EmptyView.vue'),
      name: 'Empty',
    },
  ],
})

export const setupRouter = (app: App<Element>) => {
  app.use(router)
}

export default router

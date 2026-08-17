/**
 * 应用启动：样式、Pinia、路由，然后挂载。
 * 不在此处创建 Pixi Application（feat-005）。
 */
import { createApp } from 'vue'
import './style.less'
import App from './App.vue'
import 'ant-design-vue/dist/reset.css'
import { setupStore } from '@/store'
import { router } from '@/router'
import '@icon-park/vue-next/styles/index.css'

const app = createApp(App)
setupStore(app)
app.use(router)
app.mount('#app')

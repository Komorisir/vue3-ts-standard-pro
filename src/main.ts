import { createApp } from 'vue'
import App from './App.vue'
import { setupStore } from '@/store'
import { setupRouter } from '@/router'
import '@icon-park/vue-next/styles/index.css'
import '@/assets/styles/common.less'
import 'ant-design-vue/dist/reset.css'

const app = createApp(App)
setupStore(app)
setupRouter(app)
app.mount('#app')

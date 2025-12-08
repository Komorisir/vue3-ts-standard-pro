import { createApp } from 'vue'
import './style.less'
import App from './App.vue'
import 'ant-design-vue/dist/reset.css'
import { setupStore } from '@/store'
import '@icon-park/vue-next/styles/index.css'

const app = createApp(App)
setupStore(app)
app.mount('#app')

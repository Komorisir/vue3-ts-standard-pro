import { createApp } from 'vue'
import App from './App.vue'
import { setupStore } from '@/store'
import { setupRouter } from '@/router'
// import { setupAntd } from '@/plugins/antd'
import { setupIcon } from '@/plugins/icon'

// 样式导入
import '@icon-park/vue-next/styles/index.css'
import 'ant-design-vue/dist/reset.css'
import '@/assets/styles/reset.less'
import '@/assets/styles/common.less'

const app = createApp(App)

// 安装插件
// setupAntd(app)
setupIcon(app)

// 安装 store 和 router
setupStore(app)
setupRouter(app)

app.mount('#app')

/**
 * Ant Design Vue 插件配置
 */
import type { App } from 'vue'
import {
  Button,
  Input,
  Select,
  Slider,
  Switch,
  Tooltip,
  Popover,
  Modal,
  Dropdown,
  Menu,
  Tree,
  Tabs,
  Radio,
  Checkbox,
  message,
  notification,
} from 'ant-design-vue'

/**
 * 按需导入 Ant Design Vue 组件
 */
export function setupAntd(app: App) {
  app.use(Button)
  app.use(Input)
  app.use(Select)
  app.use(Slider)
  app.use(Switch)
  app.use(Tooltip)
  app.use(Popover)
  app.use(Modal)
  app.use(Dropdown)
  app.use(Menu)
  app.use(Tree)
  app.use(Tabs)
  app.use(Radio)
  app.use(Checkbox)

  // 全局方法
  app.config.globalProperties.$message = message
  app.config.globalProperties.$notification = notification
}

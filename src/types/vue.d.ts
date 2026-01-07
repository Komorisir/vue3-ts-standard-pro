/**
 * Vue 扩展类型
 */
import type { MessageApi } from 'ant-design-vue/es/message'
import type { NotificationApi } from 'ant-design-vue/es/notification'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $message: MessageApi
    $notification: NotificationApi
  }
}

export {}

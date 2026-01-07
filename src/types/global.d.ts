/**
 * 全局类型定义
 */

declare global {
  /**
   * Window 扩展
   */
  interface Window {
    __EDITOR__?: any
    __DEV__?: boolean
  }

  /**
   * 环境变量
   */
  interface ImportMetaEnv {
    readonly VITE_APP_TITLE: string
    readonly VITE_APP_BASE_API: string
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv
  }
}

export {}

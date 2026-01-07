import { onMounted, onUnmounted } from 'vue'

/**
 * 键盘事件处理器类型
 */
export type KeyboardHandler = (event: KeyboardEvent) => void

/**
 * 快捷键配置类型
 */
export interface ShortcutConfig {
  key: string
  ctrl?: boolean
  shift?: boolean
  alt?: boolean
  handler: () => void
}

/**
 * 键盘快捷键 Hook
 * 管理键盘事件和快捷键
 */
export function useKeyboard() {
  const shortcuts = new Map<string, ShortcutConfig>()

  /**
   * 生成快捷键唯一标识
   */
  const getShortcutKey = (config: ShortcutConfig): string => {
    const parts = []
    if (config.ctrl) parts.push('ctrl')
    if (config.shift) parts.push('shift')
    if (config.alt) parts.push('alt')
    parts.push(config.key.toLowerCase())
    return parts.join('+')
  }

  /**
   * 注册快捷键
   */
  const register = (config: ShortcutConfig) => {
    const key = getShortcutKey(config)
    shortcuts.set(key, config)
  }

  /**
   * 注销快捷键
   */
  const unregister = (config: ShortcutConfig) => {
    const key = getShortcutKey(config)
    shortcuts.delete(key)
  }

  /**
   * 键盘按下事件处理
   */
  const handleKeyDown = (event: KeyboardEvent) => {
    const parts = []
    if (event.ctrlKey || event.metaKey) parts.push('ctrl')
    if (event.shiftKey) parts.push('shift')
    if (event.altKey) parts.push('alt')
    parts.push(event.key.toLowerCase())
    const key = parts.join('+')

    const shortcut = shortcuts.get(key)
    if (shortcut) {
      event.preventDefault()
      shortcut.handler()
    }
  }

  // 组件挂载时添加事件监听
  onMounted(() => {
    window.addEventListener('keydown', handleKeyDown)
  })

  // 组件卸载时移除事件监听
  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeyDown)
    shortcuts.clear()
  })

  return {
    register,
    unregister,
  }
}

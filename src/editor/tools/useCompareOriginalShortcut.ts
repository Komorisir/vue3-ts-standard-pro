/**
 * 「对比原图」快捷键：按住 `\` 进入视图态，松开退出。
 * 输入框聚焦时不触发。不改文档。
 */
import { onMounted, onUnmounted } from 'vue'
import { useEditorStore } from '@/editor/store/editor'

function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) {
    return false
  }
  return target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable
}

function isCompareKey(event: KeyboardEvent): boolean {
  return event.key === '\\' || event.code === 'Backslash'
}

/**
 * 在 window 上监听 `\` 的按下与松开，驱动 `setComparingOriginal`。
 */
export function useCompareOriginalShortcut(): void {
  const store = useEditorStore()

  function onKeyDown(event: KeyboardEvent): void {
    if (!isCompareKey(event) || event.repeat || isEditableTarget(event.target)) {
      return
    }
    event.preventDefault()
    store.setComparingOriginal(true)
  }

  function onKeyUp(event: KeyboardEvent): void {
    if (!isCompareKey(event)) {
      return
    }
    store.setComparingOriginal(false)
  }

  function onBlur(): void {
    store.setComparingOriginal(false)
  }

  onMounted(() => {
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    window.addEventListener('blur', onBlur)
  })

  onUnmounted(() => {
    window.removeEventListener('keydown', onKeyDown)
    window.removeEventListener('keyup', onKeyUp)
    window.removeEventListener('blur', onBlur)
    store.setComparingOriginal(false)
  })
}

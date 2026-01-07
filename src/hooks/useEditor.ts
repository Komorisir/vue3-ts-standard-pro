import { ref, shallowRef, onUnmounted, type ShallowRef } from 'vue'
import { Editor, type EditorOptions } from '@/editor'

/**
 * 编辑器实例 Hook
 * 管理编辑器实例的生命周期
 */
export function useEditor(options?: EditorOptions) {
  // 使用 shallowRef 避免 Pixi 对象被 Vue 代理
  const editor: ShallowRef<Editor | null> = shallowRef(null)
  const initialized = ref(false)
  const error = ref<Error | null>(null)
  const loading = ref(false)

  /**
   * 初始化编辑器
   */
  const init = async (container?: HTMLElement) => {
    if (initialized.value) {
      console.warn('Editor already initialized')
      return
    }

    try {
      loading.value = true
      editor.value = new Editor()
      await editor.value.init({
        ...options,
        container,
      })
      initialized.value = true
      error.value = null
    } catch (err) {
      error.value = err as Error
      console.error('Failed to initialize editor:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * 加载图片（支持 URL 或 Data URL）
   */
  const loadImage = async (imageUrl: string) => {
    if (!editor.value) {
      throw new Error('Editor not initialized')
    }

    try {
      loading.value = true
      await editor.value.loadImage(imageUrl)
      error.value = null
    } catch (err) {
      error.value = err as Error
      console.error('Failed to load image:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * 调整尺寸
   */
  const resize = (width: number, height: number) => {
    if (editor.value) {
      editor.value.resize(width, height)
    }
  }

  /**
   * 销毁编辑器
   */
  const destroy = () => {
    if (editor.value) {
      editor.value.destroy()
      editor.value = null
      initialized.value = false
    }
  }

  // 组件卸载时自动销毁
  onUnmounted(() => {
    destroy()
  })

  return {
    editor,
    initialized,
    loading,
    error,
    init,
    loadImage,
    resize,
    destroy,
  }
}

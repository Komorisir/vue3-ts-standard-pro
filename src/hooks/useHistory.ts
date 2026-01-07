import { ref, type Ref } from 'vue'
import type { Editor } from '@/editor'

/**
 * 历史记录 Hook
 * 提供撤销、重做功能
 */
export function useHistory(editor: Ref<Editor | null>) {
  const canUndo = ref(false)
  const canRedo = ref(false)

  /**
   * 撤销
   */
  const undo = () => {
    if (!editor.value || !canUndo.value) return
    // TODO: 通过 CommandManager 撤销
    console.log('Undo')
  }

  /**
   * 重做
   */
  const redo = () => {
    if (!editor.value || !canRedo.value) return
    // TODO: 通过 CommandManager 重做
    console.log('Redo')
  }

  /**
   * 清空历史记录
   */
  const clear = () => {
    if (!editor.value) return
    canUndo.value = false
    canRedo.value = false
    // TODO: 清空 CommandManager 的历史记录
  }

  return {
    canUndo,
    canRedo,
    undo,
    redo,
    clear,
  }
}

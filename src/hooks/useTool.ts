import { ref, type Ref } from 'vue'
import { ToolType } from '@/editor/types/tool'
import type { Editor } from '@/editor'

/**
 * 工具切换 Hook
 * 管理当前激活的工具
 */
export function useTool(editor: Ref<Editor | null>) {
  const currentTool = ref<ToolType | null>(ToolType.SELECT)

  /**
   * 切换工具
   */
  const setTool = (tool: ToolType) => {
    if (!editor.value) return
    currentTool.value = tool
    // TODO: 通过 ToolManager 切换工具
    console.log('Tool changed to:', tool)
  }

  /**
   * 获取当前工具
   */
  const getTool = () => {
    return currentTool.value
  }

  return {
    currentTool,
    setTool,
    getTool,
  }
}

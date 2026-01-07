/**
 * 快捷键配置
 */

export interface Shortcut {
  key: string
  ctrl?: boolean
  shift?: boolean
  alt?: boolean
  description: string
  action: string
}

/**
 * 快捷键列表
 */
export const SHORTCUTS: Shortcut[] = [
  // 编辑操作
  { key: 'z', ctrl: true, description: '撤销', action: 'undo' },
  { key: 'z', ctrl: true, shift: true, description: '重做', action: 'redo' },
  { key: 'y', ctrl: true, description: '重做', action: 'redo' },
  { key: 'c', ctrl: true, description: '复制', action: 'copy' },
  { key: 'v', ctrl: true, description: '粘贴', action: 'paste' },
  { key: 'x', ctrl: true, description: '剪切', action: 'cut' },
  { key: 'a', ctrl: true, description: '全选', action: 'selectAll' },
  { key: 'Delete', description: '删除', action: 'delete' },
  { key: 'Backspace', description: '删除', action: 'delete' },

  // 工具切换
  { key: 'v', description: '选择工具', action: 'tool:select' },
  { key: 'h', description: '抓手工具', action: 'tool:hand' },
  { key: 'r', description: '矩形工具', action: 'tool:rect' },
  { key: 'c', description: '圆形工具', action: 'tool:circle' },
  { key: 'l', description: '直线工具', action: 'tool:line' },
  { key: 't', description: '文本工具', action: 'tool:text' },

  // 视图操作
  { key: '0', ctrl: true, description: '重置缩放', action: 'zoom:reset' },
  { key: '=', ctrl: true, description: '放大', action: 'zoom:in' },
  { key: '-', ctrl: true, description: '缩小', action: 'zoom:out' },
  { key: '1', ctrl: true, description: '适应画布', action: 'zoom:fit' },

  // 图层操作
  { key: 'g', ctrl: true, description: '组合', action: 'group' },
  { key: 'g', ctrl: true, shift: true, description: '取消组合', action: 'ungroup' },
  { key: ']', ctrl: true, description: '置于顶层', action: 'layer:toFront' },
  { key: '[', ctrl: true, description: '置于底层', action: 'layer:toBack' },
  { key: ']', ctrl: true, shift: true, description: '上移一层', action: 'layer:forward' },
  { key: '[', ctrl: true, shift: true, description: '下移一层', action: 'layer:backward' },

  // 文件操作
  { key: 's', ctrl: true, description: '保存', action: 'save' },
  { key: 's', ctrl: true, shift: true, description: '另存为', action: 'saveAs' },
  { key: 'o', ctrl: true, description: '打开', action: 'open' },
  { key: 'e', ctrl: true, shift: true, description: '导出', action: 'export' },
]

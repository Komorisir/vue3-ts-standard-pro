/**
 * 编辑器事件类型
 */
export enum EditorEventType {
  /** 初始化完成 */
  INITIALIZED = 'initialized',
  /** 尺寸变化 */
  RESIZE = 'resize',
  /** 销毁 */
  DESTROYED = 'destroyed',
  /** 选择变化 */
  SELECTION_CHANGE = 'selection:change',
  /** 工具变化 */
  TOOL_CHANGE = 'tool:change',
  /** 历史变化 */
  HISTORY_CHANGE = 'history:change',
  /** 图层变化 */
  LAYER_CHANGE = 'layer:change',
}

/**
 * 编辑器模式
 */
export enum EditorMode {
  /** 编辑模式 */
  EDIT = 'edit',
  /** 预览模式 */
  PREVIEW = 'preview',
  /** 演示模式 */
  PRESENTATION = 'presentation',
}

/**
 * 编辑器状态
 */
export interface EditorState {
  /** 当前模式 */
  mode: EditorMode
  /** 当前工具 */
  currentTool: string | null
  /** 缩放比例 */
  zoom: number
  /** 是否可以撤销 */
  canUndo: boolean
  /** 是否可以重做 */
  canRedo: boolean
}

/**
 * 编辑器事件接口
 */
export interface EditorEvent {
  /** 事件类型 */
  type: string
  /** 时间戳 */
  timestamp: number
  /** 事件数据 */
  data?: any
}

/**
 * 选择事件数据
 */
export interface SelectionEventData {
  /** 选中的节点 ID 列表 */
  selectedIds: string[]
  /** 之前选中的节点 ID 列表 */
  previousIds: string[]
}

/**
 * 工具事件数据
 */
export interface ToolEventData {
  /** 当前工具类型 */
  currentTool: string
  /** 之前的工具类型 */
  previousTool: string | null
}

/**
 * 历史事件数据
 */
export interface HistoryEventData {
  /** 是否可以撤销 */
  canUndo: boolean
  /** 是否可以重做 */
  canRedo: boolean
  /** 当前历史索引 */
  currentIndex: number
  /** 历史记录总数 */
  totalCount: number
}

/**
 * 图层事件数据
 */
export interface LayerEventData {
  /** 操作类型 */
  operation: 'add' | 'remove' | 'update' | 'reorder'
  /** 图层 ID */
  layerId: string
  /** 图层数据 */
  layerData?: any
}

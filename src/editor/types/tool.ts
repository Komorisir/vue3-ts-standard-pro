/**
 * 工具类型枚举
 */
export enum ToolType {
  /** 选择工具 */
  SELECT = 'select',
  /** 抓手工具 */
  HAND = 'hand',
  /** 矩形工具 */
  RECT = 'rect',
  /** 圆形工具 */
  CIRCLE = 'circle',
  /** 直线工具 */
  LINE = 'line',
  /** 路径工具 */
  PATH = 'path',
  /** 文本工具 */
  TEXT = 'text',
  /** 裁剪工具 */
  CROP = 'crop',
  /** 橡皮擦工具 */
  ERASER = 'eraser',
  /** 画笔工具 */
  BRUSH = 'brush',
  /** 填充工具 */
  FILL = 'fill',
  /** 变换工具 */
  TRANSFORM = 'transform',
}

/**
 * 工具状态
 */
export enum ToolState {
  /** 空闲 */
  IDLE = 'idle',
  /** 活动中 */
  ACTIVE = 'active',
  /** 绘制中 */
  DRAWING = 'drawing',
  /** 变换中 */
  TRANSFORMING = 'transforming',
}

/**
 * 指针事件类型
 */
export interface PointerEventData {
  /** 屏幕坐标 X */
  screenX: number
  /** 屏幕坐标 Y */
  screenY: number
  /** 世界坐标 X */
  worldX: number
  /** 世界坐标 Y */
  worldY: number
  /** 按钮 */
  button: number
  /** 是否按下 Shift */
  shiftKey: boolean
  /** 是否按下 Ctrl/Cmd */
  ctrlKey: boolean
  /** 是否按下 Alt */
  altKey: boolean
  /** 原始事件 */
  originalEvent: PointerEvent
}

/**
 * 工具接口
 */
export interface ITool {
  /** 工具类型 */
  readonly type: ToolType
  /** 工具名称 */
  readonly name: string
  /** 工具状态 */
  readonly state: ToolState
  /** 光标样式 */
  readonly cursor: string

  /** 激活工具 */
  activate(): void
  /** 停用工具 */
  deactivate(): void
  /** 指针按下 */
  onPointerDown(event: PointerEventData): void
  /** 指针移动 */
  onPointerMove(event: PointerEventData): void
  /** 指针抬起 */
  onPointerUp(event: PointerEventData): void
  /** 键盘按下 */
  onKeyDown(event: KeyboardEvent): void
  /** 键盘抬起 */
  onKeyUp(event: KeyboardEvent): void
}

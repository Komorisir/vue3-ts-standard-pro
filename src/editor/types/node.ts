import type { Container } from 'pixi.js'

/**
 * 节点类型枚举
 */
export enum NodeType {
  /** 矩形 */
  RECT = 'rect',
  /** 圆形 */
  CIRCLE = 'circle',
  /** 椭圆 */
  ELLIPSE = 'ellipse',
  /** 多边形 */
  POLYGON = 'polygon',
  /** 直线 */
  LINE = 'line',
  /** 路径 */
  PATH = 'path',
  /** 星形 */
  STAR = 'star',
  /** 图片 */
  IMAGE = 'image',
  /** 文本 */
  TEXT = 'text',
  /** 组合 */
  GROUP = 'group',
  /** 精灵 */
  SPRITE = 'sprite',
  /** 蒙版 */
  MASK = 'mask',
}

/**
 * 节点变换属性
 */
export interface NodeTransform {
  /** X 坐标 */
  x: number
  /** Y 坐标 */
  y: number
  /** 宽度 */
  width: number
  /** 高度 */
  height: number
  /** 旋转角度（弧度） */
  rotation: number
  /** X 缩放 */
  scaleX: number
  /** Y 缩放 */
  scaleY: number
  /** 锚点 X */
  anchorX: number
  /** 锚点 Y */
  anchorY: number
}

/**
 * 节点样式属性
 */
export interface NodeStyle {
  /** 填充颜色 */
  fill?: string | number
  /** 描边颜色 */
  stroke?: string | number
  /** 描边宽度 */
  strokeWidth?: number
  /** 不透明度 */
  opacity?: number
  /** 混合模式 */
  blendMode?: string
  /** 阴影 */
  shadow?: {
    color: string
    blur: number
    offsetX: number
    offsetY: number
  }
}

/**
 * 节点数据接口
 */
export interface INodeData {
  /** 节点 ID */
  id: string
  /** 节点类型 */
  type: NodeType
  /** 节点名称 */
  name: string
  /** 是否可见 */
  visible: boolean
  /** 是否锁定 */
  locked: boolean
  /** 变换属性 */
  transform: NodeTransform
  /** 样式属性 */
  style: NodeStyle
  /** 自定义数据 */
  data?: Record<string, any>
}

/**
 * 节点接口
 */
export interface INode {
  /** 节点 ID */
  readonly id: string
  /** 节点类型 */
  readonly type: NodeType
  /** 节点名称 */
  name: string
  /** Pixi 容器 */
  readonly container: Container
  /** 是否可见 */
  visible: boolean
  /** 是否锁定 */
  locked: boolean
  /** 父节点 */
  parent: INode | null
  /** 子节点 */
  children: INode[]

  /** 获取变换属性 */
  getTransform(): NodeTransform
  /** 设置变换属性 */
  setTransform(transform: Partial<NodeTransform>): void
  /** 获取样式属性 */
  getStyle(): NodeStyle
  /** 设置样式属性 */
  setStyle(style: Partial<NodeStyle>): void
  /** 序列化 */
  serialize(): INodeData
  /** 反序列化 */
  deserialize(data: INodeData): void
  /** 克隆 */
  clone(): INode
  /** 销毁 */
  destroy(): void
}

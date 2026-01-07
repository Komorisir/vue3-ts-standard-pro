import type { INode } from './node'

/**
 * 图层类型枚举
 */
export enum LayerType {
  /** 普通图层 */
  NORMAL = 'normal',
  /** 图层组 */
  GROUP = 'group',
  /** 背景图层 */
  BACKGROUND = 'background',
}

/**
 * 图层接口
 */
export interface ILayer {
  /** 图层 ID */
  readonly id: string
  /** 图层类型 */
  readonly type: LayerType
  /** 图层名称 */
  name: string
  /** 是否可见 */
  visible: boolean
  /** 是否锁定 */
  locked: boolean
  /** 不透明度 */
  opacity: number
  /** 混合模式 */
  blendMode: string
  /** 父图层 */
  parent: ILayer | null
  /** 子图层 */
  children: ILayer[]
  /** 图层中的节点 */
  nodes: INode[]

  /** 添加节点 */
  addNode(node: INode): void
  /** 移除节点 */
  removeNode(node: INode): void
  /** 添加子图层 */
  addChild(layer: ILayer): void
  /** 移除子图层 */
  removeChild(layer: ILayer): void
  /** 序列化 */
  serialize(): any
  /** 反序列化 */
  deserialize(data: any): void
}

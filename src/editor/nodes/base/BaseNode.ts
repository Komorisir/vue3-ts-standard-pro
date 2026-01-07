import { Container } from 'pixi.js'
import { EventEmitter } from '../../core/EventEmitter'
import type { INode, INodeData, NodeStyle, NodeTransform, NodeType } from '../../types/node'

/**
 * 节点基类
 * 所有图形节点的抽象基类
 */
export abstract class BaseNode extends EventEmitter implements INode {
  private _id: string
  private _type: NodeType
  private _name: string
  private _container: Container
  private _visible: boolean = true
  private _locked: boolean = false
  private _parent: INode | null = null
  private _children: INode[] = []

  constructor(id: string, type: NodeType, name?: string) {
    super()
    this._id = id
    this._type = type
    this._name = name || `${type}_${id.slice(0, 8)}`
    this._container = new Container()
    this.initContainer()
  }

  get id(): string {
    return this._id
  }

  get type(): NodeType {
    return this._type
  }

  get name(): string {
    return this._name
  }

  set name(value: string) {
    this._name = value
    this.emit('name:change', value)
  }

  get container(): Container {
    return this._container
  }

  get visible(): boolean {
    return this._visible
  }

  set visible(value: boolean) {
    this._visible = value
    this._container.visible = value
    this.emit('visible:change', value)
  }

  get locked(): boolean {
    return this._locked
  }

  set locked(value: boolean) {
    this._locked = value
    this.emit('locked:change', value)
  }

  get parent(): INode | null {
    return this._parent
  }

  set parent(value: INode | null) {
    this._parent = value
  }

  get children(): INode[] {
    return this._children
  }

  /**
   * 初始化容器
   */
  protected abstract initContainer(): void

  /**
   * 添加子节点
   */
  addChild(node: INode): void {
    if (this._children.includes(node)) {
      return
    }
    this._children.push(node)
    node.parent = this
    this._container.addChild(node.container)
    this.emit('child:add', node)
  }

  /**
   * 移除子节点
   */
  removeChild(node: INode): void {
    const index = this._children.indexOf(node)
    if (index === -1) {
      return
    }
    this._children.splice(index, 1)
    node.parent = null
    this._container.removeChild(node.container)
    this.emit('child:remove', node)
  }

  /**
   * 获取变换属性
   */
  getTransform(): NodeTransform {
    const bounds = this._container.getBounds()
    return {
      x: this._container.x,
      y: this._container.y,
      width: bounds.width,
      height: bounds.height,
      rotation: this._container.rotation,
      scaleX: this._container.scale.x,
      scaleY: this._container.scale.y,
      anchorX: 0,
      anchorY: 0,
    }
  }

  /**
   * 设置变换属性
   */
  setTransform(transform: Partial<NodeTransform>): void {
    if (transform.x !== undefined) this._container.x = transform.x
    if (transform.y !== undefined) this._container.y = transform.y
    if (transform.rotation !== undefined) this._container.rotation = transform.rotation
    if (transform.scaleX !== undefined) this._container.scale.x = transform.scaleX
    if (transform.scaleY !== undefined) this._container.scale.y = transform.scaleY
    this.emit('transform:change', this.getTransform())
  }

  /**
   * 获取样式属性
   */
  abstract getStyle(): NodeStyle

  /**
   * 设置样式属性
   */
  abstract setStyle(style: Partial<NodeStyle>): void

  /**
   * 序列化
   */
  serialize(): INodeData {
    return {
      id: this._id,
      type: this._type,
      name: this._name,
      visible: this._visible,
      locked: this._locked,
      transform: this.getTransform(),
      style: this.getStyle(),
    }
  }

  /**
   * 反序列化
   */
  deserialize(data: INodeData): void {
    this._name = data.name
    this._visible = data.visible
    this._locked = data.locked
    this.setTransform(data.transform)
    this.setStyle(data.style)
  }

  /**
   * 克隆
   */
  abstract clone(): INode

  /**
   * 销毁
   */
  destroy(): void {
    // 销毁所有子节点
    this._children.forEach(child => child.destroy())
    this._children = []

    // 销毁容器
    this._container.destroy({ children: true })

    // 清除事件监听
    this.removeAllListeners()

    this.emit('destroyed')
  }
}

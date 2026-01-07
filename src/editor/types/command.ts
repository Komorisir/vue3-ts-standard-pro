/**
 * 命令接口
 */
export interface ICommand {
  /** 命令 ID */
  readonly id: string
  /** 命令类型 */
  readonly type: string
  /** 命令名称 */
  readonly name: string
  /** 是否可以合并 */
  readonly mergeable: boolean

  /** 执行命令 */
  execute(): void
  /** 撤销命令 */
  undo(): void
  /** 重做命令 */
  redo(): void
  /** 合并命令 */
  merge?(command: ICommand): boolean
  /** 序列化 */
  serialize(): any
  /** 反序列化 */
  deserialize(data: any): void
}

/**
 * 命令类型枚举
 */
export enum CommandType {
  /** 添加节点 */
  ADD_NODE = 'add_node',
  /** 删除节点 */
  REMOVE_NODE = 'remove_node',
  /** 变换节点 */
  TRANSFORM_NODE = 'transform_node',
  /** 更新节点属性 */
  UPDATE_NODE = 'update_node',
  /** 组合节点 */
  GROUP_NODES = 'group_nodes',
  /** 取消组合 */
  UNGROUP_NODES = 'ungroup_nodes',
  /** 图层操作 */
  LAYER_OPERATION = 'layer_operation',
  /** 顺序操作 */
  ORDER_OPERATION = 'order_operation',
  /** 批量操作 */
  BATCH_OPERATION = 'batch_operation',
}

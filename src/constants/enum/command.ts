/**
 * 命令类型枚举
 */
export enum CommandEnum {
  ADD_NODE = 'add_node',
  REMOVE_NODE = 'remove_node',
  TRANSFORM_NODE = 'transform_node',
  UPDATE_NODE = 'update_node',
  GROUP_NODES = 'group_nodes',
  UNGROUP_NODES = 'ungroup_nodes',
  LAYER_OPERATION = 'layer_operation',
  ORDER_OPERATION = 'order_operation',
  BATCH_OPERATION = 'batch_operation',
}

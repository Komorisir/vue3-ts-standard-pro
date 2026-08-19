/**
 * 调整模块最小命令栈。
 * 只管理 execute / undo / redo，不依赖 Pinia 或 Pixi。
 */

export interface EditorCommand {
  execute(): void
  undo(): void
  redo(): void
}

export interface CommandStack {
  readonly canUndo: boolean
  readonly canRedo: boolean
  push(command: EditorCommand): void
  undo(): void
  redo(): void
  clear(): void
}

/**
 * 创建线性命令栈。
 *
 * @returns 支持 push / undo / redo 的命令栈
 */
export function createCommandStack(): CommandStack {
  const past: EditorCommand[] = []
  const future: EditorCommand[] = []

  return {
    get canUndo() {
      return past.length > 0
    },
    get canRedo() {
      return future.length > 0
    },
    push(command) {
      command.execute()
      past.push(command)
      future.length = 0
    },
    undo() {
      const command = past.pop()
      if (!command) {
        return
      }
      command.undo()
      future.push(command)
    },
    redo() {
      const command = future.pop()
      if (!command) {
        return
      }
      command.redo()
      past.push(command)
    },
    clear() {
      past.length = 0
      future.length = 0
    },
  }
}

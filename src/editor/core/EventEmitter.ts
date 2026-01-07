/**
 * 事件发射器基类
 * 提供事件的订阅、发布、取消订阅功能
 */
export class EventEmitter {
  private events: Map<string, Set<Function>> = new Map()

  /**
   * 订阅事件
   * @param event 事件名称
   * @param handler 事件处理函数
   */
  on(event: string, handler: Function): void {
    if (!this.events.has(event)) {
      this.events.set(event, new Set())
    }
    this.events.get(event)!.add(handler)
  }

  /**
   * 订阅事件（只触发一次）
   * @param event 事件名称
   * @param handler 事件处理函数
   */
  once(event: string, handler: Function): void {
    const onceHandler = (...args: any[]) => {
      handler(...args)
      this.off(event, onceHandler)
    }
    this.on(event, onceHandler)
  }

  /**
   * 取消订阅事件
   * @param event 事件名称
   * @param handler 事件处理函数（可选，不传则取消该事件的所有订阅）
   */
  off(event: string, handler?: Function): void {
    if (!handler) {
      this.events.delete(event)
      return
    }

    const handlers = this.events.get(event)
    if (handlers) {
      handlers.delete(handler)
      if (handlers.size === 0) {
        this.events.delete(event)
      }
    }
  }

  /**
   * 触发事件
   * @param event 事件名称
   * @param args 事件参数
   */
  emit(event: string, ...args: any[]): void {
    const handlers = this.events.get(event)
    if (handlers) {
      handlers.forEach(handler => {
        try {
          handler(...args)
        } catch (error) {
          console.error(`Error in event handler for "${event}":`, error)
        }
      })
    }
  }

  /**
   * 清除所有事件监听器
   */
  removeAllListeners(): void {
    this.events.clear()
  }

  /**
   * 获取某个事件的监听器数量
   * @param event 事件名称
   */
  listenerCount(event: string): number {
    return this.events.get(event)?.size || 0
  }
}

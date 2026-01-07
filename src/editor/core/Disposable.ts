/**
 * 资源释放接口
 */
export interface IDisposable {
  dispose(): void
}

/**
 * 资源释放基类
 * 用于管理需要手动释放的资源
 */
export abstract class Disposable implements IDisposable {
  private _disposed = false

  /**
   * 是否已释放
   */
  get disposed(): boolean {
    return this._disposed
  }

  /**
   * 释放资源
   */
  dispose(): void {
    if (this._disposed) {
      return
    }

    this._disposed = true
    this.onDispose()
  }

  /**
   * 子类实现具体的资源释放逻辑
   */
  protected abstract onDispose(): void

  /**
   * 确保对象未被释放
   */
  protected checkDisposed(): void {
    if (this._disposed) {
      throw new Error('Object has been disposed')
    }
  }
}

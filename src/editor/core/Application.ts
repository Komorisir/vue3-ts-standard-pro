import { Application as PixiApplication, type ApplicationOptions } from 'pixi.js'
import { EventEmitter } from './EventEmitter'

/**
 * Pixi Application 封装类
 * 负责管理 Pixi.js 应用实例的生命周期
 */
export class Application extends EventEmitter {
  private app: PixiApplication | null = null
  private _initialized = false

  /**
   * 获取 Pixi Application 实例
   */
  get pixiApp(): PixiApplication {
    if (!this.app) {
      throw new Error('Application not initialized. Call init() first.')
    }
    return this.app
  }

  /**
   * 是否已初始化
   */
  get initialized(): boolean {
    return this._initialized
  }

  /**
   * 初始化 Pixi Application
   * @param options Pixi Application 配置选项
   */
  async init(options?: Partial<ApplicationOptions>): Promise<void> {
    if (this._initialized) {
      console.warn('Application already initialized')
      return
    }

    try {
      this.app = new PixiApplication()

      // Pixi.js v8 使用异步初始化
      await this.app.init({
        backgroundColor: 0x1099bb,
        antialias: true,
        resolution: window.devicePixelRatio || 1,
        autoDensity: true,
        ...options,
      })

      this._initialized = true
      this.emit('initialized')
    } catch (error) {
      console.error('Failed to initialize Pixi Application:', error)
      throw error
    }
  }

  /**
   * 挂载到 DOM 容器
   * @param container DOM 容器元素
   */
  mount(container: HTMLElement): void {
    if (!this.app) {
      throw new Error('Application not initialized')
    }
    container.appendChild(this.app.canvas)
    this.emit('mounted')
  }

  /**
   * 调整画布尺寸
   * @param width 宽度
   * @param height 高度
   */
  resize(width: number, height: number): void {
    if (!this.app) return
    this.app.renderer.resize(width, height)
    this.emit('resize', { width, height })
  }

  /**
   * 销毁应用
   */
  destroy(): void {
    if (this.app) {
      this.app.destroy(true, { children: true })
      this.app = null
      this._initialized = false
      this.removeAllListeners()
      this.emit('destroyed')
    }
  }
}

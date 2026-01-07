import { Application } from './Application'
import { EventEmitter } from './EventEmitter'
import { Assets, Sprite, Texture } from 'pixi.js'
import type { ApplicationOptions } from 'pixi.js'

/**
 * 编辑器配置选项
 */
export interface EditorOptions extends Partial<ApplicationOptions> {
  /** 容器元素 */
  container?: HTMLElement
  /** 画布宽度 */
  width?: number
  /** 画布高度 */
  height?: number
  /** 自动调整大小的目标元素 */
  resizeTo?: HTMLElement | Window
}

/**
 * 编辑器主类
 * 负责管理整个编辑器的生命周期和核心功能
 */
export class Editor extends EventEmitter {
  private application: Application
  private _container: HTMLElement | null = null
  private _initialized = false
  private currentSprite: Sprite | null = null

  constructor() {
    super()
    this.application = new Application()
  }

  /**
   * 获取 Application 实例
   */
  get app(): Application {
    return this.application
  }

  /**
   * 获取容器元素
   */
  get container(): HTMLElement | null {
    return this._container
  }

  /**
   * 是否已初始化
   */
  get initialized(): boolean {
    return this._initialized
  }

  /**
   * 初始化编辑器
   * @param options 编辑器配置选项
   */
  async init(options: EditorOptions = {}): Promise<void> {
    if (this._initialized) {
      console.warn('Editor already initialized')
      return
    }

    try {
      const { container, width, height, resizeTo, ...appOptions } = options

      // 初始化 Application
      await this.application.init({
        width: width || 800,
        height: height || 600,
        resizeTo,
        ...appOptions,
      })

      // 挂载到容器
      if (container) {
        this._container = container
        this.application.mount(container)
      }

      // 初始化各个管理器
      await this.initManagers()

      this._initialized = true
      this.emit('initialized')
    } catch (error) {
      console.error('Failed to initialize editor:', error)
      throw error
    }
  }

  /**
   * 初始化各个管理器
   */
  private async initManagers(): Promise<void> {
    // TODO: 初始化 ViewportManager、LayerManager 等管理器
    // 这些管理器将在后续实现
  }

  /**
   * 加载并渲染图片
   * @param imageUrl 图片 URL 或 Data URL (Base64)
   */
  async loadImage(imageUrl: string): Promise<void> {
    if (!this._initialized) {
      throw new Error('Editor not initialized. Call init() first.')
    }

    try {
      console.log('📥 开始加载图片...')
      console.log('📏 URL 类型:', imageUrl.startsWith('data:') ? 'Data URL' : 'HTTP URL')

      let texture: Texture

      // 判断是否为 Data URL (Base64)
      if (imageUrl.startsWith('data:')) {
        console.log('🎨 使用 HTMLImageElement 加载 Data URL（最可靠）')

        // 使用 Image 对象加载，这是最可靠的方式
        texture = await new Promise<Texture>((resolve, reject) => {
          const img = new Image()

          img.onload = () => {
            console.log('✅ Image 加载成功:', img.width, 'x', img.height)
            try {
              // 从 Image 创建 Texture
              const tex = Texture.from(img)
              console.log('✅ Texture 创建成功:', tex.width, 'x', tex.height)
              resolve(tex)
            } catch (err) {
              console.error('❌ Texture 创建失败:', err)
              reject(err)
            }
          }

          img.onerror = error => {
            console.error('❌ Image 加载失败:', error)
            reject(new Error('Failed to load image'))
          }

          // 设置 src 开始加载
          img.src = imageUrl
        })
      } else {
        console.log('🌐 使用 Assets.load() 加载普通 URL')
        // 普通 URL 使用 Assets.load()
        texture = await Assets.load(imageUrl)
      }

      if (!texture || texture.width === 0 || texture.height === 0) {
        throw new Error('Invalid texture: texture is undefined or has zero size')
      }

      console.log('✅ 纹理验证通过:', texture.width, 'x', texture.height)

      // 如果已有精灵，移除它
      if (this.currentSprite) {
        this.application.pixiApp.stage.removeChild(this.currentSprite)
        this.currentSprite.destroy()
        console.log('🗑️ 已移除旧精灵')
      }

      // 创建新精灵
      this.currentSprite = new Sprite(texture)
      console.log('🎭 创建新精灵，尺寸:', this.currentSprite.width, 'x', this.currentSprite.height)

      // 计算缩放以适应画布
      this.fitSpriteToScreen()

      // 添加到舞台
      this.application.pixiApp.stage.addChild(this.currentSprite)

      console.log('🎉 图片已成功渲染到画布')
      console.log('📍 精灵位置:', this.currentSprite.x, this.currentSprite.y)
      console.log('📏 精灵缩放:', this.currentSprite.scale.x, this.currentSprite.scale.y)

      this.emit('image:loaded', { imageUrl, texture })
    } catch (error) {
      console.error('❌ 图片加载失败:', error)
      this.emit('image:error', { imageUrl, error })
      throw error
    }
  }

  /**
   * 从 HTMLImageElement 加载图片（备用方案，更可靠）
   * @param imageUrl 图片 URL 或 Data URL
   */
  async loadImageFromHTMLImage(imageUrl: string): Promise<void> {
    if (!this._initialized) {
      throw new Error('Editor not initialized. Call init() first.')
    }

    return new Promise((resolve, reject) => {
      console.log('🖼️ 使用 HTMLImageElement 加载图片（备用方案）')

      const img = new Image()

      img.onload = () => {
        try {
          console.log('✅ 图片加载成功:', img.width, 'x', img.height)

          // 从 Image 创建纹理
          const texture = Texture.from(img)

          // 如果已有精灵，移除它
          if (this.currentSprite) {
            this.application.pixiApp.stage.removeChild(this.currentSprite)
            this.currentSprite.destroy()
          }

          // 创建新精灵
          this.currentSprite = new Sprite(texture)

          // 计算缩放以适应画布
          this.fitSpriteToScreen()

          // 添加到舞台
          this.application.pixiApp.stage.addChild(this.currentSprite)

          console.log('🎉 图片已成功渲染到画布')

          this.emit('image:loaded', { imageUrl, texture })
          resolve()
        } catch (error) {
          console.error('❌ 创建纹理失败:', error)
          this.emit('image:error', { imageUrl, error })
          reject(error)
        }
      }

      img.onerror = error => {
        console.error('❌ 图片加载失败:', error)
        const err = new Error('Failed to load image')
        this.emit('image:error', { imageUrl, error: err })
        reject(err)
      }

      // 设置跨域属性（如果是外部 URL）
      if (!imageUrl.startsWith('data:')) {
        img.crossOrigin = 'anonymous'
      }

      // 开始加载
      img.src = imageUrl
    })
  }

  /**
   * 使精灵适应屏幕
   */
  private fitSpriteToScreen(): void {
    if (!this.currentSprite || !this.currentSprite.texture) return

    const canvasWidth = this.application.pixiApp.screen.width
    const canvasHeight = this.application.pixiApp.screen.height
    const imageWidth = this.currentSprite.texture.width
    const imageHeight = this.currentSprite.texture.height

    // 计算缩放比例以适应画布
    const scale = Math.min(canvasWidth / imageWidth, canvasHeight / imageHeight)
    this.currentSprite.scale.set(scale)

    // 居中显示
    this.currentSprite.x = (canvasWidth - imageWidth * scale) / 2
    this.currentSprite.y = (canvasHeight - imageHeight * scale) / 2
  }

  /**
   * 调整编辑器尺寸
   * @param width 宽度
   * @param height 高度
   */
  resize(width: number, height: number): void {
    this.application.resize(width, height)

    // 重新调整图片位置和缩放
    if (this.currentSprite) {
      this.fitSpriteToScreen()
    }

    this.emit('resize', { width, height })
  }

  /**
   * 获取 Pixi Application 实例
   */
  get pixiApp() {
    return this.application.pixiApp
  }

  /**
   * 销毁编辑器
   */
  destroy(): void {
    if (!this._initialized) return

    // 销毁当前精灵
    if (this.currentSprite) {
      this.currentSprite.destroy()
      this.currentSprite = null
    }

    this.application.destroy()
    this._container = null
    this._initialized = false
    this.removeAllListeners()
    this.emit('destroyed')
  }
}

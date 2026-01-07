/**
 * 配置常量
 */

/**
 * 画布默认配置
 */
export const CANVAS_CONFIG = {
  /** 默认宽度 */
  DEFAULT_WIDTH: 1920,
  /** 默认高度 */
  DEFAULT_HEIGHT: 1080,
  /** 最小宽度 */
  MIN_WIDTH: 100,
  /** 最大宽度 */
  MAX_WIDTH: 10000,
  /** 最小高度 */
  MIN_HEIGHT: 100,
  /** 最大高度 */
  MAX_HEIGHT: 10000,
  /** 默认背景颜色 */
  DEFAULT_BACKGROUND: '#ffffff',
}

/**
 * 视口配置
 */
export const VIEWPORT_CONFIG = {
  /** 最小缩放 */
  MIN_ZOOM: 0.1,
  /** 最大缩放 */
  MAX_ZOOM: 10,
  /** 默认缩放 */
  DEFAULT_ZOOM: 1,
  /** 缩放步进 */
  ZOOM_STEP: 0.1,
  /** 缩放速度 */
  ZOOM_SPEED: 1.2,
}

/**
 * 历史记录配置
 */
export const HISTORY_CONFIG = {
  /** 最大历史记录数 */
  MAX_HISTORY: 50,
}

/**
 * 文件配置
 */
export const FILE_CONFIG = {
  /** 允许的图片格式 */
  ALLOWED_IMAGE_TYPES: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'],
  /** 最大文件大小（10MB） */
  MAX_FILE_SIZE: 10 * 1024 * 1024,
}

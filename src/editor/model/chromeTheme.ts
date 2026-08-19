/**
 * 壳层 token 与顶栏三分区目录。
 * 只描述视觉真源与分区，不持有选中状态，不改文档，不接线撤销 / 导出。
 */

export type ToolbarRegionId = 'document' | 'capsule' | 'deliver'

export interface ToolbarRegion {
  id: ToolbarRegionId
  label: string
}

/** Ant ConfigProvider 使用的 token 切片，不含组件覆盖。 */
export interface ChromeAntToken {
  colorPrimary: string
  colorSuccess: string
  colorWarning: string
  colorError: string
  colorText: string
  colorTextSecondary: string
  colorTextDisabled: string
  colorBorder: string
  colorSplit: string
  colorBgContainer: string
  colorBgLayout: string
  borderRadius: number
  fontSize: number
  fontFamily: string
  motionDurationMid: string
}

const TOOLBAR_REGIONS: readonly ToolbarRegion[] = [
  { id: 'document', label: '文档' },
  { id: 'capsule', label: '胶囊' },
  { id: 'deliver', label: '交付' },
]

/** 中央 host 与 Pixi 空舞台共用的浅灰，禁止改成强调色。 */
export const CHROME_HOST_BACKGROUND = '#ebebeb'

/** 选中 Tab 与「保存」主按钮共用的粉/红强调色。 */
export const CHROME_ACCENT = '#ff4d6d'

/** 选中 Tab 浅底。 */
export const CHROME_ACCENT_BG = 'rgb(255 77 109 / 12%)'

/** 顶栏与二级面板白底。 */
export const CHROME_SURFACE = '#ffffff'

/** 左侧分类 Tab 列浅灰。 */
export const CHROME_TAB_RAIL = '#f5f5f5'

/** 主文字。 */
export const CHROME_TEXT = 'rgb(0 0 0 / 88%)'

/** 次文字与表单标签。 */
export const CHROME_TEXT_SECONDARY = 'rgb(0 0 0 / 45%)'

/** 禁用文字。 */
export const CHROME_TEXT_DISABLED = 'rgb(0 0 0 / 25%)'

/** 分割线。 */
export const CHROME_BORDER = 'rgb(0 0 0 / 6%)'

/** 控件 hover 底。 */
export const CHROME_HOVER_BG = 'rgb(0 0 0 / 4%)'

/** Tab hover 字色。 */
export const CHROME_TEXT_HOVER = 'rgb(0 0 0 / 75%)'

/** 成功状态，走 Ant 默认绿。 */
export const CHROME_SUCCESS = '#52c41a'

/** 警告状态。 */
export const CHROME_WARNING = '#faad14'

/** 错误状态；不得与强调色相同。 */
export const CHROME_ERROR = '#ff4d4f'

/** 裁剪/选区外遮罩。 */
export const CHROME_OVERLAY_MASK = 'rgb(0 0 0 / 45%)'

/** overlay 框线。 */
export const CHROME_OVERLAY_STROKE = '#ffffff'

/** 裁剪井字线。 */
export const CHROME_OVERLAY_GRID = 'rgb(255 255 255 / 70%)'

/** 允许的间距阶，单位 px。 */
export const CHROME_SPACE = [4, 8, 12, 16] as const

/** 字号阶，单位 px。 */
export const CHROME_FONT_SIZE = {
  caption: 11,
  body: 12,
  section: 13,
  brand: 14,
} as const

/** 按钮与输入圆角，单位 px。 */
export const CHROME_RADIUS_CONTROL = 6

/** 手风琴卡片圆角，单位 px。 */
export const CHROME_RADIUS_CARD = 8

/** 顶栏胶囊圆角，单位 px。 */
export const CHROME_RADIUS_PILL = 16

/** 壳层动效时长。 */
export const CHROME_MOTION = '150ms'

/** 中文友好系统字体栈，不引入 Web 字体。 */
export const CHROME_FONT_FAMILY =
  '-apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif'

/**
 * 返回固定顺序的顶栏三分区副本。
 *
 * @returns 三区：文档、胶囊、交付
 */
export function listToolbarRegions(): ToolbarRegion[] {
  return TOOLBAR_REGIONS.map(region => ({ ...region }))
}

/**
 * 把色板映射成壳层 CSS 变量。
 *
 * @returns `--chrome-*` 字典，供 Layout `:style` 挂载
 */
export function chromeCssVars(): Record<string, string> {
  return {
    '--chrome-accent': CHROME_ACCENT,
    '--chrome-accent-bg': CHROME_ACCENT_BG,
    '--chrome-surface': CHROME_SURFACE,
    '--chrome-tab-rail': CHROME_TAB_RAIL,
    '--chrome-host-bg': CHROME_HOST_BACKGROUND,
    '--chrome-text': CHROME_TEXT,
    '--chrome-text-secondary': CHROME_TEXT_SECONDARY,
    '--chrome-text-disabled': CHROME_TEXT_DISABLED,
    '--chrome-border': CHROME_BORDER,
    '--chrome-hover-bg': CHROME_HOVER_BG,
    '--chrome-text-hover': CHROME_TEXT_HOVER,
    '--chrome-success': CHROME_SUCCESS,
    '--chrome-warning': CHROME_WARNING,
    '--chrome-error': CHROME_ERROR,
    '--chrome-overlay-mask': CHROME_OVERLAY_MASK,
    '--chrome-overlay-stroke': CHROME_OVERLAY_STROKE,
    '--chrome-overlay-grid': CHROME_OVERLAY_GRID,
    '--chrome-radius-control': `${CHROME_RADIUS_CONTROL}px`,
    '--chrome-radius-card': `${CHROME_RADIUS_CARD}px`,
    '--chrome-radius-pill': `${CHROME_RADIUS_PILL}px`,
    '--chrome-motion': CHROME_MOTION,
    '--chrome-font': CHROME_FONT_FAMILY,
    '--chrome-font-caption': `${CHROME_FONT_SIZE.caption}px`,
    '--chrome-font-body': `${CHROME_FONT_SIZE.body}px`,
    '--chrome-font-section': `${CHROME_FONT_SIZE.section}px`,
    '--chrome-font-brand': `${CHROME_FONT_SIZE.brand}px`,
  }
}

/**
 * 把色板映射成 Ant Design Vue ConfigProvider token。
 *
 * @returns 可直接赋给 `theme.token` 的切片
 */
export function chromeAntTokens(): ChromeAntToken {
  return {
    colorPrimary: CHROME_ACCENT,
    colorSuccess: CHROME_SUCCESS,
    colorWarning: CHROME_WARNING,
    colorError: CHROME_ERROR,
    colorText: CHROME_TEXT,
    colorTextSecondary: CHROME_TEXT_SECONDARY,
    colorTextDisabled: CHROME_TEXT_DISABLED,
    colorBorder: CHROME_BORDER,
    colorSplit: CHROME_BORDER,
    colorBgContainer: CHROME_SURFACE,
    colorBgLayout: CHROME_HOST_BACKGROUND,
    borderRadius: CHROME_RADIUS_CONTROL,
    fontSize: CHROME_FONT_SIZE.body,
    fontFamily: CHROME_FONT_FAMILY,
    motionDurationMid: '0.15s',
  }
}

/**
 * 主题配置
 */

export interface Theme {
  name: string
  colors: {
    primary: string
    secondary: string
    background: string
    surface: string
    text: string
    textSecondary: string
    border: string
    success: string
    warning: string
    error: string
    info: string
  }
}

/**
 * 亮色主题
 */
export const LIGHT_THEME: Theme = {
  name: 'light',
  colors: {
    primary: '#1890ff',
    secondary: '#52c41a',
    background: '#f0f2f5',
    surface: '#ffffff',
    text: '#000000',
    textSecondary: '#666666',
    border: '#d9d9d9',
    success: '#52c41a',
    warning: '#faad14',
    error: '#f5222d',
    info: '#1890ff',
  },
}

/**
 * 暗色主题
 */
export const DARK_THEME: Theme = {
  name: 'dark',
  colors: {
    primary: '#1890ff',
    secondary: '#52c41a',
    background: '#141414',
    surface: '#1f1f1f',
    text: '#ffffff',
    textSecondary: '#999999',
    border: '#434343',
    success: '#52c41a',
    warning: '#faad14',
    error: '#f5222d',
    info: '#1890ff',
  },
}

/**
 * 主题列表
 */
export const THEMES = {
  light: LIGHT_THEME,
  dark: DARK_THEME,
}

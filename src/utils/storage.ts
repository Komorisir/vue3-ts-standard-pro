/**
 * 本地存储封装
 */

const STORAGE_PREFIX = 'photo-editor-'

/**
 * 设置本地存储
 */
export function setStorage(key: string, value: any): void {
  try {
    const data = JSON.stringify(value)
    localStorage.setItem(STORAGE_PREFIX + key, data)
  } catch (error) {
    console.error('Failed to set storage:', error)
  }
}

/**
 * 获取本地存储
 */
export function getStorage<T = any>(key: string, defaultValue?: T): T | null {
  try {
    const data = localStorage.getItem(STORAGE_PREFIX + key)
    if (data === null) {
      return defaultValue ?? null
    }
    return JSON.parse(data) as T
  } catch (error) {
    console.error('Failed to get storage:', error)
    return defaultValue ?? null
  }
}

/**
 * 移除本地存储
 */
export function removeStorage(key: string): void {
  try {
    localStorage.removeItem(STORAGE_PREFIX + key)
  } catch (error) {
    console.error('Failed to remove storage:', error)
  }
}

/**
 * 清空本地存储
 */
export function clearStorage(): void {
  try {
    const keys = Object.keys(localStorage)
    keys.forEach(key => {
      if (key.startsWith(STORAGE_PREFIX)) {
        localStorage.removeItem(key)
      }
    })
  } catch (error) {
    console.error('Failed to clear storage:', error)
  }
}

/**
 * 检查存储是否存在
 */
export function hasStorage(key: string): boolean {
  return localStorage.getItem(STORAGE_PREFIX + key) !== null
}

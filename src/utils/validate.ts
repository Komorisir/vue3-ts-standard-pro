/**
 * 验证工具函数
 */

/**
 * 验证邮箱
 */
export function isEmail(email: string): boolean {
  const reg = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  return reg.test(email)
}

/**
 * 验证手机号
 */
export function isPhone(phone: string): boolean {
  const reg = /^1[3-9]\d{9}$/
  return reg.test(phone)
}

/**
 * 验证 URL
 */
export function isUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

/**
 * 验证颜色值（16进制）
 */
export function isHexColor(color: string): boolean {
  const reg = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/
  return reg.test(color)
}

/**
 * 验证数字范围
 */
export function isInRange(value: number, min: number, max: number): boolean {
  return value >= min && value <= max
}

/**
 * 验证文件类型
 */
export function isFileType(file: File, types: string[]): boolean {
  const extension = file.name.split('.').pop()?.toLowerCase()
  return extension ? types.includes(extension) : false
}

/**
 * 验证文件大小
 */
export function isFileSize(file: File, maxSize: number): boolean {
  return file.size <= maxSize
}

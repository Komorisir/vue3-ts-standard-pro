/**
 * 格式化工具函数
 */

/**
 * 格式化日期
 */
export function formatDate(date: Date | string | number, format = 'YYYY-MM-DD HH:mm:ss'): string {
  const d = new Date(date)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hour = String(d.getHours()).padStart(2, '0')
  const minute = String(d.getMinutes()).padStart(2, '0')
  const second = String(d.getSeconds()).padStart(2, '0')

  return format
    .replace('YYYY', String(year))
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hour)
    .replace('mm', minute)
    .replace('ss', second)
}

// /**
//  * 格式化数字（千分位）
//  */
// export function formatNumber(num: number, decimals = 0): string {
//   const fixed = num.toFixed(decimals)
//   const parts = fixed.split('.')
//   parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
//   return parts.join('.')
// }

/**
 * 格式化颜色（16进制）
 */
export function formatColor(color: number | string): string {
  if (typeof color === 'string') {
    return color
  }
  return '#' + color.toString(16).padStart(6, '0')
}

/**
 * 格式化角度（弧度转角度）
 */
export function formatAngle(radian: number, decimals = 2): number {
  const degree = radian * (180 / Math.PI)
  return Number(degree.toFixed(decimals))
}

/**
 * 格式化百分比
 */
export function formatPercent(value: number, decimals = 0): string {
  return (value * 100).toFixed(decimals) + '%'
}

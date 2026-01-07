/**
 * 防抖节流工具函数
 */

/**
 * 防抖函数
 * @param fn 需要防抖的函数
 * @param delay 延迟时间（毫秒）
 */
export function debounce<T extends (...args: any[]) => any>(fn: T, delay: number): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout> | null = null

  return function (this: any, ...args: Parameters<T>) {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      fn.apply(this, args)
      timer = null
    }, delay)
  }
}

/**
 * 节流函数
 * @param fn 需要节流的函数
 * @param delay 延迟时间（毫秒）
 */
export function throttle<T extends (...args: any[]) => any>(fn: T, delay: number): (...args: Parameters<T>) => void {
  let lastTime = 0

  return function (this: any, ...args: Parameters<T>) {
    const now = Date.now()
    if (now - lastTime >= delay) {
      fn.apply(this, args)
      lastTime = now
    }
  }
}

/**
 * 请求动画帧节流
 * @param fn 需要节流的函数
 */
export function rafThrottle<T extends (...args: any[]) => any>(fn: T): (...args: Parameters<T>) => void {
  let rafId: number | null = null

  return function (this: any, ...args: Parameters<T>) {
    if (rafId !== null) {
      return
    }
    rafId = requestAnimationFrame(() => {
      fn.apply(this, args)
      rafId = null
    })
  }
}

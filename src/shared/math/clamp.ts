/**
 * 无业务语义的数值工具。
 * 不负责视口、图层或 Pixi 坐标。
 */

/**
 * 将数值限制在闭区间 [min, max]。
 *
 * @param value 待限制的值
 * @param min 下界（含）
 * @param max 上界（含）
 * @returns 落在 [min, max] 内的值
 * @throws 当 min > max
 */
export function clamp(value: number, min: number, max: number): number {
  if (min > max) {
    throw new Error('clamp: min must be <= max')
  }

  return Math.min(max, Math.max(min, value))
}

import { describe, expect, it } from 'vitest'
import { clamp } from './clamp'

describe('clamp', () => {
  it('returns the value when it is inside the range', () => {
    expect(clamp(5, 0, 10)).toBe(5)
  })

  it('returns min when the value is below the range', () => {
    expect(clamp(-1, 0, 10)).toBe(0)
  })

  it('returns max when the value is above the range', () => {
    expect(clamp(11, 0, 10)).toBe(10)
  })

  it('returns the boundary when the value equals min or max', () => {
    expect(clamp(0, 0, 10)).toBe(0)
    expect(clamp(10, 0, 10)).toBe(10)
  })

  it('throws when min is greater than max', () => {
    expect(() => clamp(1, 10, 0)).toThrow(/min must be <= max/)
  })
})

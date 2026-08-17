import { describe, expect, it } from 'vitest'
import { EMPTY_DOCUMENT_HINT, PIXI_HOST_ID } from './canvasHostContract'

describe('canvasHostContract', () => {
  it('exports pixi-host as the canvas host id', () => {
    expect(PIXI_HOST_ID).toBe('pixi-host')
  })

  it('mentions drop or open in the empty-state copy', () => {
    expect(EMPTY_DOCUMENT_HINT).toMatch(/拖入|打开|drop|open/i)
  })
})

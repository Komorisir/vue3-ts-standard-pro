import { describe, expect, it } from 'vitest'
import { CHROME_HOST_BACKGROUND } from '@/editor/model/chromeTheme'
import { createPixiAppInitOptions, PIXI_APP_DESTROY_RENDERER, PIXI_APP_DESTROY_STAGE } from './pixiAppOptions'

describe('createPixiAppInitOptions', () => {
  it('points resizeTo at the given host and prefers WebGL with a host-matched background', () => {
    const host = document.createElement('div')
    const options = createPixiAppInitOptions(host)

    expect(options.resizeTo).toBe(host)
    expect(options.preference).toBe('webgl')
    expect(options.autoDensity).toBe(true)
    expect(options.background).toBe(CHROME_HOST_BACKGROUND)
    expect(options.background).toBe('#ebebeb')
  })
})

describe('Pixi destroy option bags', () => {
  it('removes the view and releases renderer global resources', () => {
    expect(PIXI_APP_DESTROY_RENDERER.removeView).toBe(true)
    expect(PIXI_APP_DESTROY_RENDERER.releaseGlobalResources).toBe(true)
  })

  it('destroys stage children, textures, and texture sources', () => {
    expect(PIXI_APP_DESTROY_STAGE.children).toBe(true)
    expect(PIXI_APP_DESTROY_STAGE.texture).toBe(true)
    expect(PIXI_APP_DESTROY_STAGE.textureSource).toBe(true)
  })
})

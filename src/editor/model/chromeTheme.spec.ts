import { describe, expect, it } from 'vitest'
import {
  CHROME_ACCENT,
  CHROME_ACCENT_BG,
  CHROME_BORDER,
  CHROME_ERROR,
  CHROME_FONT_FAMILY,
  CHROME_FONT_SIZE,
  CHROME_HOST_BACKGROUND,
  CHROME_HOVER_BG,
  CHROME_OVERLAY_MASK,
  CHROME_RADIUS_CARD,
  CHROME_RADIUS_CONTROL,
  CHROME_SPACE,
  CHROME_SUCCESS,
  CHROME_SURFACE,
  CHROME_TAB_RAIL,
  CHROME_TEXT,
  CHROME_TEXT_DISABLED,
  CHROME_TEXT_HOVER,
  CHROME_TEXT_SECONDARY,
  CHROME_WARNING,
  chromeAntTokens,
  chromeCssVars,
  listToolbarRegions,
} from './chromeTheme'

describe('listToolbarRegions', () => {
  it('returns 文档、历史、交付 in that order', () => {
    expect(listToolbarRegions().map(region => region.label)).toEqual(['文档', '历史', '交付'])
    expect(listToolbarRegions().map(region => region.id)).toEqual(['document', 'history', 'deliver'])
  })
})

describe('chrome palette', () => {
  it('locks host, accent, surface, tab rail, text, border, status, hover, and overlay mask', () => {
    expect(CHROME_HOST_BACKGROUND).toBe('#ebebeb')
    expect(CHROME_ACCENT).toBe('#ff4d6d')
    expect(CHROME_SURFACE).toBe('#ffffff')
    expect(CHROME_TAB_RAIL).toBe('#f5f5f5')
    expect(CHROME_TEXT).toBe('rgb(0 0 0 / 88%)')
    expect(CHROME_TEXT_SECONDARY).toBe('rgb(0 0 0 / 45%)')
    expect(CHROME_TEXT_DISABLED).toBe('rgb(0 0 0 / 25%)')
    expect(CHROME_BORDER).toBe('rgb(0 0 0 / 6%)')
    expect(CHROME_HOVER_BG).toBe('rgb(0 0 0 / 4%)')
    expect(CHROME_TEXT_HOVER).toBe('rgb(0 0 0 / 75%)')
    expect(CHROME_ACCENT_BG).toBe('rgb(255 77 109 / 12%)')
    expect(CHROME_SUCCESS).toBe('#52c41a')
    expect(CHROME_WARNING).toBe('#faad14')
    expect(CHROME_ERROR).toBe('#ff4d4f')
    expect(CHROME_OVERLAY_MASK).toBe('rgb(0 0 0 / 45%)')
    expect(CHROME_ERROR).not.toBe(CHROME_ACCENT)
  })
})

describe('chrome scale', () => {
  it('allows only 4/8/12/16 spacing, 11/12/13/14 type, and 6/8 radii', () => {
    expect(CHROME_SPACE).toEqual([4, 8, 12, 16])
    expect(CHROME_FONT_SIZE).toEqual({ caption: 11, body: 12, section: 13, brand: 14 })
    expect(CHROME_RADIUS_CONTROL).toBe(6)
    expect(CHROME_RADIUS_CARD).toBe(8)
    expect(CHROME_FONT_FAMILY).toContain('PingFang SC')
    expect(CHROME_FONT_FAMILY).toContain('Microsoft YaHei')
  })
})

describe('chrome mappings', () => {
  it('maps accent, body size, and control radius into Ant tokens', () => {
    const token = chromeAntTokens()
    expect(token.colorPrimary).toBe(CHROME_ACCENT)
    expect(token.fontSize).toBe(12)
    expect(token.borderRadius).toBe(6)
  })

  it('exports CSS variables from the same palette', () => {
    const vars = chromeCssVars()
    expect(vars['--chrome-accent']).toBe(CHROME_ACCENT)
    expect(vars['--chrome-host-bg']).toBe(CHROME_HOST_BACKGROUND)
    expect(vars['--chrome-text']).toBe(CHROME_TEXT)
    expect(vars['--chrome-overlay-mask']).toBe(CHROME_OVERLAY_MASK)
  })
})

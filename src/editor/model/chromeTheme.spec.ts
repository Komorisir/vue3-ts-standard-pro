import { describe, expect, it } from 'vitest'
import { CHROME_ACCENT, CHROME_HOST_BACKGROUND, listToolbarRegions } from './chromeTheme'

describe('listToolbarRegions', () => {
  it('returns 文档、历史、交付 in that order', () => {
    expect(listToolbarRegions().map(region => region.label)).toEqual(['文档', '历史', '交付'])
    expect(listToolbarRegions().map(region => region.id)).toEqual(['document', 'history', 'deliver'])
  })
})

describe('chrome tokens', () => {
  it('uses #ebebeb for the host and one pink-red accent for tab and Save', () => {
    expect(CHROME_HOST_BACKGROUND).toBe('#ebebeb')
    expect(CHROME_ACCENT).toBe('#ff4d6d')
  })
})

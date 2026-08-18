import { describe, expect, it } from 'vitest'
import { DEFAULT_WORKSPACE_TAB, isWorkspaceImplemented, listWorkspaceTabs } from './workspaceTabs'

describe('listWorkspaceTabs', () => {
  it('returns exactly 调整、滤镜调色、人像、抠图、画笔、素材 in that order', () => {
    expect(listWorkspaceTabs().map(tab => tab.label)).toEqual(['调整', '滤镜调色', '人像', '抠图', '画笔', '素材'])
  })
})

describe('DEFAULT_WORKSPACE_TAB and isWorkspaceImplemented', () => {
  it('defaults to 调整 and marks only 调整 as implemented', () => {
    const tabs = listWorkspaceTabs()
    expect(DEFAULT_WORKSPACE_TAB).toBe('adjust')
    expect(tabs.find(tab => tab.id === DEFAULT_WORKSPACE_TAB)?.label).toBe('调整')
    expect(tabs.map(tab => isWorkspaceImplemented(tab.id))).toEqual([true, false, false, false, false, false])
  })
})

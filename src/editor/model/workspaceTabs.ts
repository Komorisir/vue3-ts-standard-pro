/**
 * 左侧工作区 Tab 目录。
 * 只描述壳层分类与是否已实现，不持有选中状态，不改文档。
 */

export type WorkspaceTabId = 'adjust' | 'color' | 'portrait' | 'cutout' | 'brush' | 'materials'

export interface WorkspaceTab {
  id: WorkspaceTabId
  label: string
}

const WORKSPACE_TABS: readonly WorkspaceTab[] = [
  { id: 'adjust', label: '调整' },
  { id: 'color', label: '滤镜调色' },
  { id: 'portrait', label: '人像' },
  { id: 'cutout', label: '抠图' },
  { id: 'brush', label: '画笔' },
  { id: 'materials', label: '素材' },
]

const WORKSPACE_TAB_IDS = new Set<WorkspaceTabId>(WORKSPACE_TABS.map(tab => tab.id))

/** 首次进入编辑器时选中的工作区。 */
export const DEFAULT_WORKSPACE_TAB: WorkspaceTabId = 'adjust'

/**
 * 返回固定顺序的工作区目录副本。
 *
 * @returns 六项 Tab：调整、滤镜调色、人像、抠图、画笔、素材
 */
export function listWorkspaceTabs(): WorkspaceTab[] {
  return WORKSPACE_TABS.map(tab => ({ ...tab }))
}

/**
 * 判断该工作区是否已接线真实工具。当前仅调整已实现。
 *
 * @param id 工作区 id
 * @returns 仅 `adjust` 为 true
 * @throws 当 id 不是目录中的项
 */
export function isWorkspaceImplemented(id: WorkspaceTabId): boolean {
  if (!WORKSPACE_TAB_IDS.has(id)) {
    throw new Error(`isWorkspaceImplemented: unknown workspace tab "${String(id)}"`)
  }
  return id === DEFAULT_WORKSPACE_TAB
}

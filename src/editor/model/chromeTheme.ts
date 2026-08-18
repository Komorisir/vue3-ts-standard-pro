/**
 * 壳层色板与顶栏三分区目录。
 * 只描述 token 与分区，不持有选中状态，不改文档，不接线撤销 / 导出。
 */

export type ToolbarRegionId = 'document' | 'history' | 'deliver'

export interface ToolbarRegion {
  id: ToolbarRegionId
  label: string
}

const TOOLBAR_REGIONS: readonly ToolbarRegion[] = [
  { id: 'document', label: '文档' },
  { id: 'history', label: '历史' },
  { id: 'deliver', label: '交付' },
]

/** 中央 host 与 Pixi 空舞台共用的浅灰，禁止改成强调色。 */
export const CHROME_HOST_BACKGROUND = '#ebebeb'

/** 选中 Tab 与「保存」主按钮共用的粉/红强调色。 */
export const CHROME_ACCENT = '#ff4d6d'

/** 顶栏与二级面板白底。 */
export const CHROME_SURFACE = '#ffffff'

/** 左侧分类 Tab 列浅灰。 */
export const CHROME_TAB_RAIL = '#f5f5f5'

/**
 * 返回固定顺序的顶栏三分区副本。
 *
 * @returns 三区：文档、历史、交付
 */
export function listToolbarRegions(): ToolbarRegion[] {
  return TOOLBAR_REGIONS.map(region => ({ ...region }))
}

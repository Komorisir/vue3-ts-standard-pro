/**
 * 画布 host 的公开契约。
 * 不含 Vue 与 Pixi，供 UI 与 usePixiApp 共用 id / 空态文案。
 */

/** 稳定 host 元素 id，feat-005 的 resizeTo 指向该节点。 */
export const PIXI_HOST_ID = 'pixi-host'

/**
 * 空文档时的提示。有导入图层后由 CanvasHost 隐藏。
 */
export const EMPTY_DOCUMENT_HINT = '拖入图片或点击打开'

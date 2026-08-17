/**
 * 编辑器文档类型。
 * 只描述图层与变换，不含 Pixi DisplayObject。
 */

export type LayerId = string

export type LayerKind = 'image' | 'text' | 'shape'

export interface Transform2D {
  x: number
  y: number
  scaleX: number
  scaleY: number
  /** 弧度 */
  rotation: number
}

export interface BaseLayer {
  id: LayerId
  name: string
  kind: LayerKind
  visible: boolean
  locked: boolean
  transform: Transform2D
}

export interface ImageLayer extends BaseLayer {
  kind: 'image'
  objectUrl: string
  naturalWidth: number
  naturalHeight: number
}

export type EditorLayer = ImageLayer

export type EditorToolId = 'pan'

export interface ViewportState {
  x: number
  y: number
  scale: number
}

export interface WorldRect {
  x: number
  y: number
  width: number
  height: number
}

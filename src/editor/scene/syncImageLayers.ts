/**
 * 按 layer.id 把文档图片层同步到 content。
 * 不重建整棵树，不把 Sprite 写回 store。
 */
import { Assets, Container, Graphics, Sprite } from 'pixi.js'
import { spriteMaskRectFromCropRect } from '@/editor/model/imageAdjust'
import { visibleImageAnchor } from '@/editor/model/viewportMath'
import type { EditorLayer, ImageLayer } from '@/editor/model/types'

function isImageLayer(layer: EditorLayer): layer is ImageLayer {
  return layer.kind === 'image'
}

/**
 * 增删改 content 中的 Sprite，使它们与文档图层一致。
 *
 * @param content 场景 content 容器（sortableChildren）
 * @param layers 文档图层，数组末尾为顶层
 */
export async function syncImageLayers(content: Container, layers: readonly EditorLayer[]): Promise<void> {
  const imageLayers = layers.filter(isImageLayer)
  const wantedIds = new Set(imageLayers.map(layer => layer.id))

  for (const child of [...content.children]) {
    if (!wantedIds.has(child.label)) {
      content.removeChild(child)
      child.destroy()
    }
  }

  for (const [index, layer] of imageLayers.entries()) {
    try {
      await applyImageLayer(content, layer, index)
    } catch (error) {
      console.error(`syncImageLayers: skip layer ${layer.id}`, error)
    }
  }
}

async function applyImageLayer(content: Container, layer: ImageLayer, zIndex: number): Promise<void> {
  let sprite = content.children.find(child => child.label === layer.id)
  if (!(sprite instanceof Sprite)) {
    const texture = await Assets.load({
      src: layer.objectUrl,
      parser: 'texture',
    })
    sprite = new Sprite({
      texture,
      anchor: 0.5,
      label: layer.id,
    })
    content.addChild(sprite)
  }

  const imageSprite = sprite as Sprite
  const anchor = visibleImageAnchor(layer)

  imageSprite.visible = layer.visible
  imageSprite.anchor.set(anchor.x, anchor.y)
  imageSprite.position.set(layer.transform.x, layer.transform.y)
  imageSprite.scale.set(
    layer.transform.scaleX * (layer.flipX ? -1 : 1),
    layer.transform.scaleY * (layer.flipY ? -1 : 1),
  )
  imageSprite.rotation = layer.transform.rotation
  imageSprite.zIndex = zIndex

  applyCropMask(imageSprite, layer)
}

function applyCropMask(sprite: Sprite, layer: ImageLayer): void {
  if (!layer.crop) {
    if (sprite.mask instanceof Graphics) {
      sprite.mask.destroy()
    }
    sprite.mask = null
    return
  }

  const previousMask = sprite.mask
  const mask = previousMask instanceof Graphics ? previousMask : new Graphics()
  const rect = spriteMaskRectFromCropRect(layer.crop)

  mask.clear()
  mask.rect(rect.x, rect.y, rect.width, rect.height).fill(0xffffff)
  if (!(previousMask instanceof Graphics)) {
    sprite.addChild(mask)
  }
  sprite.mask = mask
}

/**
 * 按 layer.id 把文档图片层同步到 content。
 * 不重建整棵树，不把 Sprite 写回 store。
 */
import { Assets, Container, Sprite } from 'pixi.js'
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

  sprite.visible = layer.visible
  sprite.position.set(layer.transform.x, layer.transform.y)
  sprite.scale.set(layer.transform.scaleX, layer.transform.scaleY)
  sprite.rotation = layer.transform.rotation
  sprite.zIndex = zIndex
}

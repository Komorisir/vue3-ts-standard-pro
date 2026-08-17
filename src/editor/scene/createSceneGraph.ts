/**
 * 舞台分层：viewport → world → background | content | overlay。
 * 只搭建空容器，不导入图片、不读写 store。
 */
import { Container, type Application } from 'pixi.js'

export const SCENE_LABEL = {
  viewport: 'viewport',
  world: 'world',
  background: 'background',
  content: 'content',
  overlay: 'overlay',
} as const

export interface SceneGraph {
  viewport: Container
  world: Container
  background: Container
  content: Container
  overlay: Container
}

/**
 * 在已初始化的 Application 上挂一层 identity 视口与世界分组。
 *
 * @param app 已 `init` 完成的渲染器
 * @returns 可供同步使用的场景节点
 */
export function createSceneGraph(app: Application): SceneGraph {
  const viewport = new Container({ label: SCENE_LABEL.viewport })
  const world = new Container({ label: SCENE_LABEL.world })
  const background = new Container({ label: SCENE_LABEL.background })
  const content = new Container({
    label: SCENE_LABEL.content,
    sortableChildren: true,
  })
  const overlay = new Container({ label: SCENE_LABEL.overlay })

  world.addChild(background, content, overlay)
  viewport.addChild(world)
  app.stage.addChild(viewport)

  viewport.position.set(0, 0)
  viewport.scale.set(1)
  viewport.rotation = 0

  return { viewport, world, background, content, overlay }
}

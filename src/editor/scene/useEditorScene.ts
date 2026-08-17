/**
 * 将已初始化的 Application 接到场景分层，并按文档单向同步。
 * 不创建渲染器，不处理 File。
 */
import { onUnmounted, watch, type ShallowRef } from 'vue'
import type { Application } from 'pixi.js'
import { useEditorStore } from '@/editor/store/editor'
import { applyViewport } from './applyViewport'
import { createSceneGraph, type SceneGraph } from './createSceneGraph'
import { syncImageLayers } from './syncImageLayers'

/**
 * 在 `app` 非空时搭建 viewport/world 分组，并把 `layers` 同步到 content。
 *
 * @param app `usePixiApp` 返回的渲染器引用
 */
export function useEditorScene(app: ShallowRef<Application | null>): void {
  const store = useEditorStore()
  let graph: SceneGraph | null = null

  /**
   * 按 host 当前布局重设渲染器，并把可见尺寸写入文档。
   *
   * @param app 已 init 的 Application
   * @param host 画布宿主
   * @param setViewSize 文档可见尺寸 action
   */
  function syncHostViewSize(
    app: Application,
    host: HTMLElement,
    setViewSize: (width: number, height: number) => void,
  ): void {
    app.resize()
    setViewSize(host.clientWidth, host.clientHeight)
  }

  async function syncContent(): Promise<void> {
    if (!graph) {
      return
    }
    await syncImageLayers(graph.content, store.layers)
  }

  watch(
    app,
    (instance, _previous, onCleanup) => {
      graph = null
      if (!instance) {
        return
      }

      graph = createSceneGraph(instance)
      applyViewport(graph.viewport, store.viewport)
      const host = instance.canvas.parentElement
      if (host) {
        try {
          syncHostViewSize(instance, host, store.setViewSize)
        } catch (error) {
          console.error('useEditorScene: initial view size failed', error)
        }
      }
      void syncContent().catch(error => {
        console.error('useEditorScene: initial sync failed', error)
      })

      if (!host || typeof ResizeObserver === 'undefined') {
        return
      }

      const observer = new ResizeObserver(() => {
        try {
          syncHostViewSize(instance, host, store.setViewSize)
        } catch (error) {
          console.error('useEditorScene: resize view size failed', error)
        }
      })
      observer.observe(host)
      onCleanup(() => {
        observer.disconnect()
        graph = null
      })
    },
    { immediate: true },
  )

  watch(
    () => store.viewport,
    state => {
      if (!graph) {
        return
      }
      applyViewport(graph.viewport, state)
    },
    { deep: true },
  )

  watch(
    () => store.layers,
    () => {
      void syncContent().catch(error => {
        console.error('useEditorScene: sync failed', error)
      })
    },
  )

  onUnmounted(() => {
    store.resetSession()
  })
}

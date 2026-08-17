/**
 * 引擎生命周期：在画布 host 上创建、挂载并销毁 PixiJS Application。
 * 向调用方暴露已初始化的实例；不搭建场景分层，不读写文档 store，不处理 File。
 */
import { onMounted, onUnmounted, shallowRef, type Ref, type ShallowRef } from 'vue'
import { Application } from 'pixi.js'
import { PIXI_HOST_ID } from '@/editor/canvas/canvasHostContract'
import { createPixiAppInitOptions, PIXI_APP_DESTROY_RENDERER, PIXI_APP_DESTROY_STAGE } from './pixiAppOptions'

/** 等待 host 获得非零尺寸的最大动画帧次数。 */
const HOST_SIZE_RETRY_LIMIT = 30

/**
 * 按官方选项销毁 Application，失败只记日志，不抛到页面。
 *
 * @param app 待销毁实例；空值直接返回
 */
function destroyPixiApp(app: Application | null): void {
  if (!app) {
    return
  }

  try {
    app.destroy(PIXI_APP_DESTROY_RENDERER, PIXI_APP_DESTROY_STAGE)
  } catch (error) {
    console.error('usePixiApp: destroy failed', error)
  }
}

/**
 * 等到 host 有可测宽高，或重试耗尽 / 已过期。
 *
 * @param host 画布宿主
 * @param isStale 当前启动是否已被更新一代取代
 */
async function waitForHostSize(host: HTMLElement, isStale: () => boolean): Promise<void> {
  for (let attempt = 0; attempt < HOST_SIZE_RETRY_LIMIT; attempt += 1) {
    if (isStale()) {
      return
    }
    if (host.clientWidth > 0 && host.clientHeight > 0) {
      return
    }
    await new Promise<void>(resolve => {
      requestAnimationFrame(() => {
        resolve()
      })
    })
  }
}

/**
 * 在 `#pixi-host` 上启动渲染器；卸载时销毁，避免留下第二块 canvas。
 *
 * @param hostRef 指向 host 根节点；缺省则按 `PIXI_HOST_ID` 查找
 * @returns `app`：init 成功后为实例，卸载或失败时为 `null`
 */
export function usePixiApp(hostRef?: Ref<HTMLElement | null>): { app: ShallowRef<Application | null> } {
  const appRef = shallowRef<Application | null>(null)
  let generation = 0
  let app: Application | null = null

  onMounted(() => {
    generation += 1
    const gen = generation
    void start(gen)
  })

  onUnmounted(() => {
    generation += 1
    destroyPixiApp(app)
    app = null
    appRef.value = null
  })

  async function start(gen: number): Promise<void> {
    const isStale = (): boolean => gen !== generation
    const host = hostRef?.value ?? document.getElementById(PIXI_HOST_ID)
    if (!host) {
      console.error(`usePixiApp: host #${PIXI_HOST_ID} not found`)
      return
    }

    await waitForHostSize(host, isStale)
    if (isStale()) {
      return
    }

    const instance = new Application()
    try {
      await instance.init(createPixiAppInitOptions(host))
    } catch (error) {
      console.error('usePixiApp: init failed', error)
      destroyPixiApp(instance)
      return
    }

    if (isStale()) {
      destroyPixiApp(instance)
      return
    }

    host.appendChild(instance.canvas)
    try {
      instance.resize()
    } catch (error) {
      console.error('usePixiApp: initial resize failed', error)
    }
    if (isStale()) {
      destroyPixiApp(instance)
      return
    }

    app = instance
    appRef.value = instance
  }

  return { app: appRef }
}

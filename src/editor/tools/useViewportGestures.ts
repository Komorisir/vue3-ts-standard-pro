/**
 * 视口平移与滚轮缩放手势。
 * 只调用 store actions，不 import pixi.js。
 */
import { onMounted, onUnmounted, watch, type Ref } from 'vue'
import { useEditorStore } from '@/editor/store/editor'

const PAN_MOVE_THRESHOLD = 3

function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) {
    return false
  }
  return target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable
}

/**
 * 在 host 上监听拖平移、中键平移、空格暂切与滚轮缩放。
 *
 * @param hostRef 画布宿主
 * @returns `consumeClickSuppressed`：若本次是平移拖拽则吞掉随后的 click
 */
export function useViewportGestures(hostRef: Ref<HTMLElement | null>): {
  consumeClickSuppressed: () => boolean
} {
  const store = useEditorStore()
  let dragging = false
  let moved = false
  let suppressClick = false
  let originX = 0
  let originY = 0

  function consumeClickSuppressed(): boolean {
    const skipped = suppressClick
    suppressClick = false
    return skipped
  }

  function onPointerDown(event: PointerEvent): void {
    const panWithLeft = event.button === 0 && store.isPanMode
    const panWithMiddle = event.button === 1
    if (!panWithLeft && !panWithMiddle) {
      return
    }
    dragging = true
    moved = false
    originX = event.clientX
    originY = event.clientY
    event.preventDefault()
    const host = hostRef.value
    host?.setPointerCapture(event.pointerId)
  }

  function onPointerMove(event: PointerEvent): void {
    if (!dragging) {
      return
    }
    const dist = Math.hypot(event.clientX - originX, event.clientY - originY)
    if (dist >= PAN_MOVE_THRESHOLD) {
      moved = true
    }
    store.panBy(event.movementX, event.movementY)
  }

  function onPointerUp(event: PointerEvent): void {
    if (!dragging) {
      return
    }
    dragging = false
    if (moved) {
      suppressClick = true
    }
    const host = hostRef.value
    if (host?.hasPointerCapture(event.pointerId)) {
      host.releasePointerCapture(event.pointerId)
    }
  }

  function onWheel(event: WheelEvent): void {
    event.preventDefault()
    const host = hostRef.value
    if (!host) {
      return
    }
    const rect = host.getBoundingClientRect()
    const factor = Math.exp(-event.deltaY * 0.002)
    store.zoomAt(event.clientX - rect.left, event.clientY - rect.top, factor)
  }

  function onKeyDown(event: KeyboardEvent): void {
    if (event.code !== 'Space' || event.repeat || isEditableTarget(event.target)) {
      return
    }
    event.preventDefault()
    store.setSpacePan(true)
  }

  function onKeyUp(event: KeyboardEvent): void {
    if (event.code !== 'Space') {
      return
    }
    store.setSpacePan(false)
  }

  function onBlur(): void {
    store.setSpacePan(false)
    dragging = false
  }

  watch(
    hostRef,
    (host, _previous, onCleanup) => {
      if (!host) {
        return
      }
      host.addEventListener('pointerdown', onPointerDown)
      host.addEventListener('pointermove', onPointerMove)
      host.addEventListener('pointerup', onPointerUp)
      host.addEventListener('pointercancel', onPointerUp)
      host.addEventListener('wheel', onWheel, { passive: false })
      onCleanup(() => {
        host.removeEventListener('pointerdown', onPointerDown)
        host.removeEventListener('pointermove', onPointerMove)
        host.removeEventListener('pointerup', onPointerUp)
        host.removeEventListener('pointercancel', onPointerUp)
        host.removeEventListener('wheel', onWheel)
      })
    },
    { immediate: true },
  )

  onMounted(() => {
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    window.addEventListener('blur', onBlur)
  })

  onUnmounted(() => {
    window.removeEventListener('keydown', onKeyDown)
    window.removeEventListener('keyup', onKeyUp)
    window.removeEventListener('blur', onBlur)
    store.setSpacePan(false)
  })

  return { consumeClickSuppressed }
}

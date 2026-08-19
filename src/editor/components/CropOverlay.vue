<script setup lang="ts">
/**
 * 画布内裁剪框与遮罩。
 * 只读写 store 公开的裁剪会话，不 import pixi.js。
 */
import { computed, onUnmounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { clampCropRectFree, resizeCropRectFromHandle, type CropResizeHandle } from '@/editor/model/imageAdjust'
import { cropOverlayLayout, screenDeltaToImageLocal, visibleImageRect } from '@/editor/model/viewportMath'
import { useEditorStore } from '@/editor/store/editor'

const CROP_HANDLES: CropResizeHandle[] = ['nw', 'n', 'ne', 'w', 'e', 'sw', 's', 'se']

const store = useEditorStore()
const { isCropSessionActive, cropSessionDraft, isPanMode, mainImage, viewport } = storeToRefs(store)
const isDragging = ref(false)

const layout = computed(() => {
  if (!mainImage.value || !cropSessionDraft.value) {
    return null
  }
  return cropOverlayLayout(mainImage.value, cropSessionDraft.value, viewport.value)
})

type CropDragMode = 'move' | CropResizeHandle

let dragMode: CropDragMode | null = null
let dragStartX = 0
let dragStartY = 0
let dragStartRect: { x: number; y: number; width: number; height: number } | null = null

function onCropPointerDown(event: PointerEvent, mode: CropDragMode): void {
  if (!mainImage.value || !cropSessionDraft.value || isPanMode.value) {
    return
  }
  dragMode = mode
  isDragging.value = true
  dragStartX = event.clientX
  dragStartY = event.clientY
  dragStartRect = { ...cropSessionDraft.value }
  event.preventDefault()
  window.addEventListener('pointermove', onCropPointerMove)
  window.addEventListener('pointerup', onCropPointerUp)
}

function onCropPointerMove(event: PointerEvent): void {
  if (!dragMode || !dragStartRect || !mainImage.value || !layout.value || layout.value.stageWidth <= 0) {
    return
  }
  const image = mainImage.value
  const working = visibleImageRect(image)
  const local = screenDeltaToImageLocal(
    event.clientX - dragStartX,
    event.clientY - dragStartY,
    image.transform.rotation,
    Boolean(image.flipX),
    Boolean(image.flipY),
  )
  const deltaX = local.x * (layout.value.workingWidth / layout.value.stageWidth)
  const deltaY = local.y * (layout.value.workingHeight / layout.value.stageHeight)
  const ratio = { width: dragStartRect.width, height: dragStartRect.height }
  const imageSize = { width: working.width, height: working.height }

  if (dragMode === 'move') {
    store.previewCrop(
      clampCropRectFree(
        {
          x: dragStartRect.x + deltaX,
          y: dragStartRect.y + deltaY,
          width: dragStartRect.width,
          height: dragStartRect.height,
        },
        working,
      ),
    )
    return
  }

  store.previewCrop(resizeCropRectFromHandle(dragStartRect, dragMode, deltaX, deltaY, imageSize, ratio, working))
}

function onCropPointerUp(): void {
  dragMode = null
  dragStartRect = null
  isDragging.value = false
  window.removeEventListener('pointermove', onCropPointerMove)
  window.removeEventListener('pointerup', onCropPointerUp)
}

onUnmounted(() => {
  onCropPointerUp()
})
</script>

<template>
  <div
    v-if="isCropSessionActive && layout"
    class="crop-overlay"
    :style="{
      left: `${layout.stageLeft}px`,
      top: `${layout.stageTop}px`,
      width: `${layout.stageWidth}px`,
      height: `${layout.stageHeight}px`,
      transform: `rotate(${layout.rotationDeg}deg) scale(${layout.flipX ? -1 : 1}, ${layout.flipY ? -1 : 1})`,
      transformOrigin: `${layout.originX}% ${layout.originY}%`,
    }"
  >
    <div
      class="crop-overlay__box"
      :style="{
        left: `${layout.boxLeft}px`,
        top: `${layout.boxTop}px`,
        width: `${layout.boxWidth}px`,
        height: `${layout.boxHeight}px`,
      }"
      @pointerdown="event => onCropPointerDown(event, 'move')"
    >
      <div v-if="isDragging" class="crop-overlay__grid" aria-hidden="true">
        <span class="crop-overlay__grid-line crop-overlay__grid-line--v" />
        <span class="crop-overlay__grid-line crop-overlay__grid-line--v crop-overlay__grid-line--v2" />
        <span class="crop-overlay__grid-line crop-overlay__grid-line--h" />
        <span class="crop-overlay__grid-line crop-overlay__grid-line--h crop-overlay__grid-line--h2" />
      </div>
      <button
        v-for="handle in CROP_HANDLES"
        :key="handle"
        class="crop-overlay__handle"
        :class="`crop-overlay__handle--${handle}`"
        type="button"
        @pointerdown.stop="event => onCropPointerDown(event, handle)"
      />
    </div>
  </div>
</template>

<style scoped lang="less">
.crop-overlay {
  position: absolute;
  z-index: 2;
  pointer-events: none;
}

.crop-overlay__handle {
  position: absolute;
  width: 10px;
  height: 10px;
  padding: 0;
  background: #fff;
  border: 0;
  border-radius: 50%;
}

.crop-overlay__handle--n,
.crop-overlay__handle--s {
  width: 18px;
  height: 6px;
  border-radius: 1px;
}

.crop-overlay__handle--e,
.crop-overlay__handle--w {
  width: 6px;
  height: 18px;
  border-radius: 1px;
}

.crop-overlay__handle--nw {
  top: -5px;
  left: -5px;
  cursor: nwse-resize;
}

.crop-overlay__handle--n {
  top: -3px;
  left: 50%;
  cursor: ns-resize;
  transform: translateX(-50%);
}

.crop-overlay__handle--ne {
  top: -5px;
  right: -5px;
  cursor: nesw-resize;
}

.crop-overlay__handle--w {
  top: 50%;
  left: -3px;
  cursor: ew-resize;
  transform: translateY(-50%);
}

.crop-overlay__handle--e {
  top: 50%;
  right: -3px;
  cursor: ew-resize;
  transform: translateY(-50%);
}

.crop-overlay__handle--sw {
  bottom: -5px;
  left: -5px;
  cursor: nesw-resize;
}

.crop-overlay__handle--s {
  bottom: -3px;
  left: 50%;
  cursor: ns-resize;
  transform: translateX(-50%);
}

.crop-overlay__handle--se {
  right: -5px;
  bottom: -5px;
  cursor: nwse-resize;
}

.crop-overlay__box {
  position: absolute;
  box-sizing: border-box;
  pointer-events: auto;
  cursor: move;
  border: 1px solid #fff;
  box-shadow: 0 0 0 9999px rgb(0 0 0 / 45%);
}

.crop-overlay__grid {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.crop-overlay__grid-line {
  position: absolute;
  background: rgb(255 255 255 / 70%);
}

.crop-overlay__grid-line--v {
  top: 0;
  bottom: 0;
  left: 33.333%;
  width: 1px;
}

.crop-overlay__grid-line--v2 {
  left: 66.667%;
}

.crop-overlay__grid-line--h {
  top: 33.333%;
  right: 0;
  left: 0;
  height: 1px;
}

.crop-overlay__grid-line--h2 {
  top: 66.667%;
}
</style>

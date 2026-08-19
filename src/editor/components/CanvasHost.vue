<script setup lang="ts">
/**
 * 中央画布 host。
 * 组装引擎、场景同步与视口手势，并承接拖入 / 空态点击导入；不直接 import pixi.js。
 */
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { importImageFiles } from '@/editor/assets/loadLocalImage'
import { EMPTY_DOCUMENT_HINT, PIXI_HOST_ID } from '@/editor/canvas/canvasHostContract'
import { usePixiApp } from '@/editor/core/usePixiApp'
import { ACCEPTED_IMAGE_ACCEPT } from '@/editor/model/imageFile'
import { useEditorScene } from '@/editor/scene/useEditorScene'
import { useEditorStore } from '@/editor/store/editor'
import { useViewportGestures } from '@/editor/tools/useViewportGestures'
import CropOverlay from './CropOverlay.vue'

const hostRef = ref<HTMLElement | null>(null)
const fileInputRef = ref<HTMLInputElement | null>(null)
const { app } = usePixiApp(hostRef)
useEditorScene(app)
const { consumeClickSuppressed } = useViewportGestures(hostRef)

const store = useEditorStore()
const { layers, isViewportReady, activeTool, isPanMode } = storeToRefs(store)
const showHint = computed(() => layers.value.length === 0)

function onHostClick(): void {
  if (consumeClickSuppressed() || activeTool.value === 'pan') {
    return
  }
  if (layers.value.length !== 0 || !isViewportReady.value) {
    return
  }
  fileInputRef.value?.click()
}

async function onDrop(event: DragEvent): Promise<void> {
  const files = event.dataTransfer?.files
  if (!files?.length) {
    return
  }
  await importImageFiles(files)
}

async function onFileChange(event: Event): Promise<void> {
  const input = event.target
  if (!(input instanceof HTMLInputElement)) {
    return
  }
  if (input.files?.length) {
    await importImageFiles(input.files)
  }
  input.value = ''
}
</script>

<template>
  <div
    ref="hostRef"
    :id="PIXI_HOST_ID"
    class="canvas-host"
    :class="{ 'canvas-host--pan': isPanMode }"
    data-testid="pixi-host"
    @click="onHostClick"
    @dragover.prevent
    @drop.prevent="onDrop"
  >
    <input
      ref="fileInputRef"
      class="canvas-host__file"
      type="file"
      :accept="ACCEPTED_IMAGE_ACCEPT"
      @change="onFileChange"
      @click.stop
    />
    <p v-if="showHint" class="canvas-host__hint">{{ EMPTY_DOCUMENT_HINT }}</p>
    <CropOverlay />
  </div>
</template>

<style scoped lang="less">
.canvas-host {
  position: relative;
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-width: 1px;
  height: 100%;
  min-height: 0;
  overflow: hidden;
  background: var(--chrome-host-bg);

  :deep(canvas) {
    position: absolute;
    inset: 0;
    z-index: 0;
    display: block;
    width: 100%;
    height: 100%;
  }
}

.canvas-host--pan {
  cursor: grab;

  :deep(canvas) {
    cursor: grab;
  }
}

.canvas-host__file {
  display: none;
}

.canvas-host__hint {
  position: relative;
  z-index: 1;
  margin: 0;
  color: var(--chrome-text-secondary);
  pointer-events: none;
}
</style>

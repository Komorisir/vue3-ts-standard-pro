<script setup lang="ts">
/**
 * 顶栏中区胶囊：抓手、撤销重做、对比原图、适配。
 * 只调用 store 公开 action，不 import pixi.js。
 */
import { onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import { Button, Tooltip } from 'ant-design-vue'
import { Contrast, Five, FullScreen, Redo, Undo } from '@icon-park/vue-next'
import { useEditorStore } from '@/editor/store/editor'

const store = useEditorStore()
const { activeTool, canRedo, canUndo, isComparingOriginal, mainImage } = storeToRefs(store)

const hasImage = () => Boolean(mainImage.value)
const capsuleLocked = () => isComparingOriginal.value

function togglePan(): void {
  if (!hasImage() || capsuleLocked()) {
    return
  }
  store.setActiveTool(activeTool.value === 'pan' ? null : 'pan')
}

function undo(): void {
  if (capsuleLocked()) {
    return
  }
  store.undo()
}

function redo(): void {
  if (capsuleLocked()) {
    return
  }
  store.redo()
}

function fitView(): void {
  if (!hasImage() || capsuleLocked()) {
    return
  }
  store.fitView()
}

function onComparePointerDown(event: PointerEvent): void {
  if (!hasImage()) {
    return
  }
  event.preventDefault()
  store.setComparingOriginal(true)
  window.addEventListener('pointerup', onComparePointerUp)
  window.addEventListener('pointercancel', onComparePointerUp)
}

function onComparePointerUp(): void {
  store.setComparingOriginal(false)
  window.removeEventListener('pointerup', onComparePointerUp)
  window.removeEventListener('pointercancel', onComparePointerUp)
}

onUnmounted(() => {
  onComparePointerUp()
})
</script>

<template>
  <div class="toolbar-capsule" data-testid="toolbar-capsule" role="toolbar" aria-label="画布工具">
    <div class="toolbar-capsule__group">
      <Tooltip>
        <template #title>
          <span class="toolbar-capsule__tip">抓手 <kbd>空格</kbd></span>
        </template>
        <span class="toolbar-capsule__hit">
          <Button
            size="small"
            :type="activeTool === 'pan' ? 'primary' : 'default'"
            :disabled="!mainImage || isComparingOriginal"
            aria-label="抓手（空格暂切）"
            @click="togglePan"
          >
            <Five theme="outline" :size="16" />
          </Button>
        </span>
      </Tooltip>
    </div>
    <span class="toolbar-capsule__divider" aria-hidden="true" />
    <div class="toolbar-capsule__group">
      <Tooltip>
        <template #title>
          <span class="toolbar-capsule__tip">撤销 <kbd>Ctrl+Z</kbd></span>
        </template>
        <span class="toolbar-capsule__hit">
          <Button size="small" :disabled="!canUndo || isComparingOriginal" aria-label="撤销（Ctrl+Z）" @click="undo">
            <Undo theme="outline" :size="16" />
          </Button>
        </span>
      </Tooltip>
      <Tooltip>
        <template #title>
          <span class="toolbar-capsule__tip">重做 <kbd>Ctrl+Y</kbd></span>
        </template>
        <span class="toolbar-capsule__hit">
          <Button size="small" :disabled="!canRedo || isComparingOriginal" aria-label="重做（Ctrl+Y）" @click="redo">
            <Redo theme="outline" :size="16" />
          </Button>
        </span>
      </Tooltip>
    </div>
    <span class="toolbar-capsule__divider" aria-hidden="true" />
    <div class="toolbar-capsule__group">
      <Tooltip>
        <template #title>
          <span class="toolbar-capsule__tip">对比原图 <kbd>\</kbd></span>
        </template>
        <span class="toolbar-capsule__hit">
          <Button
            size="small"
            :type="isComparingOriginal ? 'primary' : 'default'"
            :disabled="!mainImage"
            aria-label="对比原图（\）"
            @pointerdown="onComparePointerDown"
          >
            <Contrast theme="outline" :size="16" />
          </Button>
        </span>
      </Tooltip>
    </div>
    <span class="toolbar-capsule__divider" aria-hidden="true" />
    <div class="toolbar-capsule__group">
      <Tooltip title="适配">
        <span class="toolbar-capsule__hit">
          <Button size="small" :disabled="!mainImage || isComparingOriginal" aria-label="适配" @click="fitView">
            <FullScreen theme="outline" :size="16" />
          </Button>
        </span>
      </Tooltip>
    </div>
  </div>
</template>

<style scoped lang="less">
.toolbar-capsule {
  display: inline-flex;
  gap: 0;
  align-items: center;
  height: 32px;
  padding: 0 4px;
  background: var(--chrome-surface);
  border: 1px solid var(--chrome-border);
  border-radius: var(--chrome-radius-pill);
}

.toolbar-capsule__group {
  display: flex;
  gap: 8px;
  align-items: center;
  padding-inline: 4px;
}

.toolbar-capsule__divider {
  display: block;
  width: 1px;
  height: 16px;
  background: var(--chrome-border);
}

.toolbar-capsule__hit {
  display: inline-flex;
}

.toolbar-capsule__tip {
  display: inline-flex;
  gap: 8px;
  align-items: center;
}

.toolbar-capsule__tip kbd {
  padding: 0 4px;
  font:
    11px/1.4 ui-monospace,
    SFMono-Regular,
    Menlo,
    Consolas,
    monospace;
  color: rgb(255 255 255 / 85%);
  background: rgb(255 255 255 / 16%);
  border: 1px solid rgb(255 255 255 / 28%);
  border-radius: 4px;
}

.toolbar-capsule :deep(.ant-btn) {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  padding-inline: 0;
  color: var(--chrome-text);

  &:disabled,
  &.ant-btn-disabled {
    color: var(--chrome-text-disabled);
    background: transparent;
    border-color: transparent;
    box-shadow: none;
    opacity: 1;
  }

  &:disabled svg,
  &.ant-btn-disabled svg {
    color: var(--chrome-text-disabled);
    opacity: 0.5;
    // fill: currentcolor;
  }
}
</style>

<script setup lang="ts">
/**
 * 编辑器顶栏三分区：左文档、中历史、右交付。
 * 「打开」导入图片，「适配」拟合视口；历史 / 撤销 / 重做 / 保存仍为占位。
 */
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { Button, Space } from 'ant-design-vue'
import { importImageFiles } from '@/editor/assets/loadLocalImage'
import { ACCEPTED_IMAGE_ACCEPT } from '@/editor/model/imageFile'
import { useEditorStore } from '@/editor/store/editor'

const fileInputRef = ref<HTMLInputElement | null>(null)
const store = useEditorStore()
const { canRedo, canUndo, isViewportReady } = storeToRefs(store)

function openPicker(): void {
  if (!isViewportReady.value) {
    return
  }
  fileInputRef.value?.click()
}

function fitView(): void {
  if (!isViewportReady.value) {
    return
  }
  store.fitView()
}

function undo(): void {
  store.undo()
}

function redo(): void {
  store.redo()
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
  <div class="editor-toolbar" data-testid="editor-toolbar">
    <div class="editor-toolbar__region editor-toolbar__region--document" data-testid="toolbar-region-document">
      <span class="editor-toolbar__title">编辑器</span>
      <Button size="small" :disabled="!isViewportReady" @click="openPicker">打开</Button>
    </div>
    <div class="editor-toolbar__region editor-toolbar__region--history" data-testid="toolbar-region-history">
      <Space>
        <Button disabled size="small">历史</Button>
        <Button size="small" :disabled="!canUndo" @click="undo">撤销</Button>
        <Button size="small" :disabled="!canRedo" @click="redo">重做</Button>
      </Space>
    </div>
    <div class="editor-toolbar__region editor-toolbar__region--deliver" data-testid="toolbar-region-deliver">
      <Space>
        <Button size="small" :disabled="!isViewportReady" @click="fitView">适配</Button>
        <Button disabled type="primary" size="small" data-testid="toolbar-save">保存</Button>
      </Space>
    </div>
    <input
      ref="fileInputRef"
      class="editor-toolbar__file"
      type="file"
      :accept="ACCEPTED_IMAGE_ACCEPT"
      @change="onFileChange"
    />
  </div>
</template>

<style scoped lang="less">
.editor-toolbar {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  width: 100%;
  height: 100%;
}

.editor-toolbar__region {
  display: flex;
  gap: 12px;
  align-items: center;
  min-width: 0;
}

.editor-toolbar__region--document {
  justify-content: flex-start;
}

.editor-toolbar__region--history {
  justify-content: center;
}

.editor-toolbar__region--deliver {
  justify-content: flex-end;
}

.editor-toolbar__title {
  font-size: var(--chrome-font-brand);
  font-weight: 600;
  color: var(--chrome-text);
}

.editor-toolbar__file {
  display: none;
}
</style>

<script setup lang="ts">
/**
 * 编辑器顶栏：左品牌+导入，中胶囊，右导出占位。
 * 导入接线文件选择器；导出本轮禁用。不 import pixi.js。
 */
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { Button, Tooltip } from 'ant-design-vue'
import { FolderOpen, Save } from '@icon-park/vue-next'
import { importImageFiles } from '@/editor/assets/loadLocalImage'
import { ACCEPTED_IMAGE_ACCEPT } from '@/editor/model/imageFile'
import { useEditorStore } from '@/editor/store/editor'
import { useCompareOriginalShortcut } from '@/editor/tools/useCompareOriginalShortcut'
import ToolbarCapsule from './ToolbarCapsule.vue'

const fileInputRef = ref<HTMLInputElement | null>(null)
const store = useEditorStore()
const { isViewportReady, isComparingOriginal } = storeToRefs(store)

useCompareOriginalShortcut()

function openPicker(): void {
  if (!isViewportReady.value || isComparingOriginal.value) {
    return
  }
  fileInputRef.value?.click()
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
      <Tooltip title="导入">
        <span class="editor-toolbar__hit">
          <Button
            size="small"
            :disabled="!isViewportReady || isComparingOriginal"
            aria-label="导入"
            @click="openPicker"
          >
            <FolderOpen theme="outline" :size="16" />
          </Button>
        </span>
      </Tooltip>
    </div>
    <div class="editor-toolbar__region editor-toolbar__region--capsule" data-testid="toolbar-region-capsule">
      <ToolbarCapsule />
    </div>
    <div class="editor-toolbar__region editor-toolbar__region--deliver" data-testid="toolbar-region-deliver">
      <Tooltip title="导出">
        <span class="editor-toolbar__hit">
          <Button disabled type="primary" size="small" aria-label="导出" data-testid="toolbar-export">
            <Save theme="outline" :size="16" />
          </Button>
        </span>
      </Tooltip>
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

.editor-toolbar__region--capsule {
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

.editor-toolbar__hit {
  display: inline-flex;
}

.editor-toolbar__file {
  display: none;
}

.editor-toolbar :deep(.ant-btn) {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  padding-inline: 0;
}
</style>

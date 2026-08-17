<script setup lang="ts">
/**
 * 编辑器顶栏。
 * 「打开」导入图片，「适配」拟合视口；撤销 / 重做 / 导出仍为占位。
 */
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { Button, Space } from 'ant-design-vue'
import { importImageFiles } from '@/editor/assets/loadLocalImage'
import { ACCEPTED_IMAGE_ACCEPT } from '@/editor/model/imageFile'
import { useEditorStore } from '@/editor/store/editor'

const fileInputRef = ref<HTMLInputElement | null>(null)
const store = useEditorStore()
const { isViewportReady } = storeToRefs(store)

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
    <span class="editor-toolbar__title">编辑器</span>
    <Space>
      <Button size="small" :disabled="!isViewportReady" @click="openPicker">打开</Button>
      <Button disabled size="small">撤销</Button>
      <Button disabled size="small">重做</Button>
      <Button size="small" :disabled="!isViewportReady" @click="fitView">适配</Button>
      <Button disabled size="small">导出</Button>
    </Space>
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
  display: flex;
  gap: 16px;
  align-items: center;
  height: 100%;
}

.editor-toolbar__title {
  font-weight: 600;
  color: rgb(255 255 255 / 88%);
}

.editor-toolbar__file {
  display: none;
}
</style>

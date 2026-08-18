<script setup lang="ts">
/**
 * 调整工作区工具栏。
 * 「平移」切换视口拖动手势；其余工具仍为占位。不负责工作区 Tab。
 */
import { storeToRefs } from 'pinia'
import { Button } from 'ant-design-vue'
import { useEditorStore } from '@/editor/store/editor'

const store = useEditorStore()
const { activeTool } = storeToRefs(store)

const restDisabled = ['裁剪', '文字', '形状'] as const

function togglePan(): void {
  store.setActiveTool(activeTool.value === 'pan' ? null : 'pan')
}
</script>

<template>
  <nav class="editor-tool-rail" data-testid="editor-tool-rail" aria-label="工具">
    <Button disabled block size="small">选择</Button>
    <Button block size="small" :type="activeTool === 'pan' ? 'primary' : 'default'" @click="togglePan"> 平移 </Button>
    <Button v-for="label in restDisabled" :key="label" disabled block size="small">
      {{ label }}
    </Button>
  </nav>
</template>

<style scoped lang="less">
.editor-tool-rail {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px 8px;
}
</style>

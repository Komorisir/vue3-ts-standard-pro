<script setup lang="ts">
/**
 * 编辑器路由页：只组装四区壳。
 * 不包含布局细节、Pixi Application 或图层业务。
 */
import CanvasHost from '@/editor/components/CanvasHost.vue'
import EditorSidePanel from '@/editor/components/EditorSidePanel.vue'
import EditorToolbar from '@/editor/components/EditorToolbar.vue'
import EditorToolRail from '@/editor/components/EditorToolRail.vue'
import EditorLayout from '@/layouts/EditorLayout.vue'
</script>

<template>
  <EditorLayout>
    <template #toolbar>
      <EditorToolbar />
    </template>
    <template #tools>
      <EditorToolRail />
    </template>
    <template #canvas>
      <CanvasHost />
    </template>
    <template #side>
      <EditorSidePanel />
    </template>
  </EditorLayout>
</template>

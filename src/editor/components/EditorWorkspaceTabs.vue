<script setup lang="ts">
/**
 * 左侧工作区分类 Tab 列。
 * 只渲染目录并回传选中 id，不持有文档、不改工具。
 */
import { Adjustment, ColorFilter, Cutting, Paint, People, Pic } from '@icon-park/vue-next'
import type { Component } from 'vue'
import { listWorkspaceTabs, type WorkspaceTabId } from '@/editor/model/workspaceTabs'

const TAB_ICONS: Record<WorkspaceTabId, Component> = {
  adjust: Adjustment,
  color: ColorFilter,
  portrait: People,
  cutout: Cutting,
  brush: Paint,
  materials: Pic,
}

defineProps<{
  selectedId: WorkspaceTabId
}>()

const emit = defineEmits<{
  select: [id: WorkspaceTabId]
}>()

const tabs = listWorkspaceTabs()
</script>

<template>
  <nav class="workspace-tabs" data-testid="editor-workspace-tabs" aria-label="工作区">
    <button
      v-for="tab in tabs"
      :key="tab.id"
      type="button"
      class="workspace-tabs__item"
      :class="{ 'workspace-tabs__item--active': tab.id === selectedId }"
      :data-testid="`workspace-tab-${tab.id}`"
      :aria-selected="tab.id === selectedId"
      @click="emit('select', tab.id)"
    >
      <component :is="TAB_ICONS[tab.id]" theme="outline" :size="18" />
      <span class="workspace-tabs__label">{{ tab.label }}</span>
    </button>
  </nav>
</template>

<style scoped lang="less">
.workspace-tabs {
  display: flex;
  flex-shrink: 0;
  flex-direction: column;
  gap: 4px;
  width: 64px;
  padding: 8px 4px;
  overflow: auto;
  background: var(--chrome-tab-rail, #f5f5f5);
  border-right: 1px solid rgb(0 0 0 / 6%);
}

.workspace-tabs__item {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: center;
  padding: 8px 4px;
  color: rgb(0 0 0 / 45%);
  cursor: pointer;
  background: transparent;
  border: 0;
  border-radius: 6px;
}

.workspace-tabs__item:hover {
  color: rgb(0 0 0 / 75%);
  background: rgb(0 0 0 / 4%);
}

.workspace-tabs__item--active {
  color: var(--chrome-accent, #ff4d6d);
  background: rgb(255 77 109 / 12%);
}

.workspace-tabs__item--active::before {
  position: absolute;
  top: 10px;
  bottom: 10px;
  left: 0;
  width: 2px;
  content: '';
  background: var(--chrome-accent, #ff4d6d);
  border-radius: 1px;
}

.workspace-tabs__label {
  font-size: 11px;
  line-height: 1.2;
  text-align: center;
}
</style>

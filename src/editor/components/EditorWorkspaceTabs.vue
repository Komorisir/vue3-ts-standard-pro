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
  background: var(--chrome-tab-rail);
  border-right: 1px solid var(--chrome-border);
}

.workspace-tabs__item {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: center;
  padding: 8px 4px;
  color: var(--chrome-text-secondary);
  cursor: pointer;
  background: transparent;
  border: 0;
  border-radius: var(--chrome-radius-control);
}

.workspace-tabs__item:hover {
  color: var(--chrome-text-hover);
  background: var(--chrome-hover-bg);
}

.workspace-tabs__item--active {
  color: var(--chrome-accent);
  background: var(--chrome-accent-bg);
}

.workspace-tabs__item--active::before {
  position: absolute;
  top: 10px;
  bottom: 10px;
  left: 0;
  width: 2px;
  content: '';
  background: var(--chrome-accent);
  border-radius: 1px;
}

.workspace-tabs__label {
  font-size: var(--chrome-font-caption);
  line-height: 1.2;
  text-align: center;
}
</style>

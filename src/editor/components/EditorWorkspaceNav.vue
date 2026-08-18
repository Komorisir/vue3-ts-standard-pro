<script setup lang="ts">
/**
 * 左侧工作区导航：分类 Tab + 邻接面板。
 * 选中 id 只留在本组件，不写入 Pinia 文档。
 */
import { computed, ref } from 'vue'
import {
  DEFAULT_WORKSPACE_TAB,
  isWorkspaceImplemented,
  listWorkspaceTabs,
  type WorkspaceTabId,
} from '@/editor/model/workspaceTabs'
import EditorToolRail from './EditorToolRail.vue'
import EditorWorkspacePlaceholder from './EditorWorkspacePlaceholder.vue'
import EditorWorkspaceTabs from './EditorWorkspaceTabs.vue'

const selectedId = ref<WorkspaceTabId>(DEFAULT_WORKSPACE_TAB)
const tabs = listWorkspaceTabs()

const selectedLabel = computed(() => {
  const tab = tabs.find(item => item.id === selectedId.value)
  return tab?.label ?? '调整'
})

function selectTab(id: WorkspaceTabId): void {
  selectedId.value = id
}
</script>

<template>
  <div class="workspace-nav" data-testid="editor-workspace-nav">
    <EditorWorkspaceTabs :selected-id="selectedId" @select="selectTab" />
    <div class="workspace-nav__panel" data-testid="editor-workspace-panel">
      <EditorToolRail v-if="isWorkspaceImplemented(selectedId)" />
      <EditorWorkspacePlaceholder v-else :title="selectedLabel" />
    </div>
  </div>
</template>

<style scoped lang="less">
.workspace-nav {
  display: flex;
  flex: 1;
  width: 100%;
  min-width: 0;
  height: 100%;
  min-height: 0;
}

.workspace-nav__panel {
  flex: 1;
  width: 220px;
  min-width: 0;
  overflow: auto;
  background: var(--chrome-surface, #fff);
}
</style>

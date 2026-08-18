<script setup lang="ts">
/**
 * 未落地工作区的共用占位面板。
 * 只展示标题与「即将推出」，不接线任何编辑能力。
 */
defineProps<{
  title: string
}>()
</script>

<template>
  <section class="workspace-placeholder" data-testid="editor-workspace-placeholder">
    <h2 class="workspace-placeholder__title">{{ title }}</h2>
    <p class="workspace-placeholder__hint">即将推出</p>
  </section>
</template>

<style scoped lang="less">
.workspace-placeholder {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px 12px;
}

.workspace-placeholder__title {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: rgb(0 0 0 / 88%);
}

.workspace-placeholder__hint {
  margin: 0;
  font-size: 12px;
  color: rgb(0 0 0 / 45%);
}
</style>

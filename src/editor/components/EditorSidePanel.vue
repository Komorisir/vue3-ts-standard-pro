<script setup lang="ts">
/**
 * 右侧图层面板 / 属性面板占位。
 * 不读取文档模型，不改图层。
 */
</script>

<template>
  <aside class="editor-side-panel" data-testid="editor-side-panel">
    <section>
      <h2 class="editor-side-panel__title">图层</h2>
      <p class="editor-side-panel__hint">暂无图层</p>
    </section>
    <section>
      <h2 class="editor-side-panel__title">属性</h2>
      <p class="editor-side-panel__hint">选中对象后可编辑</p>
    </section>
  </aside>
</template>

<style scoped lang="less">
.editor-side-panel {
  display: flex;
  flex-direction: column;
  gap: 16px;
  height: 100%;
  padding: 12px;
  overflow: auto;
}

.editor-side-panel__title {
  margin: 0 0 8px;
  font-size: 13px;
  font-weight: 600;
  color: rgb(0 0 0 / 88%);
}

.editor-side-panel__hint {
  margin: 0;
  font-size: 12px;
  color: rgb(0 0 0 / 45%);
}
</style>

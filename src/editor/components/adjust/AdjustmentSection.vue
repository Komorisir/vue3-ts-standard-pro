<script setup lang="ts">
/**
 * 调整面板手风琴分组。
 * 只负责标题、展开态与内容槽。
 */
import { Down, Right } from '@icon-park/vue-next'

defineProps<{
  title: string
  expanded: boolean
}>()

const emit = defineEmits<{
  toggle: []
}>()
</script>

<template>
  <section class="adjust-section">
    <button class="adjust-section__header" type="button" @click="emit('toggle')">
      <span>{{ title }}</span>
      <Down v-if="expanded" theme="outline" :size="14" />
      <Right v-else theme="outline" :size="14" />
    </button>
    <div v-if="expanded" class="adjust-section__body">
      <slot />
    </div>
  </section>
</template>

<style scoped lang="less">
.adjust-section {
  background: var(--chrome-surface);
  border: 1px solid var(--chrome-border);
  border-radius: var(--chrome-radius-card);
}

.adjust-section__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 12px;
  font: inherit;
  font-size: var(--chrome-font-section);
  font-weight: 600;
  color: var(--chrome-text);
  cursor: pointer;
  background: transparent;
  border: 0;
}

.adjust-section__body {
  padding: 0 12px 12px;
}
</style>

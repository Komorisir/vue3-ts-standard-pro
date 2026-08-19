<script setup lang="ts">
/**
 * 调整面板手风琴分组。
 * 只负责标题、展开态与内容槽。
 */
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
      <span>{{ expanded ? '∨' : '>' }}</span>
    </button>
    <div v-if="expanded" class="adjust-section__body">
      <slot />
    </div>
  </section>
</template>

<style scoped lang="less">
.adjust-section {
  background: #fff;
  border: 1px solid rgb(0 0 0 / 6%);
  border-radius: 10px;
}

.adjust-section__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 12px 14px;
  font: inherit;
  color: rgb(0 0 0 / 88%);
  cursor: pointer;
  background: transparent;
  border: 0;
}

.adjust-section__body {
  padding: 0 14px 14px;
}
</style>

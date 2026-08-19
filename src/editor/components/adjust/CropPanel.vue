<script setup lang="ts">
/**
 * 比例裁剪面板。
 * 只调 store action，不直接画 Sprite。
 */
import { computed } from 'vue'
import { Button } from 'ant-design-vue'
import { listCropRatios } from '@/editor/model/imageAdjust'
import { useEditorStore } from '@/editor/store/editor'

const emit = defineEmits<{
  applied: []
  cancelled: []
}>()

const store = useEditorStore()
const ratios = listCropRatios()
const disabled = computed(() => !store.mainImage)

function applyRatio(index: number): void {
  const option = ratios[index]
  store.selectCropRatio(option?.ratio)
}

function onApply(): void {
  store.commitCropSession()
  emit('applied')
}

function onCancel(): void {
  store.cancelCropSession()
  emit('cancelled')
}
</script>

<template>
  <div class="crop-panel">
    <p class="crop-panel__title">比例</p>
    <div class="crop-panel__ratios">
      <Button
        v-for="(item, index) in ratios"
        :key="item.label"
        size="small"
        :disabled="disabled"
        @click="applyRatio(index)"
      >
        {{ item.label }}
      </Button>
    </div>
    <div class="crop-panel__actions">
      <Button size="small" :disabled="disabled" @click="onCancel">取消</Button>
      <Button type="primary" size="small" :disabled="disabled" @click="onApply">应用</Button>
    </div>
  </div>
</template>

<style scoped lang="less">
.crop-panel {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.crop-panel__title {
  margin: 0;
  font-size: var(--chrome-font-body);
  color: var(--chrome-text-secondary);
}

.crop-panel__ratios {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.crop-panel__actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}
</style>

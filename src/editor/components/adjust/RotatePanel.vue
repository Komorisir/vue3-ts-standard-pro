<script setup lang="ts">
/**
 * 旋转与翻转面板。
 * 90°/翻转立即提交；自定义角度走预览 + commit。
 */
import { computed, ref, watch } from 'vue'
import { Button, Input } from 'ant-design-vue'
import { useEditorStore } from '@/editor/store/editor'

const store = useEditorStore()
const angleText = ref('0')
const disabled = computed(() => !store.mainImage)

watch(
  () => store.mainImage?.transform.rotation ?? 0,
  radians => {
    angleText.value = String(Math.round((radians * 180) / Math.PI))
  },
  { immediate: true },
)

function rotate(delta: number): void {
  store.rotateMainByDegrees(delta)
}

function flip(axis: 'x' | 'y'): void {
  store.flipMain(axis)
}

function onFocus(): void {
  store.beginAngleEdit()
}

function onInput(event: Event): void {
  const target = event.target
  if (!(target instanceof HTMLInputElement)) {
    return
  }
  angleText.value = target.value
  const parsed = Number(target.value)
  if (!Number.isFinite(parsed)) {
    return
  }
  store.previewAngleDegrees(parsed)
}

function onCommit(): void {
  const parsed = Number(angleText.value)
  if (Number.isFinite(parsed)) {
    store.previewAngleDegrees(parsed)
  }
  store.commitAngleEdit()
}
</script>

<template>
  <div class="rotate-panel">
    <div class="rotate-panel__buttons">
      <Button size="small" :disabled="disabled" @click="rotate(-90)">左旋90°</Button>
      <Button size="small" :disabled="disabled" @click="rotate(90)">右旋90°</Button>
      <Button size="small" :disabled="disabled" @click="flip('x')">左右翻转</Button>
      <Button size="small" :disabled="disabled" @click="flip('y')">上下翻转</Button>
    </div>
    <label class="rotate-panel__angle">
      <span>自定义角度</span>
      <Input
        size="small"
        :disabled="disabled"
        :value="angleText"
        @focus="onFocus"
        @input="onInput"
        @blur="onCommit"
        @keyup.enter="onCommit"
      />
    </label>
  </div>
</template>

<style scoped lang="less">
.rotate-panel {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.rotate-panel__buttons {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
}

.rotate-panel__angle {
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: var(--chrome-font-body);
  color: var(--chrome-text-secondary);
}
</style>

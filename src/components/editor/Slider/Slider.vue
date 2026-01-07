<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  /** 当前值 */
  modelValue?: number
  /** 最小值 */
  min?: number
  /** 最大值 */
  max?: number
  /** 步长 */
  step?: number
  /** 是否禁用 */
  disabled?: boolean
  /** 标签 */
  label?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: 0,
  min: 0,
  max: 100,
  step: 1,
  disabled: false,
  label: '',
})

const emit = defineEmits<{
  'update:modelValue': [value: number]
}>()

const percentage = computed(() => {
  return ((props.modelValue - props.min) / (props.max - props.min)) * 100
})

const handleInput = (event: Event) => {
  const value = Number((event.target as HTMLInputElement).value)
  emit('update:modelValue', value)
}
</script>

<template>
  <div class="slider" :class="{ disabled }">
    <div v-if="label" class="slider-label">
      {{ label }}
    </div>
    <div class="slider-container">
      <input
        type="range"
        class="slider-input"
        :value="modelValue"
        :min="min"
        :max="max"
        :step="step"
        :disabled="disabled"
        @input="handleInput"
      />
      <div class="slider-track">
        <div class="slider-fill" :style="{ width: percentage + '%' }"></div>
      </div>
    </div>
    <div class="slider-value">{{ modelValue }}</div>
  </div>
</template>

<style scoped lang="less">
.slider {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;

  &.disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
}

.slider-label {
  min-width: 60px;
  font-size: 14px;
  color: #666666;
}

.slider-container {
  position: relative;
  flex: 1;
  height: 20px;
}

.slider-input {
  position: absolute;
  width: 100%;
  height: 100%;
  margin: 0;
  opacity: 0;
  cursor: pointer;
  z-index: 2;

  &:disabled {
    cursor: not-allowed;
  }
}

.slider-track {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 4px;
  background: #f0f0f0;
  border-radius: 2px;
  transform: translateY(-50%);
  z-index: 1;
}

.slider-fill {
  height: 100%;
  background: #1890ff;
  border-radius: 2px;
  transition: width 0.1s ease;
}

.slider-value {
  min-width: 40px;
  text-align: right;
  font-size: 14px;
  color: #000000;
}
</style>

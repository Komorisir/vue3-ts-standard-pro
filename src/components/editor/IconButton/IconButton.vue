<script setup lang="ts">
interface Props {
  /** 图标名称 */
  icon?: string
  /** 按钮大小 */
  size?: 'small' | 'default' | 'large'
  /** 是否禁用 */
  disabled?: boolean
  /** 是否激活 */
  active?: boolean
  /** 提示文本 */
  tooltip?: string
}

withDefaults(defineProps<Props>(), {
  icon: '',
  size: 'default',
  disabled: false,
  active: false,
  tooltip: '',
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()
</script>

<template>
  <button
    class="icon-button"
    :class="[`icon-button-${size}`, { active, disabled }]"
    :disabled="disabled"
    :title="tooltip"
    @click="emit('click', $event)"
  >
    <slot>
      <span class="icon">{{ icon }}</span>
    </slot>
  </button>
</template>

<style scoped lang="less">
.icon-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid transparent;
  border-radius: 4px;
  background: transparent;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #666666;

  &:hover:not(.disabled) {
    background: #f0f0f0;
    color: #000000;
  }

  &.active {
    background: #e6f7ff;
    color: #1890ff;
    border-color: #91d5ff;
  }

  &.disabled {
    cursor: not-allowed;
    opacity: 0.4;
  }
}

.icon-button-small {
  width: 24px;
  height: 24px;
  font-size: 14px;
}

.icon-button-default {
  width: 32px;
  height: 32px;
  font-size: 16px;
}

.icon-button-large {
  width: 40px;
  height: 40px;
  font-size: 18px;
}

.icon {
  display: inline-block;
}
</style>

<script setup lang="ts">
interface Props {
  /** 是否显示 */
  visible?: boolean
  /** 提示内容 */
  message?: string
  /** 类型 */
  type?: 'success' | 'error' | 'warning' | 'info'
  /** 持续时间（毫秒） */
  duration?: number
}

withDefaults(defineProps<Props>(), {
  visible: false,
  message: '',
  type: 'info',
  duration: 3000,
})

const emit = defineEmits<{
  close: []
}>()

const iconMap = {
  success: '✓',
  error: '✕',
  warning: '⚠',
  info: 'ℹ',
}
</script>

<template>
  <Transition name="toast">
    <div v-if="visible" class="toast" :class="[`toast-${type}`]">
      <div class="toast-icon">{{ iconMap[type] }}</div>
      <div class="toast-message">{{ message }}</div>
    </div>
  </Transition>
</template>

<style scoped lang="less">
.toast {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: #ffffff;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 2000;
}

.toast-icon {
  font-size: 16px;
  font-weight: bold;
}

.toast-message {
  font-size: 14px;
  color: #000000;
}

.toast-success .toast-icon {
  color: #52c41a;
}

.toast-error .toast-icon {
  color: #f5222d;
}

.toast-warning .toast-icon {
  color: #faad14;
}

.toast-info .toast-icon {
  color: #1890ff;
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-20px);
}
</style>

<script setup lang="ts">
interface Props {
  /** 是否显示加载 */
  loading?: boolean
  /** 加载文本 */
  text?: string
  /** 大小 */
  size?: 'small' | 'default' | 'large'
}

withDefaults(defineProps<Props>(), {
  loading: true,
  text: '加载中...',
  size: 'default',
})
</script>

<template>
  <div v-if="loading" class="loading" :class="[`loading-${size}`]">
    <div class="loading-spinner"></div>
    <div v-if="text" class="loading-text">{{ text }}</div>
  </div>
</template>

<style scoped lang="less">
.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.loading-spinner {
  border: 2px solid #f0f0f0;
  border-top-color: #1890ff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.loading-small .loading-spinner {
  width: 16px;
  height: 16px;
}

.loading-default .loading-spinner {
  width: 24px;
  height: 24px;
}

.loading-large .loading-spinner {
  width: 32px;
  height: 32px;
}

.loading-text {
  color: #666;
  font-size: 14px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>

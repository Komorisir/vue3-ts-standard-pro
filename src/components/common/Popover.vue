<script setup lang="ts">
interface Props {
  /** 是否显示 */
  visible?: boolean
  /** 标题 */
  title?: string
  /** 内容 */
  content?: string
  /** 位置 */
  placement?: 'top' | 'bottom' | 'left' | 'right'
}

withDefaults(defineProps<Props>(), {
  visible: false,
  title: '',
  content: '',
  placement: 'top',
})

const emit = defineEmits<{
  'update:visible': [value: boolean]
}>()
</script>

<template>
  <div class="popover">
    <div class="popover-trigger" @click="emit('update:visible', !visible)">
      <slot></slot>
    </div>
    <Transition name="popover">
      <div v-if="visible" class="popover-content" :class="[`popover-${placement}`]">
        <div v-if="title" class="popover-title">{{ title }}</div>
        <div class="popover-body">
          <slot name="content">{{ content }}</slot>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped lang="less">
.popover {
  position: relative;
  display: inline-block;
}

.popover-trigger {
  cursor: pointer;
}

.popover-content {
  position: absolute;
  z-index: 1100;
  padding: 12px 16px;
  background: #ffffff;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  min-width: 120px;
  max-width: 300px;
}

.popover-top {
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  margin-bottom: 8px;
}

.popover-bottom {
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  margin-top: 8px;
}

.popover-left {
  right: 100%;
  top: 50%;
  transform: translateY(-50%);
  margin-right: 8px;
}

.popover-right {
  left: 100%;
  top: 50%;
  transform: translateY(-50%);
  margin-left: 8px;
}

.popover-title {
  font-size: 14px;
  font-weight: 600;
  color: #000000;
  margin-bottom: 8px;
}

.popover-body {
  font-size: 14px;
  color: #666666;
}

.popover-enter-active,
.popover-leave-active {
  transition: all 0.2s ease;
}

.popover-enter-from,
.popover-leave-to {
  opacity: 0;
  transform: scale(0.9);
}
</style>

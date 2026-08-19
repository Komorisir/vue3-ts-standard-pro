<script setup lang="ts">
/**
 * 改尺寸面板。
 * 显示单位切换只影响 UI；合法输入预览，blur/Enter 时提交。
 */
import { computed, ref, watch } from 'vue'
import { Button, Input, Select } from 'ant-design-vue'
import { DEFAULT_DOCUMENT_DPI, pxFromUnit, unitFromPx, type ImageSizeUnit } from '@/editor/model/imageAdjust'
import { useEditorStore } from '@/editor/store/editor'

const store = useEditorStore()
const unit = ref<ImageSizeUnit>('px')
const locked = ref(true)
const widthText = ref('')
const heightText = ref('')
const disabled = computed(() => !store.mainImage || !store.mainImageDisplaySize)

watch(
  [() => store.mainImageDisplaySize, unit],
  ([size]) => {
    if (!size) {
      widthText.value = ''
      heightText.value = ''
      return
    }
    widthText.value = formatUnit(unitFromPx(size.width, unit.value, DEFAULT_DOCUMENT_DPI))
    heightText.value = formatUnit(unitFromPx(size.height, unit.value, DEFAULT_DOCUMENT_DPI))
  },
  { immediate: true },
)

function beginEdit(): void {
  store.beginResizeEdit()
}

function preview(field: 'width' | 'height', value: string): void {
  if (field === 'width') {
    widthText.value = value
  } else {
    heightText.value = value
  }
  const parsed = Number(value)
  if (!Number.isFinite(parsed)) {
    return
  }
  store.previewDisplaySize(field, pxFromUnit(parsed, unit.value, DEFAULT_DOCUMENT_DPI), locked.value)
}

function commit(): void {
  store.commitResizeEdit()
}

function toggleLocked(): void {
  locked.value = !locked.value
}

function formatUnit(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(3).replace(/0+$/, '').replace(/\.$/, '')
}

function handleInput(field: 'width' | 'height', event: Event): void {
  preview(field, (event.target as HTMLInputElement).value)
}
</script>

<template>
  <div class="resize-panel">
    <label class="resize-panel__field">
      <span>宽度</span>
      <Input
        :disabled="disabled"
        :value="widthText"
        @focus="beginEdit"
        @input="handleInput('width', $event)"
        @blur="commit"
        @keyup.enter="commit"
      />
    </label>
    <label class="resize-panel__field">
      <span>高度</span>
      <Input
        :disabled="disabled"
        :value="heightText"
        @focus="beginEdit"
        @input="handleInput('height', $event)"
        @blur="commit"
        @keyup.enter="commit"
      />
    </label>
    <div class="resize-panel__actions">
      <Button size="small" :disabled="disabled" @click="toggleLocked">{{ locked ? '锁定比例' : '解锁比例' }}</Button>
      <Select v-model:value="unit" size="small" style="width: 88px">
        <Select.Option value="px">px</Select.Option>
        <Select.Option value="in">in</Select.Option>
        <Select.Option value="cm">cm</Select.Option>
      </Select>
    </div>
  </div>
</template>

<style scoped lang="less">
.resize-panel {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.resize-panel__field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 12px;
  color: rgb(0 0 0 / 45%);
}

.resize-panel__actions {
  display: flex;
  gap: 8px;
  justify-content: space-between;
}
</style>

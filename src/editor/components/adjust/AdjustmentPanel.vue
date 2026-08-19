<script setup lang="ts">
/**
 * 调整工作区主面板。
 * 把裁剪 / 旋转 / 改尺寸组织成互斥手风琴；平移入口在顶栏胶囊。
 */
import { ref } from 'vue'
import { useEditorStore } from '@/editor/store/editor'
import AdjustmentSection from './AdjustmentSection.vue'
import CropPanel from './CropPanel.vue'
import ResizePanel from './ResizePanel.vue'
import RotatePanel from './RotatePanel.vue'

type SectionId = 'crop' | 'rotate' | 'resize' | null

const store = useEditorStore()
const expanded = ref<SectionId>(null)

function syncSection(next: SectionId): void {
  if (expanded.value === 'crop' && next !== 'crop') {
    store.commitCropSession()
  }
  if (expanded.value === 'rotate' && next !== 'rotate') {
    store.commitAngleEdit()
  }
  if (expanded.value === 'resize' && next !== 'resize') {
    store.commitResizeEdit()
  }

  if (next === 'crop' && expanded.value !== 'crop') {
    store.fitView()
    store.beginCropSession()
  }
  if (next === 'rotate' && expanded.value !== 'rotate') {
    store.fitView()
  }
  expanded.value = expanded.value === next ? null : next
}

function onCropApplied(): void {
  expanded.value = null
}

function onCropCancelled(): void {
  expanded.value = null
}
</script>

<template>
  <section class="adjustment-panel">
    <AdjustmentSection title="裁剪" :expanded="expanded === 'crop'" @toggle="syncSection('crop')">
      <CropPanel @applied="onCropApplied" @cancelled="onCropCancelled" />
    </AdjustmentSection>

    <AdjustmentSection title="旋转/矫正" :expanded="expanded === 'rotate'" @toggle="syncSection('rotate')">
      <RotatePanel />
    </AdjustmentSection>

    <AdjustmentSection title="改尺寸/比例" :expanded="expanded === 'resize'" @toggle="syncSection('resize')">
      <ResizePanel />
    </AdjustmentSection>
  </section>
</template>

<style scoped lang="less">
.adjustment-panel {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 12px;
}
</style>

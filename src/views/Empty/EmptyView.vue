<script setup lang="ts">
import { AddPicture } from '@icon-park/vue-next'
import { useFileDialog } from '@vueuse/core'
import { useGlobalStore } from '@/store/modules/global'
import { useImageUpload } from '@/hooks'
import { message } from 'ant-design-vue'

const globalStore = useGlobalStore()

// 使用图片上传 Hook
const { handleFile, loading, error, imageInfo } = useImageUpload({
  maxSize: 10 * 1024 * 1024, // 10MB
  compress: false, // 暂不压缩，保持原图质量
})

const { open, onCancel, onChange } = useFileDialog({
  multiple: false,
  accept: 'image/*',
})

const handleAddFile = () => {
  console.log('🎬 打开文件选择对话框')
  open()
}

onCancel(() => {
  console.log('❌ 用户取消选择文件')
})

onChange(async files => {
  console.log('📁 文件选择 onChange 触发')

  if (files && files.length > 0 && files[0]) {
    const file = files[0]

    try {
      // 使用封装的 Hook 处理文件
      const info = await handleFile(file)

      // 存储到 Store
      console.log('💾 存储图片到 Store...')
      globalStore.setUploadedImageUrl(info.dataUrl)
      globalStore.setIsEmpty(false)

      console.log('🎉 图片上传成功！')
      message.success(`图片上传成功：${info.name}`)
    } catch (err) {
      console.error('❌ 图片上传失败:', err)
      const errorMsg = err instanceof Error ? err.message : '图片上传失败'
      message.error(errorMsg)
    }
  } else {
    console.warn('⚠️ 没有选择有效的文件')
  }
})
</script>

<template>
  <div class="empty-view">
    <div class="empty-view-content" @click="handleAddFile">
      <div class="empty-view-icon">
        <add-picture :size="80" :class="{ loading: loading }" />
      </div>
      <div class="empty-view-text">
        <div class="empty-view-text-title">
          <span v-if="!loading">选择添加文件或者拖拽文件到此处</span>
          <span v-else>正在加载图片...</span>
        </div>
        <div class="empty-view-text-description">
          <span v-if="!loading">支持png、jpg、jpeg、gif、webp等多种格式上传</span>
          <span v-else-if="imageInfo">{{ imageInfo.name }} ({{ (imageInfo.size / 1024).toFixed(2) }} KB)</span>
        </div>
        <div v-if="error" class="empty-view-error">
          <span>{{ error }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.empty-view {
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty-view-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 500px;
  height: 400px;
  cursor: pointer;
  border: 1px dashed #ccc;
  border-radius: 10px;
  transition: all 0.3s ease;

  &:hover {
    background-color: #f0f7ff;
    border-color: #1890ff;
  }
}

.empty-view-icon {
  margin-bottom: 20px;

  &.loading {
    animation: pulse 1.5s ease-in-out infinite;
  }
}

.empty-view-text {
  text-align: center;
}

.empty-view-text-title {
  font-size: 20px;
  font-weight: bold;
  color: #333;
}

.empty-view-text-description {
  margin-top: 10px;
  font-size: 16px;
  color: #666;
}

.empty-view-error {
  margin-top: 10px;
  font-size: 14px;
  color: #ff4d4f;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0.5;
  }
}
</style>

<script setup lang="ts">
import { onMounted, ref, watch, onUnmounted } from 'vue'
import { useEditor } from '@/hooks'
import { useGlobalStore } from '@/store/modules/global'
import { storeToRefs } from 'pinia'

const container = ref<HTMLElement>(null as unknown as HTMLElement)
const globalStore = useGlobalStore()
const { uploadedImageUrl } = storeToRefs(globalStore)

// 使用新的 Editor Hook
const { init, loadImage, resize, initialized } = useEditor({
  backgroundColor: 0x1099bb,
  antialias: true,
  resolution: window.devicePixelRatio || 1,
  autoDensity: true,
})

const initEditor = async () => {
  try {
    console.log('🎬 初始化编辑器...')
    // 初始化编辑器
    await init(container.value)
    console.log('✅ 编辑器初始化完成')

    // resize
    resize(container.value.clientWidth, container.value.clientHeight)
  } catch (error) {
    console.error('❌ 编辑器初始化失败:', error)
  }
}

// 监听上传的图片 URL 变化
watch(
  uploadedImageUrl,
  async newUrl => {
    console.log('👀 watch 触发! uploadedImageUrl 变化:', newUrl ? '有值' : '空')

    if (newUrl) {
      // 确保编辑器已初始化
      if (!initialized.value) {
        console.warn('⚠️ 编辑器尚未初始化，等待初始化...')
        // 等待编辑器初始化
        await new Promise(resolve => {
          const checkInit = setInterval(() => {
            if (initialized.value) {
              clearInterval(checkInit)
              resolve(undefined)
            }
          }, 100)
        })
      }

      try {
        console.log('⏳ 开始加载图片到画布...')
        await loadImage(newUrl)

        // 加载后调整大小
        if (container.value) {
          resize(container.value.clientWidth, container.value.clientHeight)
          console.log('📐 画布尺寸:', container.value.clientWidth, 'x', container.value.clientHeight)
        }

        console.log('✅ 图片加载完成！')
      } catch (error) {
        console.error('❌ 图片加载失败:', error)
      }
    }
  },
  {
    immediate: true, // 立即执行一次（如果初始就有值）
    deep: false, // 不需要深度监听
  },
)

// 监听窗口尺寸变化
const handleResize = () => {
  if (container.value) {
    resize(container.value.clientWidth, container.value.clientHeight)
  }
}

onMounted(() => {
  console.log('🎪 MainContent 组件已挂载')
  initEditor()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  console.log('👋 MainContent 组件卸载')
  window.removeEventListener('resize', handleResize)
})
</script>

<template>
  <div class="main-content">
    <div class="main-content-container" ref="container"></div>
  </div>
</template>

<style scoped lang="less">
.main-content {
  width: 100%;
  height: 100%;
  background-color: #f6f7fa;
}

.main-content-container {
  width: 100%;
  height: 100%;
}
</style>

import { ref } from 'vue'

/** 图片上传配置选项 */
export interface ImageUploadOptions {
  maxSize?: number // 最大文件大小（字节），默认 10MB
  accept?: string[] // 支持的图片格式
  compress?: boolean // 是否压缩图片，默认 false
  quality?: number // 压缩质量 (0-1)，默认 0.85
  maxWidth?: number // 最大宽度，默认 2048
  maxHeight?: number // 最大高度，默认 2048
}

/** 图片信息 */
export interface ImageInfo {
  name: string // 文件名
  size: number // 文件大小（字节）
  type: string // 文件类型
  dataUrl: string // Data URL (Base64)
  width: number // 图片宽度
  height: number // 图片高度
}

const DEFAULT_OPTIONS: Required<ImageUploadOptions> = {
  maxSize: 10 * 1024 * 1024,
  accept: ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp'],
  compress: false,
  quality: 0.85,
  maxWidth: 2048,
  maxHeight: 2048,
}

/**
 * 图片上传 Hook
 * @param options 配置选项
 */
export function useImageUpload(options: ImageUploadOptions = {}) {
  const config = { ...DEFAULT_OPTIONS, ...options }

  const loading = ref(false)
  const progress = ref(0)
  const error = ref<string | null>(null)
  const imageInfo = ref<ImageInfo | null>(null)

  /** 验证文件 */
  const validateFile = (file: File): { valid: boolean; error?: string } => {
    if (!config.accept.includes(file.type)) {
      return { valid: false, error: `不支持的文件类型：${file.type}` }
    }
    if (file.size > config.maxSize) {
      const maxSizeMB = (config.maxSize / 1024 / 1024).toFixed(2)
      return { valid: false, error: `文件过大，最大支持 ${maxSizeMB}MB` }
    }
    return { valid: true }
  }

  /** 读取文件为 Data URL */
  const readFileAsDataURL = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = e => resolve(e.target?.result as string)
      reader.onerror = () => reject(new Error('文件读取失败'))
      reader.onprogress = e => {
        if (e.lengthComputable) {
          progress.value = Math.round((e.loaded / e.total) * 100)
        }
      }
      reader.readAsDataURL(file)
    })
  }

  /** 获取图片尺寸 */
  const getImageDimensions = (dataUrl: string): Promise<{ width: number; height: number }> => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => resolve({ width: img.width, height: img.height })
      img.onerror = () => reject(new Error('无法获取图片尺寸'))
      img.src = dataUrl
    })
  }

  /** 压缩图片 */
  const compressImage = (dataUrl: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas')
          let { width, height } = img

          // 计算缩放比例
          if (width > config.maxWidth || height > config.maxHeight) {
            const scale = Math.min(config.maxWidth / width, config.maxHeight / height)
            width = Math.floor(width * scale)
            height = Math.floor(height * scale)
          }

          canvas.width = width
          canvas.height = height

          const ctx = canvas.getContext('2d')!
          ctx.drawImage(img, 0, 0, width, height)

          const compressed = canvas.toDataURL('image/jpeg', config.quality)
          resolve(compressed)
        } catch (err) {
          reject(err)
        }
      }
      img.onerror = () => reject(new Error('图片加载失败'))
      img.src = dataUrl
    })
  }

  /** 处理文件 */
  const handleFile = async (file: File): Promise<ImageInfo> => {
    loading.value = true
    error.value = null
    progress.value = 0

    try {
      // 验证
      const validation = validateFile(file)
      if (!validation.valid) {
        throw new Error(validation.error)
      }

      // 读取
      let dataUrl = await readFileAsDataURL(file)

      // 压缩（可选）
      if (config.compress) {
        dataUrl = await compressImage(dataUrl)
      }

      // 获取尺寸
      const dimensions = await getImageDimensions(dataUrl)

      // 构建结果
      const info: ImageInfo = {
        name: file.name,
        size: file.size,
        type: file.type,
        dataUrl,
        ...dimensions,
      }

      imageInfo.value = info
      return info
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : '文件处理失败'
      error.value = errorMsg
      throw err
    } finally {
      loading.value = false
      progress.value = 0
    }
  }

  /** 重置状态 */
  const reset = () => {
    loading.value = false
    progress.value = 0
    error.value = null
    imageInfo.value = null
  }

  return {
    loading,
    progress,
    error,
    imageInfo,
    handleFile,
    validateFile,
    reset,
  }
}

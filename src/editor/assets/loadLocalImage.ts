/**
 * 本地图片导入：校验 File、创建 objectURL、Assets.load，再写入文档。
 * 不创建 Sprite（由 scene sync 负责），失败时给出可见错误。
 */
import { message } from 'ant-design-vue'
import { Assets } from 'pixi.js'
import { isAcceptedImageFile } from '@/editor/model/imageFile'
import { createImageLayer } from '@/editor/model/imageLayer'
import { viewCenterToWorld } from '@/editor/model/viewportMath'
import { useEditorStore } from '@/editor/store/editor'

const REJECT_TYPE_MESSAGE = '仅支持 JPEG、PNG、WebP 图片'
const REJECT_NOT_READY_MESSAGE = '画布尚未就绪，请稍后再导入'
const REJECT_LOAD_MESSAGE = '图片加载失败'

function showImportError(fileName: string, reason: string): void {
  message.error(`无法导入「${fileName}」：${reason}`)
}

/**
 * 导入单个本地图片文件。非法类型或加载失败不写入图层。
 *
 * @param file 用户选择或拖入的文件
 * @param viewWidth 当前可见区域宽
 * @param viewHeight 当前可见区域高
 */
export async function loadLocalImage(file: File, viewWidth: number, viewHeight: number): Promise<void> {
  if (!isAcceptedImageFile(file)) {
    showImportError(file.name, REJECT_TYPE_MESSAGE)
    return
  }

  if (!Number.isFinite(viewWidth) || !Number.isFinite(viewHeight) || viewWidth <= 0 || viewHeight <= 0) {
    showImportError(file.name, REJECT_NOT_READY_MESSAGE)
    return
  }

  const objectUrl = URL.createObjectURL(file)
  let stored = false

  try {
    const texture = await Assets.load({
      src: objectUrl,
      parser: 'texture',
    })
    const naturalWidth = Number(texture.width)
    const naturalHeight = Number(texture.height)
    if (!Number.isFinite(naturalWidth) || !Number.isFinite(naturalHeight) || naturalWidth <= 0 || naturalHeight <= 0) {
      throw new Error('loadLocalImage: texture size is invalid')
    }

    const store = useEditorStore()
    const world = viewCenterToWorld(store.viewport, viewWidth, viewHeight)
    store.addImageLayer(
      createImageLayer({
        id: crypto.randomUUID(),
        name: file.name,
        objectUrl,
        naturalWidth,
        naturalHeight,
        transform: {
          x: world.x,
          y: world.y,
          scaleX: 1,
          scaleY: 1,
          rotation: 0,
        },
      }),
    )
    stored = true
  } catch (error) {
    console.error('loadLocalImage failed', error)
    showImportError(file.name, REJECT_LOAD_MESSAGE)
  } finally {
    if (!stored) {
      URL.revokeObjectURL(objectUrl)
    }
  }
}

/**
 * 从一组文件中导入主图。仅保留最后一张合法图片；若没有合法文件则走错误提示。
 *
 * @param files 文件选择器或 drop 得到的列表
 */
export async function importImageFiles(files: FileList | File[]): Promise<void> {
  const list = Array.from(files)
  if (list.length === 0) {
    return
  }

  const store = useEditorStore()
  const accepted = list.filter(isAcceptedImageFile)
  const target = accepted.length > 0 ? accepted[accepted.length - 1] : list[list.length - 1]
  if (!target) {
    return
  }

  await loadLocalImage(target, store.viewWidth, store.viewHeight)
}

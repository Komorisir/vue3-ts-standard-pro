import { createPinia } from 'pinia'
import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { EMPTY_DOCUMENT_HINT, PIXI_HOST_ID } from '@/editor/canvas/canvasHostContract'
import { createImageLayer } from '@/editor/model/imageLayer'
import { useEditorStore } from '@/editor/store/editor'
import CanvasHost from './CanvasHost.vue'

vi.mock('@/editor/core/usePixiApp', () => ({
  usePixiApp: () => ({ app: { value: null } }),
}))

vi.mock('@/editor/scene/useEditorScene', () => ({
  useEditorScene: () => {},
}))

vi.mock('@/editor/tools/useViewportGestures', () => ({
  useViewportGestures: () => ({ consumeClickSuppressed: () => false }),
}))

describe('CanvasHost', () => {
  it('renders the host element with the exported id and empty-state copy', () => {
    const wrapper = mount(CanvasHost, {
      global: { plugins: [createPinia()] },
    })
    const host = wrapper.get(`#${PIXI_HOST_ID}`)

    expect(host.exists()).toBe(true)
    expect(host.text()).toContain(EMPTY_DOCUMENT_HINT)
  })

  it('hides the empty-document hint when layers exist', async () => {
    const pinia = createPinia()
    const wrapper = mount(CanvasHost, {
      global: { plugins: [pinia] },
    })
    const store = useEditorStore(pinia)
    store.addImageLayer(
      createImageLayer({
        id: 'layer-1',
        name: 'a.png',
        objectUrl: 'blob:http://localhost/1',
        naturalWidth: 10,
        naturalHeight: 10,
      }),
    )
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).not.toContain(EMPTY_DOCUMENT_HINT)
  })
})

import { defineStore } from 'pinia'
import { store } from '@/store'
import { StoreEnum } from '@/constants/enum/store'
import { ref } from 'vue'

/**
 * global store
 */
export const useGlobalStore = defineStore(StoreEnum.GLOBAL, () => {
  // state
  const count = ref(0)

  // getters
  // const isEmpty = computed(() => imageList.value.length === 0)

  // actions
  const addCount = () => {
    count.value++
  }

  return {
    // state
    count,
    // actions
    addCount,
  }
})

/**
 * 在 setup 外使用 useXxxStoreWithout
 * const store = useXxxStoreWithout()
 * const { xx, xxx } = storeToRefs(store)
 *
 * @example 修改更新 state 使用 $patch 或 actions
 * √ store.$patch({ key: value })
 * √ store.add(xxx)
 * × store.key = value // 不要直接修改
 */
export const useGlobalStoreWithout = () => {
  return useGlobalStore(store)
}

<script setup lang="ts">
import { useGlobalStore } from '@/store/modules/global'
import { storeToRefs } from 'pinia'
import { LinkThree } from '@icon-park/vue-next'

defineProps<{ msg: string }>()

const globalStore = useGlobalStore()
const { count } = storeToRefs(globalStore)
</script>

<template>
  <h1>{{ msg }}</h1>

  <div class="card">
    <button type="button" @click="globalStore.addCount">count is {{ count }}</button>
    <p>
      Edit
      <code>components/HelloWorld.vue</code> to test HMR
    </p>
  </div>

  <p>
    Check out
    <a href="https://vuejs.org/guide/quick-start.html#local" target="_blank">create-vue</a>, the official Vue + Vite
    starter
  </p>
  <p>
    Learn more about IDE Support for Vue in the
    <a href="https://vuejs.org/guide/scaling-up/tooling.html#ide-support" target="_blank">Vue Docs Scaling up Guide</a>.
  </p>
  <p class="read-the-docs">Click on the Vite and Vue logos to learn more</p>
  <link-three />
</template>

<style scoped lang="less">
.read-the-docs {
  color: #888;
}
</style>

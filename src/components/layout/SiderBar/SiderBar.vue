<script setup lang="ts">
import { Add, AddTextTwo, CurveAdjustment } from '@icon-park/vue-next'
import { Divider } from 'ant-design-vue'
import { computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useGlobalStore } from '@/store/modules/global'
import { storeToRefs } from 'pinia'
import { RouteName } from '@/constants/enum/route'

// 获取 global store
const globalStore = useGlobalStore()
const { currentTab } = storeToRefs(globalStore)
// 获取当前路由
const currentRoute = useRoute()

// 获取当前路由的名称
const currentRouteName = computed(() => {
  return currentRoute.name
})

watch(currentRouteName, newVal => {
  console.log('切换路由tab', newVal)
  globalStore.setCurrentTab(newVal as RouteName)
})
</script>

<template>
  <div class="sider-bar">
    <div class="sider-bar-nav">
      <router-link to="/">
        <div class="nav-item" :class="{ active: currentTab === RouteName.ADD }">
          <div class="nav-item-icon">
            <add :size="20" :theme="currentTab === RouteName.ADD ? 'filled' : 'outline'" />
          </div>
          <div class="nav-item-text">添加</div>
        </div>
      </router-link>
      <router-link to="/adjust">
        <div class="nav-item" :class="{ active: currentTab === RouteName.ADJUST }">
          <div class="nav-item-icon">
            <curve-adjustment :size="20" :theme="currentTab === RouteName.ADJUST ? 'filled' : 'outline'" />
          </div>
          <div class="nav-item-text">调整</div>
        </div>
      </router-link>
      <router-link to="/text">
        <div class="nav-item" :class="{ active: currentTab === RouteName.TEXT }">
          <div class="nav-item-icon">
            <add-text-two :size="20" :theme="currentTab === RouteName.TEXT ? 'filled' : 'outline'" />
          </div>
          <div class="nav-item-text">文本</div>
        </div>
      </router-link>
    </div>
    <Divider class="vertical-divider" type="vertical" />
    <div class="sider-bar-content">
      <router-view />
    </div>
  </div>
</template>

<style scoped lang="less">
.sider-bar {
  display: flex;
  height: 100%;
}

.sider-bar-nav {
  display: flex;
  flex-direction: column;
  width: 70px;
  padding: 4px 6px;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 8px;
  margin: 4px;
  color: #1c1d1e;
  cursor: pointer;
  border-radius: 5px;

  .nav-item-icon {
    margin-bottom: 4px;
  }

  &:hover {
    background-color: #eaedf2;
  }

  &:active,
  &.active {
    background-color: #eaedf2;
  }
}

.vertical-divider {
  height: 100%;
  margin: 0;
}

.sider-bar-content {
  width: 280px;
}
</style>

<script setup lang="ts">
import ViewHeader from '@/components/layout/Header/ViewHeader.vue'
import SiderBar from '@/components/layout/SiderBar/SiderBar.vue'
import MainContent from '@/components/layout/Content/MainContent.vue'
import ViewFooter from '@/components/layout/Footer/ViewFooter.vue'
import EmptyView from '@/views/Empty/EmptyView.vue'
import { Divider } from 'ant-design-vue'
import { useGlobalStore } from '@/store/modules/global'
import { storeToRefs } from 'pinia'

// 获取 global store
const globalStore = useGlobalStore()
const { isEmpty } = storeToRefs(globalStore)
</script>

<template>
  <header class="header">
    <ViewHeader />
  </header>
  <Divider class="horizontal-divider" type="horizontal" />
  <div class="content" v-if="!isEmpty">
    <aside class="aside">
      <SiderBar />
    </aside>
    <Divider class="vertical-divider" type="vertical" />
    <main class="main">
      <MainContent />
    </main>
    <Divider class="vertical-divider" type="vertical" />
    <footer class="footer">
      <ViewFooter />
    </footer>
  </div>
  <div class="empty" v-else>
    <EmptyView />
  </div>
</template>

<style scoped lang="less">
.header {
  display: flex;
  justify-content: center;
  width: 100%;
  height: 60px;
  padding: 8px;
}

.horizontal-divider {
  width: 100%;
  margin: 0;
}

.content {
  display: flex;
  justify-content: center;
  width: 100%;
  height: calc(100% - 60px - 1px);
}

.aside {
  flex-shrink: 0; // 防止收缩
  width: 350px; // 固定宽度：导航栏70px + 内容区280px
  height: 100%;
}

.main {
  display: flex;
  flex: 1; // 占据剩余空间
  justify-content: center;
  min-width: 0; // 允许 flex 子元素缩小
  height: 100%;
}

.vertical-divider {
  height: 100%;
  margin: 0;
}

.footer {
  display: flex;
  flex-shrink: 0; // 防止收缩
  justify-content: center;
  width: 280px; // 固定宽度
  height: 100%;
}

.empty {
  display: flex;
  justify-content: center;
  width: 100%;
  height: 100%;
}
</style>

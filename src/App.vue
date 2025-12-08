<script setup lang="ts">
import ViewHeader from '@/components/Header/ViewHeader.vue'
import SiderBar from '@/components/SiderBar/SiderBar.vue'
import MainContent from '@/components/Content/MainContent.vue'
import ViewFooter from '@/components/Footer/ViewFooter.vue'
import { Divider } from 'ant-design-vue'
</script>

<template>
  <header class="header">
    <ViewHeader />
  </header>
  <Divider class="horizontal-divider" type="horizontal" />
  <div class="content">
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
  height: 100%;
}

.main {
  display: flex;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.vertical-divider {
  height: 100%;
  margin: 0;
}

.footer {
  display: flex;
  justify-content: center;
}
</style>

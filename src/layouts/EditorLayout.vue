<script setup lang="ts">
/**
 * 编辑器四区排版：顶栏、左工具、中央 host、右侧面板。
 * 只负责占位与尺寸，不创建 Application，不持有文档状态。
 */
import { Layout } from 'ant-design-vue'

const { Header, Sider, Content } = Layout
</script>

<template>
  <Layout class="editor-layout" data-testid="editor-shell">
    <Header class="editor-layout__header">
      <slot name="toolbar" />
    </Header>
    <Layout class="editor-layout__body">
      <Sider class="editor-layout__rail" :width="96" theme="dark">
        <slot name="tools" />
      </Sider>
      <Content class="editor-layout__canvas">
        <slot name="canvas" />
      </Content>
      <Sider class="editor-layout__side" :width="240" theme="dark">
        <slot name="side" />
      </Sider>
    </Layout>
  </Layout>
</template>

<style scoped lang="less">
.editor-layout {
  position: fixed;
  inset: 0;
  height: 100%;
}

.editor-layout__header {
  display: flex;
  align-items: center;
  height: 48px;
  padding-inline: 16px;
  line-height: 48px;
  background: #141414;
}

.editor-layout__body {
  flex: 1;
  min-height: 0;
}

.editor-layout__rail,
.editor-layout__side {
  overflow: auto;
}

.editor-layout__canvas {
  display: flex;
  flex: 1;
  min-width: 0;
  height: 100%;
  min-height: 0;
  background: #111;
}
</style>

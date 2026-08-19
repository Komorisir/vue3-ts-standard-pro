<script setup lang="ts">
/**
 * 编辑器四区排版：顶栏、左侧工作区（Tab + 面板）、中央 host、右侧面板。
 * 只负责占位、尺寸与壳层 CSS 变量，不创建 Application，不持有文档状态。
 */
import { ConfigProvider, Layout } from 'ant-design-vue'
import { chromeAntTokens, chromeCssVars } from '@/editor/model/chromeTheme'

const { Header, Sider, Content } = Layout

/** Tab 列 64px + 工作区面板 220px，与 EditorWorkspaceNav 对齐。 */
const LEFT_WORKSPACE_WIDTH = 284

const chromeTheme = {
  token: chromeAntTokens(),
}

const chromeVars = chromeCssVars()
</script>

<template>
  <ConfigProvider component-size="small" :theme="chromeTheme">
    <Layout class="editor-layout" data-testid="editor-shell" :style="chromeVars">
      <Header class="editor-layout__header">
        <slot name="toolbar" />
      </Header>
      <Layout class="editor-layout__body">
        <Sider class="editor-layout__rail" :width="LEFT_WORKSPACE_WIDTH" theme="light">
          <slot name="tools" />
        </Sider>
        <Content class="editor-layout__canvas">
          <slot name="canvas" />
        </Content>
        <Sider class="editor-layout__side" :width="240" theme="light">
          <slot name="side" />
        </Sider>
      </Layout>
    </Layout>
  </ConfigProvider>
</template>

<style scoped lang="less">
.editor-layout {
  position: fixed;
  inset: 0;
  height: 100%;
  font-family: var(--chrome-font);
  color: var(--chrome-text);
  background: var(--chrome-surface);
}

.editor-layout__header {
  display: flex;
  align-items: center;
  height: 52px;
  padding-inline: 16px;
  line-height: 52px;
  color: var(--chrome-text);
  background: var(--chrome-surface);
  border-bottom: 1px solid var(--chrome-border);
}

.editor-layout__body {
  flex: 1;
  min-height: 0;
}

.editor-layout__rail,
.editor-layout__side {
  overflow: auto;
  background: var(--chrome-surface);
  border-color: var(--chrome-border);
}

.editor-layout__rail {
  border-right: 1px solid var(--chrome-border);
}

.editor-layout__side {
  border-left: 1px solid var(--chrome-border);
}

.editor-layout__rail :deep(.ant-layout-sider-children) {
  display: flex;
  height: 100%;
  min-height: 0;
}

.editor-layout__canvas {
  display: flex;
  flex: 1;
  min-width: 0;
  height: 100%;
  min-height: 0;
  background: var(--chrome-host-bg);
}
</style>

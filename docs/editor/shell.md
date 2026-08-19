# 路由与应用壳

- 模块：shell / chrome
- feature：feat-003、feat-004、feat-031、feat-036、feat-037
- OpenSpec：`editor-router`、`editor-shell`（归档：`2026-08-18-add-left-workspace-tabs`、`2026-08-19-add-editor-ui-spec`）
- 代码：`src/router/`、`src/layouts/`、`src/views/editor/`、`src/editor/components/`、`src/editor/canvas/`、`src/editor/model/workspaceTabs.ts`、`src/editor/model/chromeTheme.ts`
- UI 规范（人读全文，勿复制进主 spec）：[`../product/ui-spec.md`](../product/ui-spec.md)

## 职责

提供可刷新的 `/editor` 入口和四区布局；中央 `#pixi-host` 必须有稳定宽高，供 `usePixiApp` 挂载。不创建渲染器，不持有 DisplayObject。左侧工作区 Tab 选中与壳层色板是 UI / model 常量，不进 Pinia 文档。

## 数据流

```mermaid
flowchart LR
  Root["/ 与未知路径"] --> Editor["/editor"]
  Editor --> Layout["EditorLayout 四区"]
  Layout --> Host["CanvasHost #pixi-host"]
  Layout --> Bar["顶栏 文档 / 历史 / 交付"]
  Layout --> Nav["左 Tab + 工作区面板"]
  Layout --> Side["右侧占位面板"]
  Bar --> Store["Pinia 导入 / fitView"]
  Nav --> Store
  Host --> Store
```

## 公开契约

- 路由：`/` 与 catch-all 重定向 `/editor`；`App.vue` 只留 `<RouterView />`
- 布局：顶栏、左侧工作区（六 Tab + 面板）、中央 host、右侧面板同时可见
- 顶栏三分区：左品牌 + 打开（已接线）；中历史（占位）/ 撤销 / 重做（对接调整命令栈）；右适配（已接线）+ 保存（主按钮占位）
- 浅色壳：顶栏白、Tab 列浅灰、host 与 Pixi `background` 为 `#ebebeb`；选中 Tab 与保存共用强调色 `#ff4d6d`
- `canvasHostContract`：host 必须可测宽高；空文档显示「拖入或点击打开」；有主图后隐藏 hint
- 切 Tab、改肤色不得卸载 `#pixi-host`
- 顶栏 Open / 空 host 点击 / 拖入走导入；适配走 `fitView`；平移在调整面板。调整 Tab 为手风琴（裁剪 / 旋转/矫正 / 改尺寸），见 [image-adjust.md](./image-adjust.md)。History 与 Save 仍占位

## 验证

- TDD：host 契约、`workspaceTabs`、`chromeTheme`、Pixi init 背景跟 host
- 手工：刷新 `/` 与 `/editor` 进编辑器；四区可见；浅色壳；顶栏三分区；切 Tab 仍一块 canvas；窗口缩放 host 仍有面积

## 后续版本

feat-008 启用选择工具；feat-009 右侧改为真实图层面板；feat-014 把撤销栈扩到导入 / 滤镜 / 图层；feat-015 接线保存。

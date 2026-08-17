## Why

`/editor` 目前只是占位文案，没有顶栏、工具栏、稳定画布 host 和侧栏。后续 `usePixiApp` 需要一块有明确宽高、随窗口伸缩的 DOM。对应 `feature_list.json` 的 **feat-004**。界面分区见 `docs/pixijs-editor-dev-scheme.md` 第 5 节与第 6 节 P0 feat-004。

## What Changes

- 编辑器页改为四区应用壳：顶栏、左侧工具、中央画布 host、右侧面板
- 画布区提供稳定 host（`#pixi-host`），有明确宽高，窗口缩放时跟着变
- 空文档时 host 展示「拖入图片或点击打开」提示（本项不实现打开/拖入）
- 顶栏与两侧为占位控件，不接线业务
- 编辑器页从「无 chrome」变为「有壳无引擎」

## Capabilities

### New Capabilities

- `editor-shell`: 四区布局与可被后续引擎 `resizeTo` 的稳定画布 host

### Modified Capabilities

- `editor-router`: 「可挂载且不要求工具面板」改为「编辑器页承载应用壳，仍不初始化渲染器」

## Non-goals

- 不安装 `pixi.js`，不创建 `Application`（feat-005）
- 不实现打开文件、撤销、导出、图层、滤镜的真实行为
- 不写编辑器 Pinia 文档模型
- 不单测 WebGL 帧

## Impact

- `EditorPage` 改为薄组装；新增布局与 host 等 UI 组件（按编码规范拆文件）
- 不改路由表语义（仍默认 `/editor`）
- 依赖：已有 Ant Design Vue，不新增包
- 验证：host 契约用组件/常量测试；四区与 resize 用手工验收

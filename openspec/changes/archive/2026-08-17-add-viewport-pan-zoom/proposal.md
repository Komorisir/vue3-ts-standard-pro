## Why

主图已经能导入并居中，但视口仍固定在单位变换，用户无法平移或缩放浏览大图。对应 `feature_list.json` 的 **feat-007**。做法见 `docs/pixijs-editor-dev-scheme.md` 第 6 节 P2 feat-007。

## What Changes

- 用户可通过工具「平移」、按住空格或鼠标中键拖动画布，移动视口（只改 viewport，不改图层 transform）
- 在画布上滚动滚轮时，视口以指针位置为锚点缩放
- 顶栏「适配」按主图与 host 计算缩放与位移，使整张主图落在可见区域内
- 窗口或 host 尺寸变化时，渲染画布跟上 host，并重新适配主图（与「适配」同一套计算）
- 视口状态写入 Pinia；场景单向把 viewport 容器同步到该状态
- 新导入的主图写入文档后立即适配 host（与「适配」同一套 `fitView`），整张图落在可见区域内；图层 transform 仍不保存视口 pan/zoom

## Capabilities

### New Capabilities

- `viewport-navigation`: 视口平移、指针锚点缩放、适配可见区域

### Modified Capabilities

- `scene-import`: 视口不再必须保持单位变换；导入成功后自动适配 host，使整张主图可见
- `editor-shell`: 顶栏「适配」与工具栏「平移」开始执行视口操作；撤销 / 重做 / 导出仍可占位
- `pixi-application`: host 尺寸变化后在布局完成时 `app.resize()`，画布跟上窗口

## Non-goals

- 不实现点选、图层变换手柄（feat-008）
- 不实现 Ctrl+0 等快捷键全集（feat-018）；本项只含空格暂切平移
- 不实现撤销重做命令栈（feat-014）；视口变更直接写 store
- 不单测 Pixi WebGL 帧或 GPU 缩放是否发糊
- 不把 DisplayObject 放进 Pinia

## Impact

- 新增视口纯函数（clamp / 指针锚点缩放 / 适配矩形）与 store 的 `viewport`
- 工具层接手势；scene 把 viewport 容器与文档对齐
- 顶栏「适配」、工具栏「平移」可点
- 验证：视口数学 TDD；平移 / 滚轮 / 适配 / 导入后自动适配 host / 拖动窗口后画布跟上手工验收

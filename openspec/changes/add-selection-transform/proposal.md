## Why

主图已经能导入并浏览，但用户还不能选中它并改文档变换。对应 `feature_list.json` 的 **feat-008**。做法见 `docs/product/editor-scheme.md` 第 6 节 P2 feat-008。模块说明待归档后写入 `docs/editor/transform.md`。

## What Changes

- 用户可通过工具「选择」点选主图；点空白取消选择
- 选中后 overlay 显示包围框、8 向手柄与旋转点；拖拽改文档 `transform`（移动 / 等比缩放 / 旋转），不改视口
- 图层 `locked` 为真时仍可选中，但变换被拒绝（本项不提供锁定 UI）
- 平移仍只走平移工具、空格或中键；选择工具下的左键拖拽不再平移视口
- 选中 id 写入 Pinia；场景单向把 overlay 与图层 transform 同步到文档

## Capabilities

### New Capabilities

- `selection-transform`: 点选主图、overlay 手柄、移动 / 等比缩放 / 旋转文档变换

### Modified Capabilities

- `editor-shell`: 工具栏「选择」开始执行点选与变换；裁剪 / 文字 / 形状仍可占位
- `viewport-navigation`: 选择工具激活时左键拖拽不平移视口；空格 / 中键 / 平移工具仍平移

## Non-goals

- 不实现多选、框选或非等比缩放
- 不实现图层面板、锁定开关、显隐与排序（feat-009）；本项只遵守已有 `locked` 字段
- 不实现方向键微调、Delete、Tab 无障碍（feat-018）
- 不实现撤销重做命令栈（feat-014）；变换直接写 store
- 不实现导出时隐藏 overlay（feat-015）
- 不单测 Pixi WebGL 帧、hitTest 像素或手柄像素对齐

## Impact

- 新增变换纯函数（平移 / 等比缩放 / 旋转 / 有限性校验）与 store 的 `selectedLayerId`
- 工具层接手势（`eventMode = 'static'` + `globalpointermove`）；scene 画 overlay Graphics，不把 DisplayObject 写入 Pinia
- 工具栏「选择」可点；默认进入选择工具以便点选
- 验证：变换数学与 store TDD；点选 / 取消 / 移动 / 等比缩放 / 旋转 / 锁定不可变 / 视口缩放后手柄仍跟对象手工验收

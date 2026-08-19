## Why

顶栏仍是文字三分区（打开 / 历史+撤销重做 / 适配+保存），平移入口在【调整】面板，与 [`docs/product/ui-spec.md`](../../../docs/product/ui-spec.md) 的图标化方向不一致；用户也无法在编辑过程中快速对比导入原图。需要把视口公共能力收到顶栏胶囊，并增加「对比原图」视图态。

对应 **feat-038**（顶栏胶囊与对比原图；apply 时写入 `feature_list.json`）。人读 PRD 见 [`docs/product/toolbar-capsule-prd.md`](../../../docs/product/toolbar-capsule-prd.md)；壳层背景见 `docs/product/editor-plan.md` 第 4 节。

## What Changes

- 顶栏重构：左「品牌 + 导入图标」、中「胶囊」（抓手 | 撤销 · 重做 | 对比原图 | 适配）、右「导出图标」（primary，仍 disabled 占位）
- 文字按钮改为 IconPark outline 16px + Ant Tooltip；去掉「历史」占位
- **BREAKING（产品向）：** 从【调整】面板移除平移按钮；平移改由顶栏「抓手」粘滞开关（Tooltip「抓手」）驱动，空格暂切与中键行为不变
- 新增「对比原图」：按住按钮或 `\` 显示导入位图预览；不写文档、不进撤销栈；对比期间隐藏 DOM 裁剪 overlay
- 再次导入：静默替换；调整命令栈清空；对比按住态复位
- 增补 `ui-spec.md` §10.1 顶栏胶囊与附录图标（人读规范，已在规划阶段完成）

## Capabilities

### New Capabilities

- （无）对比原图与胶囊布局并入现有 `editor-shell`

### Modified Capabilities

- `editor-shell`: 顶栏改为左/胶囊/右布局与图标化；平移入口迁至顶栏抓手；新增对比原图视图态与 `\` 快捷键；调整面板不再暴露平移
- `image-adjust`: 调整面板仅保留三个手风琴模块；平移仍可用但由顶栏驱动（更新「No canvas free transform」场景的表述）

## Non-goals

- 不实现真实导出（feat-015）、历史面板（feat-014）、H / Ctrl+0 快捷键（feat-018）
- 对比不做点击锁定、分屏、按 undo 步进
- 不换四区像素、不改 Pixi init/destroy、不迁裁剪 overlay 到 Pixi
- 不把 PRD 全文灌进主 spec

## Impact

- UI：`EditorToolbar.vue` 重构；可选 `ToolbarCapsule.vue`；`AdjustmentPanel.vue` 去平移；`CropOverlay.vue` 读对比 flag 隐藏
- Pinia：`isComparingOriginal`、`setComparingOriginal`；导入时清 `commandStack` 与对比态
- model：纯函数推导对比外观（如 `deriveImportCompareAppearance`），先红后绿
- scene：`syncImageLayers` 或 `useEditorScene` 在对比态应用推导 transform/crop，不改文档
- 键盘：全局 `\` keydown/keyup（Input 聚焦时不触发）
- 无新 npm 依赖

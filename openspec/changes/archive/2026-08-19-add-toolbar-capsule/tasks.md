## 1. 规划与 feat 登记

- [x] 1.1 apply 开始时在 `feature_list.json` 登记 **feat-038**（顶栏胶囊与对比原图），状态 `in-progress`
- [x] 1.2 确认 `docs/product/toolbar-capsule-prd.md` 与 `ui-spec.md` §10.1 已对齐（规划阶段已完成，apply 时复核）

## 2. Model（TDD）

- [x] 2.1 新增 `deriveImportCompareAppearance`（或等价）的 failing `*.spec.ts`：覆盖 crop / rotate / flip / resize 组合
- [x] 2.2 实现纯函数：锚点保持 `transform.x/y`，去 crop/rotate/flip/resize scale，scale 为 1
- [x] 2.3 `pnpm test:run` 绿

## 3. Pinia 壳层

- [x] 3.1 增加 `isComparingOriginal` 与 `setComparingOriginal(boolean)`
- [x] 3.2 `addImageLayer`（或等价替换主图路径）清 `commandStack`、复位对比态与调整草稿 session
- [x] 3.3 store spec 覆盖换图清栈（若尚无）

## 4. Scene 同步

- [x] 4.1 `useEditorScene` watch `isComparingOriginal`，触发 sync
- [x] 4.2 `syncImageLayers` / `applyImageLayer` 支持 effective appearance（对比时用推导结果，不改文档）
- [x] 4.3 对比结束恢复文档外观

## 5. 顶栏 UI

- [x] 5.1 新建 `ToolbarCapsule.vue`：分组竖线、IconPark 16px、Tooltip、aria-label
- [x] 5.2 重构 `EditorToolbar.vue`：左品牌+导入图标、中胶囊、右导出 disabled primary
- [x] 5.3 胶囊：抓手粘滞 `setActiveTool('pan')`；撤销/重做/适配接线；无主图禁用
- [x] 5.4 对比原图：`pointerdown` 开 / `pointerup`+window leave 关；按住强调色

## 6. 调整面板与 Overlay

- [x] 6.1 `AdjustmentPanel.vue` 移除平移按钮与 `togglePan`
- [x] 6.2 `CropOverlay.vue` 在 `isComparingOriginal` 时隐藏
- [x] 6.3 确认 `EditorToolRail.vue` 无残留引用（若仍存在于仓库则清理或标注废弃）

## 7. 快捷键

- [x] 7.1 新增 `useCompareOriginalShortcut`（或 composable）：`\` keydown/keyup；Input/textarea 聚焦时不触发
- [x] 7.2 在 `EditorLayout` 或等效根组件挂载/卸载

## 8. Token 与样式

- [x] 8.1 `chromeTheme` 增补 `--chrome-radius-pill`（若 ui-spec 需要且尚未存在）
- [x] 8.2 胶囊样式：白底、1px border、高度约 32px、组内间距 8px

## 9. 验证与收尾

- [x] 9.1 `./init.sh` 通过
- [x] 9.2 手工验收 PRD §10：布局、抓手、对比、换图清栈、裁剪 overlay 隐藏（浏览器待补，已记入 progress.md）
- [x] 9.3 更新 `docs/editor/shell.md`（顶栏胶囊与对比行为摘要）
- [x] 9.4 更新 `progress.md`；feat-038 标 done；归档请执行 `/opsx-archive`

# Session Progress Log

## Current State

**Last Updated:** 2026-08-18 10:40
**Session ID:** merge-editor-plan
**Active Feature:** 已将 `editor-plan` 与 `editor-scheme` 合并为 `docs/product/editor-plan.md`。下一产品刀仍是 feat-008

## Status

### What's Done

- [x] `editor-plan.md` 与 `editor-scheme.md` 已合并为单一开发计划；`editor-scheme.md` 已删除
- [x] 《基于 PixiJS 的画布图片编辑器功能架构与开发迭代手册》按提示词 01–30 章落地
- [x] 结合现有工程：Pinia 真源、单向 sync、不引入第二 Engine 真源；决策用【保持/优化/新增/演进】
- [x] `docs/README.md`、`docs/product/README.md`、`editor-plan.md` 已链到手册
- [x] feat-022 记为 done

### What's In Progress

- [ ] feat-008 / `add-selection-transform`：仅有 `proposal.md`
- [ ] 浏览器手工确认视口

### What's Next

1. 人审手册后按 Phase A 做 feat-008
2. 归档功能后补 `docs/editor/<模块>.md`，手册模块章保持稳定、细节以 editor 文档为准

## Blockers / Risks

- [ ] 不完整的 `add-selection-transform` 会使 `openspec validate --all` 失败
- [ ] 手册中 Photopea/Figma 以外产品的渲染内核标为推测，未当事实

## Decisions Made

- 手册分册：`handbook/README.md` + 02～07，避免单文件过大
- 不新建与 Pinia 平行的 `EditorEngine` 真源；门面列为后续演进
- Object = 扩展现有 `BaseLayer`，不另起 EditorObject 体系

## Evidence of Completion

- [x] `docs/product/handbook/` 七份 Markdown 覆盖提示词 30 章

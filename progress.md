# Session Progress Log

## Current State

**Last Updated:** 2026-08-17 15:55
**Session ID:** docs-modularize-and-design-zh
**Active Feature:** 文档按模块拆分 + OpenSpec `design.md` 中文/流程图约定。feat-008 已有进行中 change `add-selection-transform`（仅 proposal，未完）

## Status

### What's Done

- [x] `docs/` 按 `process/`、`product/`、`editor/`、`tooling/` 分目录；入口 `docs/README.md`
- [x] 已落地模块写了 `docs/editor/`（architecture / shell / pixi-app / scene / viewport），后续 feat 用 `_template.md`
- [x] 默认 schema 改为仓库内 `spec-driven-zh`：`design.md` 必须中文，且至少一张 mermaid 图
- [x] AGENTS / Cursor rules / `openspec/config.yaml` / `sdd-workflow` 主 spec 已改引用

### What's In Progress

- [ ] feat-008 / `add-selection-transform`：仅有 `proposal.md`，规划未完成（本会话未实现）
- [ ] 浏览器手工确认视口（平移 / 滚轮 / 适配 / 导入 / 拖动窗口）

### What's Next

1. 人审文档目录与 `spec-driven-zh` 后，用 `/opsx-propose` 或继续 `add-selection-transform` 做 feat-008
2. 新 change 的 `design.md` 应走中文模板（`openspec instructions design`）
3. 归档 feat 后补 `docs/editor/<模块>.md`

## Blockers / Risks

- [ ] `openspec validate --all` 会因不完整的 `add-selection-transform` 失败（缺 tasks 等产物）
- [ ] 本环境未跑浏览器手工验收

## Decisions Made

- 产品总方案留在 `docs/product/`，已落地设计按模块写进 `docs/editor/`，避免 scheme 无限变长
- 不另起自定义工作流阶段，只 fork `spec-driven` 改 design 模板与 instruction
- 归档历史里的旧路径不改写；`docs/README.md` 提供对照表

## Evidence of Completion

- [x] `openspec schema validate spec-driven-zh` 通过
- [x] `openspec schema which spec-driven-zh` → Source: project
- [x] 主 spec `openspec validate --specs`：sdd-workflow 等 7 项通过

# 文档地图

按模块分目录，方便按版本往里加，而不是把所有内容堆在 `docs/` 根下。

| 目录 | 职责 | 何时改 |
|---|---|---|
| [`process/`](./process/) | 怎么干活：编码规范、OpenSpec、TDD | 工程约定变化时 |
| [`product/`](./product/) | 产品背景与路线图 | 里程碑或范围变化时 |
| [`editor/`](./editor/) | 已落地编辑器模块的设计说明 | **每归档一项 feature 后补对应模块** |
| [`tooling/`](./tooling/) | Agent / 图谱 / Pixi 文档 MCP | 工具链变化时 |

行为契约仍在 `openspec/specs/`。本文档是背景与模块说明，不要整份灌进主 spec。

执行队列以仓库根目录 `feature_list.json` 为准。

## 建议阅读顺序

1. 本页（地图）
2. [`product/editor-plan.md`](./product/editor-plan.md) — 目标与阶段
3. [`editor/architecture.md`](./editor/architecture.md) — 分层与数据流
4. 当前要改的模块（见 [`editor/README.md`](./editor/README.md)）
5. [`process/openspec.md`](./process/openspec.md) — 开 change 前

## 旧路径

| 旧路径 | 新路径 |
|---|---|
| `docs/coding-standards.md` | [`process/coding-standards.md`](./process/coding-standards.md) |
| `docs/openspec.md` | [`process/openspec.md`](./process/openspec.md) |
| `docs/tdd.md` | [`process/tdd.md`](./process/tdd.md) |
| `docs/pixijs-editor-plan.md` | [`product/editor-plan.md`](./product/editor-plan.md) |
| `docs/pixijs-editor-dev-scheme.md` | [`product/editor-scheme.md`](./product/editor-scheme.md) |
| `docs/codegraph-context.md` | [`tooling/codegraph.md`](./tooling/codegraph.md) |
| `docs/pixijs-mcp.md` | [`tooling/pixijs-mcp.md`](./tooling/pixijs-mcp.md) |

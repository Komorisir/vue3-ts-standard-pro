## Why

正式开发前，仓库只有工程 Harness 和产品方案文档，没有可执行的 SDD 闭环，也没有测试运行器。Agent 会直接按 `feature_list.json` 写代码，需求无法按变更归档，纯逻辑也无法先红后绿。

对应 `feature_list.json` 的 **feat-019**。产品范围仍以 `docs/pixijs-editor-dev-scheme.md` 为背景材料，不在本变更里实现编辑器功能。

## What Changes

- 接入 OpenSpec（Cursor `/opsx-*` 命令与 skill），约定「一项 feature = 一次 change」
- 把 SDD / TDD 写入 Harness：`AGENTS.md`、`init.sh`、Cursor 规则、进度产物
- 安装并配置 Vitest + jsdom，验证脚本纳入 `pnpm test:run`
- 用一个可复用的纯函数（`clamp`）证明红绿闭环可用
- 不把整份编辑器计划批量灌进 `openspec/specs/`

## Capabilities

### New Capabilities

- `sdd-workflow`: Agent 在改业务代码前必须先有 OpenSpec change，完成后归档到主 spec
- `tdd-pipeline`: 仓库能跑 Vitest；纯逻辑必须先写失败用例再实现

### Modified Capabilities

- （无。`openspec/specs/` 目前为空）

## Non-goals

- 不实现 feat-003 及之后的编辑器功能
- 不把 P0–P6 计划一次性转成主 spec
- 不单测 PixiJS WebGL 帧或 GPU 资源
- 不把 OpenSpec CLI 或 PixiJS skill 装进仓库 `.agents/`

## Impact

- 新增：`openspec/`、`.cursor/commands/opsx-*`、`.cursor/skills/openspec-*`、`.cursor/rules/openspec.mdc`、`.cursor/rules/tdd.mdc`、`docs/tdd.md`、`docs/openspec.md`、`vitest.config.ts`、`src/shared/math/clamp.ts` 与其 spec
- 修改：`AGENTS.md`、`init.sh`、`package.json`、`tsconfig*.json`、`feature_list.json`、`progress.md`、`session-handoff.md`
- 依赖：`vitest`、`@vue/test-utils`、`jsdom`
- 验证：`./init.sh` 增加 `pnpm test:run` 与 `openspec validate --all`

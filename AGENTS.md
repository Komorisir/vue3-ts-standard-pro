# AGENTS.md

Project harness for reliable agent-assisted development in a Vue 3 + TypeScript + Vite codebase（Pinia、Ant Design Vue、vue-router 已入依赖；产品目标为 PixiJS v8 图片画布编辑器。官方 skill 使用本机全局安装，不入库）。

## Startup Workflow

Before writing code:

1. **Confirm working directory** with `pwd`
2. **Read this file** completely
3. **Read project docs if present** (`docs/pixijs-editor-dev-scheme.md`, `docs/pixijs-editor-plan.md`, `docs/codegraph-context.md`, README)
4. **Check Codegraph**：调用 `codegraph_status`；未初始化则运行 `codegraph init -i`
5. **Run `./init.sh`** to verify environment is healthy
6. **Read `feature_list.json`** to see current feature state
7. **Review recent commits** with `git log --oneline -5`

If baseline verification is failing, repair that first before adding new scope.

写代码前先用 Codegraph 取结构上下文，不要先 grep 符号名。工具选择见 `.cursor/rules/codegraph.mdc`。

## Working Rules

- **One feature at a time**: Pick exactly one unfinished feature from `feature_list.json`
- **Verification required**: Don't claim done without running verification commands
- **Update artifacts**: Before ending session, update `progress.md` and `feature_list.json`
- **Stay in scope**: Don't modify files unrelated to the current feature
- **Leave clean state**: Next session must be able to run `./init.sh` immediately
- **Codegraph first**：查定义 / 调用方 / 影响面用 `codegraph_*`；改文件后等约 500ms 再查索引
- **PixiJS v8**：任何画布/渲染任务先读本机全局 skill `pixijs`（`~/.agents/skills/pixijs/SKILL.md`）再按 router 加载子 skill。不要把 skill 装进仓库。现有工程用 `pnpm add pixi.js`，禁止 `create-pixi` 覆盖仓库。只用 `new Application()` + `await app.init()`，挂载 `app.canvas`，卸载必须 `destroy`
- **PixiJS 文档 MCP**：API/源码级问题用 Context7 `query-docs`，`libraryId` 固定 `/pixijs/pixijs/v8.16.0`。指南用 `/websites/pixijs_8_x`。路由见 `docs/pixijs-mcp.md`。不要把 Context7 Key 写入仓库
- **Commit**：仅在用户明确要求时提交，遵循 `.cursor/rules/git-commit.mdc`（中文 Conventional Commits，必须有 body）

## Required Artifacts

- `feature_list.json` — Feature state tracker (source of truth)
- `progress.md` — Session continuity log
- `init.sh` — Standard startup and verification path
- `session-handoff.md` — Optional, for larger sessions
- `.codegraph/` — 本地符号图谱（`config.json` 可提交；`*.db` 不提交）
- `.cursor/rules/codegraph.mdc` — Codegraph MCP 用法
- `docs/pixijs-mcp.md` — PixiJS 官方文档 / Context7 路由

## Definition of Done

A feature is done only when ALL of the following are true:

- [ ] Target behavior is implemented
- [ ] Required verification actually ran (tests / lint / type-check)
- [ ] Evidence recorded in `feature_list.json` or `progress.md`
- [ ] Repository remains restartable from standard startup path
- [ ] 涉及结构变更时已用 `codegraph_impact` 或 `codegraph_status` 核对图谱仍可用

## End of Session

Before ending a session:

1. Update `progress.md` with current state
2. Update `feature_list.json` with new feature status
3. Record any unresolved risks or blockers
4. Commit with descriptive message once work is in safe state（仅当用户要求）
5. Leave repo clean enough for next session to run `./init.sh` immediately

## Verification Commands

```bash
# Full verification (recommended)
./init.sh
```

Required checks:

- `pnpm install`
- `pnpm run lint`
- `pnpm run build`（含 `vue-tsc` type-check）
- `codegraph status`（图谱健康检查）

当前无独立 vitest / test 脚本；类型检查由 `pnpm run build` 承担。新增逻辑后优先补测试，不要只改 lint。

## Escalation

If you encounter:

- **Architecture decisions**: Consult `docs/codegraph-context.md` and Codegraph, otherwise ask user
- **Unclear requirements**: Check product/requirements docs if present, otherwise ask user
- **Repeated test failures**: Update progress, flag for human review
- **Scope ambiguity**: Re-read `feature_list.json` for definition of done
- **Codegraph not initialized**: 询问是否执行 `codegraph init -i`，不要静默跳过

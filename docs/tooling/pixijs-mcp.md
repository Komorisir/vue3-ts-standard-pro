# PixiJS 文档 MCP 接入

PixiJS 官方**没有**发布「源码 MCP」。官方 AI 面是 skill + `llms.txt`。本仓库用已启用的 **Context7** 直连官方 GitHub 源与文档站。

## 选用

| 来源 | 类型 | 用途 |
|---|---|---|
| Context7 `/pixijs/pixijs` | 官方 GitHub 源码仓索引 | API、实现、v8 示例（首选） |
| Context7 `/pixijs/pixijs/v8.16.0` | 锁定版本 | 与当前 v8 编辑器对齐，避免串到 v7 |
| Context7 `/websites/pixijs_8_x` | 官方 8.x 指南站 | 概念、教程 |
| Context7 `/llmstxt/pixijs_llms-full_txt` | 官方 llms-full | skill 未覆盖的完整 API |
| WebFetch `https://pixijs.download/release/docs/llms.txt` | 官方 API 索引 | Context7 不够时按页再取 |

不要用 `/pixijs/pixijs.com` 当 API 真源（站点展示为主）。不要默认装社区运行时 MCP（如 `pixijs-mcp` / `pixi-inspector-mcp`），那些连的是**正在跑的画布**，不是源码。

## Agent 调用顺序

1. 工作流：本机全局 `~/.agents/skills/pixijs/SKILL.md` → 对应子 skill（不入库）
2. 当前 API / 源码级细节：Context7 `resolve-library-id` 可跳过，直接 `query-docs`
   - `libraryId`: `/pixijs/pixijs/v8.16.0`
   - `query`: 单一主题，例如 `Application async init canvas destroy`
3. skill 与 Context7 都没有：WebFetch 官方 `llms.txt`，再取对应 `.html.md`

本机 Context7 已在用户级 MCP 启用（`context7`）。不要把 API Key 写入仓库。

## 自检

问 Context7：`How to create Application with async app.init and mount app.canvas`。  
合格结果应来自 `github.com/pixijs/pixijs` 的 v8 路径，且是 `new Application()` + `await app.init()` + `app.canvas`。

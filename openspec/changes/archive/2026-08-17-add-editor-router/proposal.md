## Why

应用已依赖 `vue-router`，但 `main.ts` 未注册路由，打开站点仍落在 Vite 演示页。编辑器后续布局和画布都需要一个可刷新、可直达的 `/editor` 入口。对应 `feature_list.json` 的 **feat-003**。细节见 `docs/pixijs-editor-dev-scheme.md` 第 6 节 P0 feat-003。

## What Changes

- 注册应用路由，默认进入编辑器页
- `/` 重定向到 `/editor`；刷新 `/` 与 `/editor` 都进入同一编辑器页
- **BREAKING**：根路径不再展示 Vite / HelloWorld 演示页
- 编辑器页本项只做可挂载的占位，不包含四区布局或 Pixi

## Capabilities

### New Capabilities

- `editor-router`: 站点以 `/editor` 为默认页，未知路径也回到编辑器

### Modified Capabilities

- （无。现有主 spec 只有 `sdd-workflow` 与 `tdd-pipeline`）

## Non-goals

- 不做 EditorLayout / 画布 host（feat-004）
- 不安装 `pixi.js`、不创建 Application（feat-005）
- 不做登录守卫、多语言或嵌套业务路由
- 不单测 WebGL 或浏览器地址栏像素级行为

## Impact

- 新增路由表与编辑器占位页；`App.vue` 改为只渲染路由出口
- 修改 `main.ts`：在 mount 前 `app.use(router)`
- 移除演示页对 `HelloWorld` 的引用（组件本身可删除）
- 依赖：已有 `vue-router`，不再新增包
- 验证：路由表纯数据用 Vitest；整页刷新用手工验收

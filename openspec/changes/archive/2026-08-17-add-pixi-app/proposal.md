## Why

编辑器壳已有稳定 `#pixi-host`，但仍没有渲染器，中央区只是空 DOM。后续导入图片、视口与图层都依赖 PixiJS v8 `Application` 的 init / 挂载 / destroy。对应 `feature_list.json` 的 **feat-005**。做法见 `docs/pixijs-editor-dev-scheme.md` 第 6 节 P0 feat-005。

## What Changes

- 用 `pnpm add pixi.js` 接入 PixiJS v8，禁止 `create-pixi` 覆盖仓库
- 引擎生命周期层提供 `usePixiApp`：`new Application()` 后 `await init`，把 `app.canvas` 挂到现有 host，`resizeTo` 指向该 host
- 进入编辑器页后可见一块铺满 host 的 canvas；离开页面必须 `destroy`，再进入不得留下第二块 canvas 或 WebGL 告警
- 空文档提示仍叠在 canvas 之上，本项仍不处理打开或拖入文件
- 主 spec 中「编辑器页不得创建渲染器」改为由生命周期层在 host 上创建并销毁渲染器

## Capabilities

### New Capabilities

- `pixi-application`: PixiJS v8 Application 的创建、挂载、随 host 缩放与卸载销毁

### Modified Capabilities

- `editor-shell`: 「壳不启动渲染器」改为 chrome 不创建渲染器，host 由生命周期层挂上 canvas；空态文案在有 canvas 时仍可见
- `editor-router`: 「编辑器页不得初始化 WebGL/WebGPU」改为页上可以有绘制表面，路由本身仍不拥有引擎

## Non-goals

- 不实现场景分层、图片导入、视口平移缩放手势（feat-006 / feat-007）
- 不写编辑器 Pinia 文档模型，不持有 DisplayObject 作为业务真源
- 不为 WebGL 帧、GPU 纹理或真实 `Application.init` 写 unit spec
- 不做性能专项的全局资源回收策略细化（feat-016）；本项只要求官方 `destroy` 与无残留 canvas
- 不把 `preference` 做成可切换 WebGPU 的产品选项

## Impact

- 新增依赖 `pixi.js`（v8）
- 新增引擎生命周期模块（`usePixiApp` 及可测的 init/destroy 选项契约）
- `CanvasHost` 组装生命周期 hook，UI 文件仍不得 `import 'pixi.js'`
- 不改路由表；四区 chrome 布局保持
- 验证：选项契约 TDD；进页出 canvas、离页再进无泄漏用手工验收

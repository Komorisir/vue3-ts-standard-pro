# Pixi.js Web 图片画布编辑器开发计划

状态：产品背景。执行进度以 `feature_list.json` 为准；已落地模块见 [`../editor/`](../editor/)。  
完整方案（数据模型、界面、任务拆分、风险、里程碑）：[`editor-scheme.md`](./editor-scheme.md)。  
约束：PixiJS **v8** 官方 skill；本仓库已是 Vue 3 + Vite + TypeScript，**不要**用 `create-pixi` 覆盖现有工程。

## 目标

在现有工程化基础上，交付一套可落地的 Web 图片画布编辑器：导入图片、视口操作、图层变换、裁剪/调色、文字与标注、撤销重做、导出。渲染层只用 PixiJS v8；壳层继续用 Vue 3、Pinia、Ant Design Vue、vue-router。

## 官方合规要点

接入现有项目（`pixijs-create`）：

```bash
pnpm add pixi.js
```

Application 生命周期（`pixijs-application`）：

```ts
const app = new Application()
await app.init({
  resizeTo: hostEl,
  background: '#1a1a1a',
  antialias: true,
  autoDensity: true,
  resolution: window.devicePixelRatio,
  preference: 'webgl',
})
hostEl.appendChild(app.canvas)
```

禁止：

- 向 `new Application(options)` 传参（v8 构造函数不接受配置）
- 使用已弃用的 `app.view`（用 `app.canvas`）
- 在 `init()` resolve 前访问 `canvas` / `renderer` / `screen`
- 卸载时只删 DOM、不 `app.destroy({ removeView: true, releaseGlobalResources: true }, { children: true, texture: true, textureSource: true })`

交互拖拽必须用 `eventMode = 'static'` + `globalpointermove`（`pixijs-events`）。资源走 `Assets.load`（`pixijs-assets`），不要手写 `Image` + `Texture.from` 作为主路径。

实现时查官方 API / 源码用 Context7（`/pixijs/pixijs/v8.16.0`），见 [`../tooling/pixijs-mcp.md`](../tooling/pixijs-mcp.md)。

## 架构

```
Vue 壳（路由 / 布局 / Ant Design 面板）
        │
        ▼
Pinia 文档模型（图层、选中、历史）  ← 唯一业务真源
        │  单向同步
        ▼
usePixiApp（Application 生命周期）
        │
        ▼
场景图
  stage
    └─ viewport（平移缩放）
         └─ world
              ├─ background
              ├─ content（Sprite / Text / Graphics）
              └─ overlay（选框、手柄，不进导出）
```

目录建议：

```
src/
  router/
  layouts/EditorLayout.vue
  views/editor/EditorPage.vue
  editor/
    core/usePixiApp.ts
    scene/{viewport,layers,sync}.ts
    model/types.ts
    store/editor.ts
    tools/{select,transform,crop,annotate}.ts
    history/command.ts
    export/extract.ts
    components/
```

## 阶段与验收

一次只做 `feature_list.json` 中的一项。每项完成须跑 `./init.sh`，并按对应 PixiJS skill 自检。

### P0 工程底座

| ID | 内容 | 验收 | Skill |
|---|---|---|---|
| feat-003 | 注册 vue-router，`/editor` 为默认页 | 刷新直达编辑器路由 | — |
| feat-004 | EditorLayout：顶栏 / 左工具 / 画布 / 右侧属性 | 空壳可布局，画布区有稳定 host DOM | — |
| feat-005 | `pnpm add pixi.js` + `usePixiApp` | 进页出画布，离页无 WebGL 泄漏 | pixijs-create, pixijs-application |

### P1 可看图（MVP）

| ID | 内容 | 验收 | Skill |
|---|---|---|---|
| feat-006 | 场景分层 + 本地图片导入 | 拖入/选择文件后居中显示 Sprite | pixijs-assets, pixijs-scene-sprite, pixijs-scene-container |

### P2 可操作

| ID | 内容 | 验收 | Skill |
|---|---|---|---|
| feat-007 | 视口平移、滚轮缩放、适配窗口 | 大图可浏览，resize 后不糊 | pixijs-math, pixijs-ticker |
| feat-008 | 选择、移动、缩放、旋转 | 手柄拖拽，坐标用 toLocal/toGlobal | pixijs-events, pixijs-math, pixijs-scene-graphics |

### P3 图层与裁剪

| ID | 内容 | 验收 | Skill |
|---|---|---|---|
| feat-009 | Pinia 图层列表与画布同步 | 显隐/排序/锁定与场景一致 | pixijs-scene-container |
| feat-010 | 矩形裁剪 / 蒙版 | 裁剪结果可再变换 | pixijs-scene-core-concepts（masking） |

### P4 编辑能力

| ID | 内容 | 验收 | Skill |
|---|---|---|---|
| feat-011 | 亮度/对比度/饱和度/色相 | 滑条实时预览，可重置 | pixijs-filters, pixijs-color |
| feat-012 | 文字图层 | 添加、改字号颜色、可变换 | pixijs-scene-text |
| feat-013 | 矩形/椭圆/箭头/画笔 | 矢量叠在图上，可再选中 | pixijs-scene-graphics |

### P5 闭环

| ID | 内容 | 验收 | Skill |
|---|---|---|---|
| feat-014 | 命令式撤销重做 | Ctrl+Z / Ctrl+Y 覆盖变换与滤镜 | — |
| feat-015 | 导出 PNG/JPEG（不含 overlay） | 下载文件，分辨率正确 | pixijs-application（extract） |

### P6 质量

| ID | 内容 | 验收 | Skill |
|---|---|---|---|
| feat-016 | 销毁纹理、大图 culling、离开页释放 GPU | 反复进出编辑器无涨内存 | pixijs-performance |
| feat-017 | Vitest：模型、命令、导出纯函数 | `pnpm test` 可跑 | — |
| feat-018 | 键盘操作与画布可达性 | Tab/方向键可用 | pixijs-accessibility |

## 建议实现顺序

1. feat-003 → 004 → 005（没有稳定 host，不要先写工具）
2. feat-006（先能看见图）
3. feat-007 → 008（先视口再变换，避免坐标缠在一起）
4. feat-009（图层真源稳定后再做裁剪）
5. feat-010 → 011 → 012 → 013
6. feat-014 → 015
7. feat-016 → 017 → 018

## 验证

- 工程：`./init.sh`（`pnpm install` / `lint` / `build` / `codegraph status`）
- 画布：进页有 canvas；离页 `destroy`；导出不含选框
- 规范：构造函数无 options；只用 `app.canvas`；资源走 `Assets`

## 非目标（本计划不做）

多人协作、云端素材库、AI 修图、视频时间轴、移动端原生壳。GIF 播放若需要，另开需求并走 `pixijs-scene-gif`。

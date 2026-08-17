# PixiJS 图片画布编辑器 — 完整开发方案

依据 `docs/pixijs-editor-plan.md` 展开。实现时一次只做 `feature_list.json` 中一项，完成后跑 `./init.sh`。

| 项 | 值 |
|---|---|
| 产品 | 浏览器内图片画布编辑器 |
| 壳层 | Vue 3 + TypeScript + Vite + Pinia + Ant Design Vue + vue-router |
| 渲染 | PixiJS v8（`pnpm add pixi.js`，禁止 `create-pixi` 覆盖仓库） |
| 工期 | 约 24 人日（单人连续，不含联调缓冲） |
| 当前基线 | router 未注册；无编辑器页；未装 `pixi.js`；HelloWorld 演示页 |
| 下一刀 | **feat-003** |

---

## 1. 目标与范围

### 1.1 要交付的用户路径

1. 打开站点即进入 `/editor`
2. 拖入或选择本地图片，画布居中显示
3. 平移/缩放浏览大图
4. 选中图层，移动、缩放、旋转
5. 管理图层显隐、排序、锁定
6. 裁剪、调色、加文字、加标注
7. 撤销/重做
8. 导出 PNG 或 JPEG（不含选框）

### 1.2 非目标

多人协作、云素材、AI 修图、视频时间轴、移动端原生壳、GIF 时间轴。需要时另开需求。

### 1.3 硬约束（PixiJS v8）

- `const app = new Application(); await app.init(options)`
- 挂载 `app.canvas`，不用 `app.view`
- `init()` 完成前不碰 `canvas` / `renderer` / `screen`
- 卸载：`app.destroy({ removeView: true, releaseGlobalResources: true }, { children: true, texture: true, textureSource: true })`
- 资源：`Assets.load`
- 拖拽：`eventMode = 'static'` + `globalpointermove`
- 文档：本机 skill `pixijs` + Context7 `/pixijs/pixijs/v8.16.0`

---

## 2. 现状与缺口

| 已有 | 缺口 |
|---|---|
| Vue 3 / Vite / TS / Less | `main.ts` 未 `app.use(router)` |
| Pinia + `useGlobalStore` | 无编辑器文档模型 |
| Ant Design Vue 按需 | 无 EditorLayout |
| vue-router 在依赖里 | 无路由表、无 `/editor` |
| Husky / ESLint / commitlint | 无 Vitest |
| Agent Harness + Codegraph | 未装 `pixi.js` |

---

## 3. 架构

```
┌─────────────────────────────────────────────┐
│  Vue 壳：路由 / EditorLayout / 工具与属性面板 │
└──────────────────┬──────────────────────────┘
                   │ 只改文档
                   ▼
┌─────────────────────────────────────────────┐
│  Pinia useEditorStore（唯一业务真源）         │
│  document.layers / selectedIds / viewport    │
│  history.commandStack                        │
└──────────────────┬──────────────────────────┘
                   │ 单向同步（watch 文档 → 场景）
                   ▼
┌─────────────────────────────────────────────┐
│  usePixiApp  生命周期：init / resize / destroy│
│  scene/sync  按 layerId 对齐 DisplayObject    │
│  tools/*     只产生 Command，不直接改场景     │
└─────────────────────────────────────────────┘
```

原则：场景不是真源。工具写 Command → store 改文档 → sync 更新 Pixi。导出只渲染 `world`，不渲染 `overlay`。

### 3.1 场景图

```
app.stage
  └─ viewport          平移、缩放（视口，不是图层）
       └─ world
            ├─ background   棋盘/底色
            ├─ content      按 zIndex 排的业务图层
            └─ overlay      选框、手柄；导出排除
```

### 3.2 目录

```
src/
  router/index.ts
  layouts/EditorLayout.vue
  views/editor/EditorPage.vue
  editor/
    core/usePixiApp.ts
    scene/{viewport.ts,layers.ts,sync.ts}
    model/{types.ts,commands.ts}
    store/editor.ts
    tools/{select.ts,transform.ts,crop.ts,annotate.ts,text.ts}
    history/stack.ts
    export/extract.ts
    assets/loadLocalImage.ts
    components/{Toolbar.vue,LayerPanel.vue,PropertyPanel.vue,CanvasHost.vue}
```

---

## 4. 数据模型（先定类型再写工具）

```ts
type LayerId = string
type LayerKind = 'image' | 'text' | 'shape'

interface Transform2D {
  x: number
  y: number
  scaleX: number
  scaleY: number
  rotation: number // 弧度
}

interface ColorAdjust {
  brightness: number
  contrast: number
  saturation: number
  hue: number
}

interface BaseLayer {
  id: LayerId
  name: string
  kind: LayerKind
  visible: boolean
  locked: boolean
  transform: Transform2D
}

interface ImageLayer extends BaseLayer {
  kind: 'image'
  objectUrl: string
  naturalWidth: number
  naturalHeight: number
  crop?: { x: number; y: number; width: number; height: number }
  filters?: ColorAdjust
}

interface TextLayer extends BaseLayer {
  kind: 'text'
  text: string
  fontSize: number
  fill: string
}

interface ShapeLayer extends BaseLayer {
  kind: 'shape'
  shape: 'rect' | 'ellipse' | 'arrow' | 'path'
  stroke: string
  fill?: string
  points?: { x: number; y: number }[]
}

interface ViewportState {
  x: number
  y: number
  zoom: number
}

interface EditorDocument {
  layers: BaseLayer[] // 底 → 顶
  selectedIds: LayerId[]
  viewport: ViewportState
}

interface Command {
  readonly name: string
  execute(): void
  undo(): void
}
```

`objectUrl` 仅运行时有效，不持久化。图层顺序：数组末尾 = 最顶层 = 最大 zIndex。

---

## 5. 界面

```
┌──────── 顶栏：打开 / 撤销重做 / 适配 / 导出 ────────┐
│ 工具 │                 画布 host                  │ 图层 │
│ 选择 │              #pixi-host                    │ 列表 │
│ 平移 │                                            │─────│
│ 裁剪 │                                            │ 属性 │
│ 文字 │                                            │ 变换 │
│ 形状 │                                            │ 滤镜 │
└──────────────────────────────────────────────────┘
```

- 空文档：host 显示「拖入图片或点击打开」
- 画布区必须是稳定 DOM，`usePixiApp` 的 `resizeTo` 指向它
- 面板用 Ant Design Vue；画布交互全部在 Pixi

快捷键（P5/P6）：Ctrl+Z / Ctrl+Y / Delete / 方向键微调 / 空格暂切平移 / Ctrl+0 适配

---

## 6. 阶段方案

每项：产出文件、做法、验收、skill。人日为单人估算。

### P0 工程底座（2.5 日）— 没有 host 不装引擎

**feat-003 · 0.5 日 · 路由**

- 做：`src/router/index.ts`；`main.ts` `app.use(router)`；`/` 重定向 `/editor`；`App.vue` 只留 `<RouterView />`
- 验收：刷新 `/` 与 `/editor` 都进编辑器页（可先空白）
- 不做：Pixi、布局细节

**feat-004 · 1 日 · 应用壳**

- 做：`EditorLayout.vue` 四区；`CanvasHost.vue` 给出 `#pixi-host`；顶栏/左栏/右栏占位
- 验收：布局稳定，host 有明确宽高，窗口缩放 host 跟着变
- 不做：Application

**feat-005 · 1 日 · Application**

- 做：`pnpm add pixi.js`；`usePixiApp`：`new Application` + `await init({ resizeTo: host, autoDensity, resolution, preference: 'webgl' })`；挂 `app.canvas`；`onUnmounted` 按官方选项 `destroy`
- 验收：进页有 canvas；离页再进无残留下一画布、无 WebGL 告警
- Skill：`pixijs-create`、`pixijs-application`

### P1 MVP（1.5 日）— 先能看见图

**feat-006 · 1.5 日**

- 做：viewport/world/content 分层；`loadLocalImage`：File → objectURL → `Assets.load` → `ImageLayer` + Sprite；居中放入 content
- 验收：选择或拖入 jpg/png/webp 后图在画布中央；错误文件有提示
- Skill：`pixijs-assets`、`pixijs-scene-sprite`、`pixijs-scene-container`
- 风险：忘记 `URL.revokeObjectURL` 会漏内存（P6 收口，此处先记在图层上）

### P2 可操作（4 日）— 先视口再变换

**feat-007 · 1.5 日 · 视口**

- 做：空格/中键/工具「平移」拖 `viewport.position`；滚轮改 `viewport.scale`（锚在指针）；「适配」按图与 host 算 zoom
- 验收：大图可逛；resize 后不糊（`autoDensity` + DPR）
- Skill：`pixijs-math`、`pixijs-ticker`
- 注意：视口变换不要写进图层 `transform`

**feat-008 · 2.5 日 · 选择与变换**

- 做：点选 hitTest；overlay 画框与 8 向手柄 + 旋转点；拖拽用 `globalpointermove` + `toLocal`/`toGlobal`；改的是文档 `transform`
- 验收：移动/等比缩放/旋转正确；锁定层不可变；点空白取消选择
- Skill：`pixijs-events`、`pixijs-math`、`pixijs-scene-graphics`
- 风险：视口缩放后手柄坐标系容易错，必须统一在 world 空间算

### P3 图层（4 日）

**feat-009 · 2 日 · 图层面板**

- 做：右侧列表 = `document.layers` 倒序；显隐/锁定/重命名/拖拽排序；`sync.ts` 按 id 增删改，禁止每帧拆建 Sprite
- 验收：面板与画布一致；隐藏不可点；锁定可选但不可变
- Skill：`pixijs-scene-container`

**feat-010 · 2 日 · 裁剪**

- 做：裁剪工具在 overlay 拉矩形，写入 `ImageLayer.crop`；用 mask 或纹理裁切；确认后可再变换
- 验收：裁剪可撤销（依赖后续 014 的命令形态，本项先能改文档）；不破坏原 objectURL
- Skill：`pixijs-scene-core-concepts` masking

### P4 编辑（5 日）

**feat-011 · 1.5 日 · 调色**  
`ColorMatrixFilter` 绑 `filters`；滑条防抖写入文档；重置回 0。Skill：`pixijs-filters`、`pixijs-color`

**feat-012 · 1.5 日 · 文字**  
工具「文字」点画布建 `TextLayer`；属性改 `text`/`fontSize`/`fill`；走同一套变换。Skill：`pixijs-scene-text`

**feat-013 · 2 日 · 标注**  
矩形/椭圆/箭头/画笔 → `ShapeLayer`；画笔为 `points`；完成后可再选中。Skill：`pixijs-scene-graphics`

### P5 闭环（3 日）

**feat-014 · 2 日 · 历史**  
`history/stack.ts`；所有变更（变换、图层、滤镜、文字、裁剪）必须是 Command；Ctrl+Z/Y；合并连续拖拽为一条。

**feat-015 · 1 日 · 导出**  
隐藏 overlay → `renderer.extract` 出 world → 恢复 overlay → 下载 png/jpeg。分辨率按 world 边界，不被视口裁切。Skill：`pixijs-application` extract

### P6 质量（4 日）

**feat-016 · 1.5 日**  
删层销毁 texture；`revokeObjectURL`；离开页 `destroy`；大图 `cullable`。Skill：`pixijs-performance`

**feat-017 · 1.5 日**  
Vitest：命令栈、图层排序、裁剪矩形、导出纯函数。`package.json` 增加 `test`，`init.sh` 纳入。

**feat-018 · 1 日**  
方向键微调、Delete、Tab 到面板、`accessibleTitle`。Skill：`pixijs-accessibility`

---

## 7. 关键路径

```
003 → 004 → 005 → 006 → 007 → 008 → 009
                                      ├─ 010 裁剪
                                      ├─ 011 调色
                                      ├─ 012 文字
                                      ├─ 013 标注（也可在 008 后提前，但不建议）
                                      └─ 014 历史 → 017 测试
006 也可先做 015 导出草图，正式验收仍建议 009 之后
005 之后即可并行准备 016 的销毁清单，验收放最后
```

禁止并行同一会话改两项。008 未完成不要开 010/011。

---

## 8. 验证

| 门禁 | 命令 / 行为 |
|---|---|
| 工程 | `./init.sh`（install / lint / build / codegraph status） |
| 类型 | `pnpm run build` 含 `vue-tsc` |
| 画布 | 进页有 canvas；路由离开后再进只有一块 canvas |
| 规范 | 构造函数无 options；只用 `app.canvas`；资源走 `Assets` |
| 导出 | 文件能打开，无选框手柄 |
| 测试 | feat-017 后 `pnpm test` |

---

## 9. 风险

| 风险 | 阶段 | 处理 |
|---|---|---|
| 视口与图层坐标缠在一起 | P2 | 视口只改 viewport；图层只改 transform；命中用 toLocal |
| 每帧重建 Sprite | P3 | sync 按 layerId diff |
| 卸载泄漏 GPU | P0/P6 | 官方 destroy + 释放纹理与 objectURL |
| 滤镜实时卡顿 | P4 | 拖动预览、松手写文档；大图降预览分辨率 |
| 导出含 overlay | P5 | extract 前 `overlay.visible = false` |
| 误用 v7 API | 全程 | skill + Context7 v8.16.0，禁止 beginFill / app.view |
| 无测试导致回归 | P6 | 命令与纯函数先单测，画布交互手工清单 |

---

## 10. 里程碑验收

| 里程碑 | 包含 | 可演示 |
|---|---|---|
| M0 壳 | 003–005 | 空白 WebGL 画布嵌在布局里 |
| M1 能看 | 006 | 打开一张本地图 |
| M2 能改 | 007–009 | 浏览、变换、图层列表 |
| M3 能编 | 010–013 | 裁剪、调色、文字、标注 |
| M4 能交 | 014–015 | 撤销 + 导出文件 |
| M5 能养 | 016–018 | 无泄漏、有测试、键盘可用 |

M1 即可内部试用；对外以 M4 为准。

---

## 11. Agent 执行约定

1. 读 `AGENTS.md`、本方案、`feature_list.json`
2. 只领一项 `not-started`，按依赖顺序
3. Pixi 代码先读本机 `~/.agents/skills/pixijs/SKILL.md`，API 查 Context7 `/pixijs/pixijs/v8.16.0`
4. 完成后写 evidence，跑 `./init.sh`，更新 `progress.md`
5. 不把 skill 装回仓库 `.agents/`

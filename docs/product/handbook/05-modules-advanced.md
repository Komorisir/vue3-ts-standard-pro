# 16–24 进阶模块

模板同 [04](./04-modules-core.md)。插件化优先发生在本章（滤镜预设、素材、导出格式）。

---

## 16 滤镜 / 调色

### 1. 目标

非破坏调色：亮度/对比度/饱和度/色相写入 `filters`，Pixi `ColorMatrixFilter` 实时预览，可重置。

### 2. 成熟产品

PS：调整图层。Photopea：调整+滤镜，像素在 GPU。美图：预设滤镜。Figma：有限效果。

PixiJS v8：`ColorMatrixFilter` 有 brightness/contrast/saturate/hue 等；滤镜贵，需 `filterArea`，不用时 `filters = null`。

### 3. 范围

MVP：四滑条 + 重置 + 绑选中图片层。P1：黑白/怀旧等矩阵预设。P2：BlurFilter、LUT。暂不：Camera Raw、Lab。

### 4. 交互

右侧滑条；拖动预览；松手写文档（debounce）。

### 5. 模型

```ts
interface ColorAdjust {
  brightness: number
  contrast: number
  saturation: number
  hue: number
}
```

全 0 表示恒等。【建议新增】不要拖动中把中间值都推进 History。

### 6. PixiJS

一层一个 `ColorMatrixFilter` 实例，参数变则改矩阵，不要每帧 `new Filter`。设 `filterArea` 为 sprite 局部矩形。导出时滤镜必须还在对象上（非 overlay）。

### 7–9

Pinia `setLayerFilters`。scene 同步 filter。pointerup/滑条 change 一条 Command；input 过程只改内存。

### 10. 性能

滤镜 = 额外 pass。大图拖滑条【建议优化】预览降 resolution，松手全分辨率。Blur 的 `quality` 调低。

### 11. 异常

非图片层无滤镜面板。GPU 挂了回退提示，不写坏文档。

### 12. 测试

TDD：矩阵合成与 reset。手工：预览=导出；重置。已知风险：Pixi extract + filter 有过不可见 bug，验收时必测导出。

### 13. 任务

`FLT-001` 模型 · `FLT-002` ColorMatrix 同步 · `FLT-003` 滑条 · `FLT-004` 预设 · `FLT-005` History · `FLT-006` 导出一致`

feat-011。P1。依赖 feat-009。

---

## 17 蒙版模块

### 1. 目标

形状/矩形裁切可见区域。feat-010 的 crop 是矩形蒙版的特例。

### 2. 成熟产品

PS/Photopea：图层蒙版。Figma：布尔/mask。Pixi 代价：轴对齐 Rectangle（scissor）< Graphics stencil < Sprite/alpha mask（走滤镜，最贵）。

### 3. 范围

MVP：随 crop 的矩形 mask。P1：椭圆/圆。P2：任意 Graphics、alpha 图。暂不：PS 级画笔擦蒙版。

### 4–5. 交互与模型

`mask?: { kind: 'rect' | 'ellipse'; ... } | { kind: 'alpha'; sourceLayerId }`。与 crop 关系：crop 只用于 image 像素窗口；mask 可用于任何层。【建议优化】MVP 只做 ImageLayer.crop，避免两套裁切。

### 6. PixiJS

矩形用 mask Graphics；不要默认 Sprite mask。

### 7–13

同裁剪。P2。任务 `MSK-001` 起。独立于 crop 的 alpha mask 等 feat-010 稳定后再开 change。

---

## 18 特效模块

描边、阴影、发光、混合模式、透明度。

PS/Photopea layer style 计算重（Photopea 曾缓存样式避免每帧重算）。Pixi：`DropShadowFilter` 等，贵。

MVP：`opacity`。P1：描边（Graphics 或 filter）。P2：阴影、混合模式（`blendMode`）。暂不：斜面浮雕。

【建议新增】特效字段在 BaseLayer，sync 写 Sprite。History 同滤镜。P2。任务 `FX-001` opacity（可并入图层）· `FX-002` blend · `FX-003` shadow。

---

## 19 素材模块

贴纸、图标、SVG、素材库、最近使用。

Canva/稿定/Express 的核心；本仓库【后续演进】P3。

统一：

```ts
interface Asset {
  id: string
  type: 'raster' | 'svg' | 'json'
  source: string
}
```

加载仍走 `Assets.load`。不要为贴纸新建与 Layer 平行的模型：置入后就是 `ImageLayer` 或 `ShapeLayer`。

暂不实现云盘与登录。任务等独立 feature。

---

## 20 历史记录模块

### 1. 目标

所有文档变更经 Command；Ctrl+Z / Ctrl+Y；拖拽合并为一条。

### 2. 成熟产品

PS History 面板。Figma 文档级 undo（协同下更复杂，本仓库不做）。公约：手势结束提交，不是每帧一条。

```text
pointerdown → 开始 Transaction（记 before）
pointermove → 只更新文档/预览
pointerup   → 提交一个 Command
```

### 3. 范围

MVP：栈 + execute/undo/redo + 变换/图层/滤镜/文字/裁剪。P1：合并连续同类、上限 50～100 条。P2：History 面板。暂不：分支历史、协同 OT。

### 4. 交互

顶栏按钮；Ctrl+Z / Ctrl+Y / Ctrl+Shift+Z。

### 5. 模型

```ts
interface Command {
  readonly name: string
  execute(): void
  undo(): void
}
```

【建议新增】实现放 `history/stack.ts`。Command **调 store 公开 action**，不碰 Pixi。

选型：增量 Command，不要全文档快照（多层+大图内存爆）。Transaction = 一次手势的 before/after patch。

### 6. PixiJS

无。历史不进渲染器。

### 7. Vue / Pinia

`canUndo/canRedo`；栈可放 store 或独立 history 模块引用 store。不要把栈塞进 scene。

### 8. Engine

若有门面，只 `dispatch/undo/redo`。

### 9. History

本模块自身。导入替换、删除层必须可撤销（含 objectURL 生命周期：undo 要能恢复引用，不能过早 revoke）——【建议优化】revoke 推迟到 Command 被挤出栈。

### 10. 性能

栈过长丢最旧。禁止把 Texture 放进 Command。

### 11. 异常

空栈 undo 空操作。执行失败不破坏栈指针（记录日志）。

### 12. 测试

TDD：栈指针、合并拖拽、undo 后 redo。禁止 WebGL 测历史。

### 13. 任务

`HIS-001` Command 接口 · `HIS-002` 栈 · `HIS-003` 变换命令 · `HIS-004` 图层命令 · `HIS-005` 快捷键 · `HIS-006` 资源延迟 revoke`

feat-014。P1。依赖 feat-009。

---

## 21 Clipboard

Ctrl+C/V、Duplicate、样式复制。

MVP：Duplicate 选中层（新 id、微偏移）。P1：系统剪贴板图片 → 导入。P2：跨标签页 JSON。暂不：跨画布协同剪贴板。

序列化用 Object Model 可 JSON 部分；图片用 blob 暂存。

feat 可并入 009/018。P1。任务 `CLP-001` duplicate · `CLP-002` 粘贴文件。

---

## 22 快捷键

| 键 | 行为 | 优先级 |
|---|---|---|
| Space | 暂切平移 | 【保持】已有 |
| Ctrl+0 | 适配 | feat-018 P1 |
| Ctrl+Z/Y | 撤销重做 | feat-014 |
| Delete | 删层 | feat-009 |
| 方向键 | 微调 transform | feat-018 |
| V / H | 选择 / 平移 | P1 |
| Ctrl+D | 复制 | P1 |
| Ctrl+E | 导出 | P2 |

焦点在 input 时不抢快捷键。【保持】空格已 `preventDefault` 防页面滚。

feat-018。P1。画布 `accessibleTitle`。任务 `KEY-001` 映射表 · `KEY-002` 微调 · `KEY-003` a11y。

---

## 23 保存模块

本地 JSON 工程（不含 blob）。【后续演进】P3：IndexedDB 存图、自动保存。

MVP 可不做文件保存，以导出代替。P2：`project.json` + 旁路图片。协同保存非目标。

任务 `SAV-001` 序列化（去掉 objectUrl）· `SAV-002` 反序列化重新 Assets.load。

---

## 24 导出模块

### 1. 目标

导出 PNG/JPEG，**不含 overlay**，分辨率按 world/content 边界，不被视口裁切。视觉与画布一致（含滤镜、裁剪、文字、标注）。

### 2. 成熟产品

一律「所见即所得」减 UI 装饰。Photopea/PS 可改 PPI。Pixi：`renderer.extract` + 可选离屏 `RenderTexture`。

### 3. 范围

MVP：PNG/JPEG、整文档、隐藏 overlay。P1：倍数（2x）、透明 PNG、质量滑条。P2：WebP、选区导出。暂不：PDF、SVG、分块拼大图（大图超 `MAX_TEXTURE_SIZE` 时再做）。

### 4. 交互

顶栏导出；选格式。

### 5. 模型

纯函数：`{ mime, quality, scale }` → Blob。不进图层。

### 6. PixiJS

```text
overlay.visible = false
→ extract world（或 RenderTexture 以 scale 渲染）
→ overlay.visible = true
```

注意 `resolution` / `autoDensity`：导出应用**文档像素**，不要用 CSS 尺寸当输出像素。超 GPU 纹理上限要降 scale 并提示。

filter + extract 曾有 v8 bug：验收必测带滤镜导出。

### 7. Vue / Pinia

只读文档；触发 export helper。

### 8. Engine

`export/extract.ts` 编排显隐与 extract；无业务规则。

### 9. History

导出不入栈。

### 10. 性能

大图全分辨率 extract 会爆内存。【建议新增】面积上限；失败提示。

### 11. 异常

无图层禁用按钮。extract 失败 toast，恢复 overlay.visible。

### 12. 测试

TDD：文件名、mime、overlay 不在输出清单（纯函数能测的部分）。手工：像素对齐、无手柄、滤镜在。

### 13. 任务

`EXP-001` 隐藏 overlay extract · `EXP-002` PNG · `EXP-003` JPEG · `EXP-004` 分辨率 · `EXP-005` 失败恢复`

feat-015。P1。依赖 feat-006；正式验收建议 009 之后。

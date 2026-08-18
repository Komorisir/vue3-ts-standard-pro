# 08–15 核心编辑模块

每个模块按统一模板。标签见 [手册入口](./README.md)。实现时另开 OpenSpec change，归档后补 `docs/editor/<模块>.md`。

---

## 08 选择 / Transform

### 1. 模块目标

让用户点选主图（及后续多层），用包围盒手柄移动 / 等比缩放 / 旋转，只改文档 `transform`，不改视口。

### 2. 成熟产品

PS / Photopea / Figma：选中后 8 向缩放 + 旋转点；空格仍平移视口。Canva 类似。美图多为「当前图整图操作」，弱对象选择。

### 3. 功能范围

| 级 | 内容 |
|---|---|
| MVP | 单选、移动、等比缩放、旋转、点空白取消、锁定层可选不可变 |
| P1 | 非等比（Shift 解锁或反向）、旋转吸附 15° |
| P2 | 多选、框选、对齐/分布、组合 |
| 暂不 | 3D 变换、网格变形 |

### 4. 用户交互

左键点选；拖身体移动；拖角点等比缩放；拖旋转点旋转。空格/中键/平移工具仍走视口。方向键微调 → feat-018。

### 5. 数据模型

```ts
interface SelectionState {
  selectedIds: LayerId[] // MVP 长度 0 或 1
}
```

变换用现有 `Transform2D`。【建议新增】`selectedLayerId` 或 `selectedIds` 进 Pinia。

### 6. PixiJS

overlay `Graphics` 画框与手柄；手柄视觉尺寸 `/ viewport.scale`。content Sprite `eventMode = 'static'`。拖拽 `globalpointermove`。命中与手柄点在 **world 空间**计算（`toLocal` / `toGlobal`）。

### 7. Vue / Pinia

`selectLayer` / `clearSelection` / `updateLayerTransform`。UI 只亮「选择」工具，不 import pixi。

### 8. Engine

纯函数放 `model/transformMath.ts`（translate / uniformScaleAbout / rotateAbout / clampLayerScale）。scene 只把 transform 写到 Sprite，把选中态画到 overlay。

### 9. History

pointerdown 记快照，pointerup 提交一条 `UpdateTransformCommand`。move 过程不入栈。feat-014 前可先直接写 store。

### 10. 性能

overlay 每帧重画可接受（手柄少）。禁止为对齐手柄每帧重建 Sprite。

### 11. 异常

NaN/非有限 scale 拒绝。无图层时点选空操作。锁定层拒绝变换。

### 12. 测试

TDD：transformMath。手工：视口缩放后手柄不偏、锁定、空格平移不抢选择。

### 13. 任务

`SEL-001` 模型与 store 选中 · `SEL-002` overlay 框 · `SEL-003` 移动 · `SEL-004` 等比缩放 · `SEL-005` 旋转 · `SEL-006` 与平移手势互斥 · `SEL-007` 手工清单`

对应 **feat-008**。P0。

---

## 09 导入模块

### 1. 目标

本地 JPEG/PNG/WebP 成为文档中的图片层。现已支持 Open / 拖入 / 空 host 点击；主图一张，再导入替换。

### 2. 成熟产品

PS/Photopea：打开文档或置入智能对象。Figma：place image。Canva：上传到素材再拖入。

### 3. 范围

| 级 | 内容 |
|---|---|
| MVP | 【保持】单文件、校验 MIME、Assets.load、失败可见错误、objectURL |
| P1 | 多图导入为多层（依赖 feat-009） |
| P2 | 剪贴板粘贴图片、EXIF 方向 |
| 暂不 | URL 跨域图、HEIC 转码服务 |

### 4. 交互

顶栏打开、拖到 host、空态点击。平移工具激活时不抢空态点击。

### 5. 模型

现有 `ImageLayer`：`objectUrl`、`naturalWidth/Height`。原始 File 不进 store。

链路：`File → objectURL → Assets.load → Texture → Sprite`；文档只留 objectUrl + 自然尺寸。Texture 归 scene。

### 6. PixiJS

`Assets.load(url)`。【保持】不要 `new Image` + `Texture.from` 作主路径。

### 7. Vue / Pinia

`addImageLayer` 替换主图并 `fitView`。错误用 Ant Design message。

### 8. Engine

`imageFile.ts` 校验；`loadLocalImage.ts` 加载。

### 9. History

替换主图应是一条 Command（feat-014）。当前直接 store。

### 10. 性能

超大图解码卡主线程。【建议新增】超限（如单边 > 8192 或文件 > 30MB）拒绝或降采样。GPU `MAX_TEXTURE_SIZE` 超限失败要提示。

### 11. 异常

空文件、非图、解码失败：文档不变、revoke 已建 URL。

### 12. 测试

TDD：MIME/空文件。手工：坏文件、替换主图、hint 隐藏。

### 13. 任务

已完成 feat-006。后续：`IMP-010` 多图 · `IMP-011` 尺寸上限 · `IMP-012` 剪贴板图。

---

## 10 图片对象模块

### 1. 目标

图片层作为一等对象：变换、显隐、锁定、替换、透明度。裁剪/滤镜是子模块。

### 2. 成熟产品

所有对标产品均把「图」当可变换对象（美图偏整图）。

### 3. 范围

MVP：一张主图+变换。P1：多图、翻转、opacity。P2：圆角、边框、阴影。暂不：图片链接替换为云 URL。

### 4. 交互

见选择模块；属性面板改 opacity/翻转。

### 5. 模型

扩展 `ImageLayer`：`opacity?: number`；`flipX/flipY` 可用负 `scaleX/Y` 表达【建议优化】不必新字段。

### 6. PixiJS

`Sprite` + `anchor 0.5`（现导入居中约定）。`alpha` 绑 opacity。

### 7–9. Pinia / Engine / History

图层字段走 store；sync 写 Sprite；改属性一条 Command。

### 10–12. 性能 / 异常 / 测试

大图 culling feat-016。缺 texture 时跳过该层。TDD：翻转与负 scale 约定。

### 13. 任务

`IMG-001` opacity · `IMG-002` 翻转 · 多实例随 feat-009。P1。

---

## 11 裁剪模块

### 1. 目标

矩形裁剪图片，**非破坏**：保存 Crop Model，原 objectUrl 不变，结果可再变换。

### 2. 成熟产品

PS：裁剪工具可提交破坏性；智能对象非破坏。Photopea 类似。Figma：frame clip。Canva：框内裁切。

【建议新增】本仓库用 **Crop 字段 + mask/纹理裁切**，不重编码原图。

### 3. 范围

MVP：自由矩形、确认/取消、overlay 预览。P1：固定比例。P2：裁剪中旋转。暂不：透视裁剪、破坏性导出前烘焙（可作导出选项）。

### 4. 交互

裁剪工具拉框；Enter 确认 Esc 取消；确认前不写死纹理。

### 5. 模型

```ts
interface CropRect {
  x: number
  y: number
  width: number
  height: number
} // 相对自然像素，原点左上
```

写在 `ImageLayer.crop`。

### 6. PixiJS

优先 **Graphics + mask**（矩形走 stencil/scissor）。不要每帧 `RenderTexture` 烘焙。导出时按 crop 尺寸 extract。

### 7. Vue / Pinia

`setLayerCrop` / `clearCrop`。面板可出宽高数字。

### 8. Engine

`model/cropMath.ts`：clamp 到自然矩形、比例约束。tools 只出 Command。

### 9. History

确认裁剪一条；拖框过程不入栈。

### 10. 性能

Mask 比 Sprite mask 便宜。禁止对 8K 图实时 `extract` 预览。

### 11. 异常

宽高 ≤ 0 拒绝。无选中图片不能进裁剪。

### 12. 测试

TDD：crop 矩形与比例。手工：确认后仍可变换；取消恢复；导出不含框外像素。

### 13. 任务

`CROP-001` 模型 · `CROP-002` 框 · `CROP-003` 拖拽 · `CROP-004` 比例 · `CROP-005` 确认 · `CROP-006` Undo · `CROP-007` 导出一致`

feat-010。P1。依赖 feat-009（至少有图层 id）。

---

## 12 文本模块

### 1. 目标

可变换的文字层：字号、颜色、内容。

### 2. 成熟产品

Figma/Canva 文本是一等公民。PS/Photopea 有文字工具与字型。PixiJS：`Text`（Canvas 栅格化，清晰）、`BitmapText`（性能）、HTML Text（实验）。

【建议新增】MVP 用 **`Text`**。频繁改字号/内容时注意纹理重建。富文本/路径文字 P3。

### 3. 范围

MVP：点放置、改 text/fontSize/fill、同一套 transform。P1：对齐、字重。P2：描边、阴影、自动换行。暂不：垂直文字、OpenType 特性。

### 4. 交互

文字工具点画布创建；双击进编辑（可用 DOM textarea 浮层，【建议新增】避免在 WebGL 里做 caret）。

### 5. 模型

见 `TextLayer`。

### 6. PixiJS

`new Text({ text, style })`。不要每帧 `new Text`。style 变了再赋值。

### 7–9

Pinia 加层；scene sync Text；改字一条 Command，输入过程可 debounce 合并。

### 10. 性能

`Text` 改内容会重栅格。【建议优化】输入结束再提交历史。大量文字【后续】BitmapText。

### 11. 异常

空字符串允许为占位。缺字体回退系统字体。

### 12. 测试

TDD：默认 TextLayer。手工：变换、导出含文字不含 caret。

### 13. 任务

`TXT-001` 模型 · `TXT-002` 创建 · `TXT-003` 样式 · `TXT-004` DOM 编辑 · `TXT-005` History`

feat-012。P1。

---

## 13 标注模块

### 1. 目标

矩形、椭圆、箭头、画笔作为 **独立 Scene 对象**（`ShapeLayer`），完成后可再选中。

不要把笔画烘焙进底图像素（除非用户显式「合并」，P3）。

### 2. 成熟产品

美图/Pixlr 有涂鸦；Figma 是矢量 shape；PS 形状层 vs 位图画笔。本仓库走 **矢量对象**（Figma/Canva 路线），马赛克可作特殊 shape 或滤镜。

### 3. 范围

MVP：rect / ellipse / arrow / path（画笔点列）。P1：描边色宽。P2：马赛克、高亮半透明。暂不：压感、自定义笔刷引擎。

### 4. 交互

按下开始、移动加点、松开提交一层。

### 5. 模型

`ShapeLayer` + `points?: {x,y}[]`（世界或层局部，实现时固定一种并写进 design.md）。

### 6. PixiJS

`Graphics`。画笔不要每点一个 Graphics，一条 path 一个对象。

### 7–9

tools 收集点 → store 加层 → sync。一条 stroke = 一条 Command。

### 10. 性能

超长 path 抽稀。【建议优化】pointermove 节流。

### 11. 异常

点击无移动：不产生空层或产生极短线段（在 design 里二选一）。

### 12. 测试

TDD：点列简化。手工：画完能选中再移动。

### 13. 任务

`ANN-001` 模型 · `ANN-002` Graphics sync · `ANN-003` 矩形椭圆 · `ANN-004` 箭头 · `ANN-005` 画笔 · `ANN-006` 再选择`

feat-013。P1。依赖 feat-008。

---

## 14 形状模块

与标注共用 `ShapeLayer`。【建议优化】**不要**拆第二套类型。贴纸/SVG 走素材章，不走本章。

MVP 即 13 的几何图元。P2：正多边形、星形。P3：SVG path 导入。

任务并入 `ANN-*` / 后续 `SHP-010`。

---

## 15 图层模块

### 1. 目标

Pinia `layers[]` 为结构真源；面板显隐/排序/锁定/重命名；scene 按 id diff，禁止每帧拆建。

### 2. 成熟产品

PS/Photopea/Figma：列表倒序（顶层在上）。隐藏不可点；锁定不可变仍可选。

### 3. 范围

MVP：列表=数组倒序、显隐、锁定、重命名、拖拽排序。P1：删除、复制。P2：分组。暂不：合并可见、剪贴蒙版组。

### 4. 交互

右侧列表；拖拽改顺序；眼睛/锁图标。

### 5. 模型

`layers: EditorLayer[]` 底→顶，末尾 zIndex 最大。【保持】与 scheme 一致。

### 6. PixiJS

`content.sortableChildren = true`（已有）。`zIndex` = 数组下标。`visible`/`eventMode` 随锁定隐藏变化。

### 7. Vue / Pinia

`reorderLayers` / `setVisible` / `setLocked` / `rename`。面板不碰 Pixi。

### 8. Engine

sync 按 id 增删改。

### 9. History

每次显隐/排序/重命名一条；拖拽排序 pointerup 一条。

### 10. 性能

N 层 diff O(N)，禁止重建整棵 content。

### 11. 异常

未知 id 跳过。空名回退「图层 n」。

### 12. 测试

TDD：排序与 zIndex。手工：面板与画布一致。

### 13. 任务

`LYR-001` 多图层 store · `LYR-002` 面板 · `LYR-003` sync zIndex · `LYR-004` 删除 · `LYR-005` History`

feat-009。P1。依赖 feat-008。

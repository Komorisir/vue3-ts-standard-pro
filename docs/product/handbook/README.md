# 基于 PixiJS 的画布图片编辑器功能架构与开发迭代手册

> 工程研发手册，不是产品宣传。目标：后续 3～6 个月可按本文拆任务、定接口、实现与验收。  
> 行为契约仍以 `openspec/specs/` 与 `feature_list.json` 为准；本文是架构与迭代指南，不要整份灌进主 spec。

**版本：** 2026-08-18（`feature_list.json` 按功能模块编排）  
**适用工程：** Vue 3 + TypeScript + Pinia + PixiJS v8 浏览器图片画布编辑器  
**已落地基线：** 模块 canvas 与 chrome（031 / 036）已归档。下一刀：feat-008（调整）。

## 怎么读

| 你要做的事 | 读 |
|---|---|
| 理解产品边界与对标 | [02 产品调研](./02-product-research.md) |
| 改分层 / Engine / 对象模型 | [03 技术架构](./03-technical-architecture.md) |
| 实现某个功能 | [04 核心模块](./04-modules-core.md) / [05 进阶模块](./05-modules-advanced.md) |
| 性能、异常、测试 | [06 质量](./06-quality.md) |
| 排期与拆 Issue | [07 路线与任务](./07-roadmap.md) |

已落地实现细节见 [`../../editor/`](../../editor/)。开发计划见 [`../editor-plan.md`](../editor-plan.md)。

## 架构决策标签

后文改造建议一律使用下列标签，避免为理论完美而推翻已稳定工程：

| 标签 | 含义 |
|---|---|
| 【保持现有架构】 | 已落地且必须遵守：Pinia 文档真源、单向 sync、视口与图层变换分离、UI 不 `import 'pixi.js'` |
| 【建议优化】 | 不改分层，只收紧模型或接口 |
| 【建议新增】 | 按 `feature_list.json` 增量加模块 |
| 【后续演进】 | 调研后再立项：人像、画笔笔刷、云素材、模板、多页、协同；自动抠图可走 AI 写回图层 |

## 01 项目定位

### 1.1 产品是什么

桌面浏览器内的**本地图片画布编辑器**：打开站点即进 `/editor`，导入 JPEG/PNG/WebP，在 PixiJS WebGL 画布上浏览、变换、图层编辑、裁剪/调色、文字与标注，最后导出 PNG/JPEG（不含选框 overlay）。

对标方向取「轻量 Photopea / Pixlr E」的**对象+图层文档模型**，壳层布局与视觉**参考美图秀秀**：顶栏三分区、左侧图标 Tab + 二级面板、浅底 + 粉/红强调色（feat-031 左栏已落壳，feat-036 收顶栏与浅色）。不是 Canva 模板电商，也不是 Figma 无限画板。不做成「无图层一步流水线」，不抄 VIP/会员/登录。

### 1.2 当前工程已经稳定的部分

【保持现有架构】

```text
Vue 壳（路由 / EditorLayout / 面板）
        │ 只改文档
        ▼
Pinia useEditorStore    ← 唯一业务真源
        │ 单向 watch
        ▼
usePixiApp + scene/sync
        │
        ▼
stage → viewport → world → background | content | overlay
```

- PixiJS **v8**：`new Application()` + `await app.init()`；挂 `app.canvas`；官方 `destroy`
- 资源：`Assets.load`；拖拽：`eventMode = 'static'` + `globalpointermove`
- 视口 `{ x, y, scale }` 与图层 `transform` 分开
- 一次 OpenSpec change = `feature_list.json` 一项；纯逻辑 TDD，画布手工验收

### 1.2a 左侧工作区 Tab（功能归属）

壳已固定六项，顺序不变。**面板内容按 Tab 分批接线**，未排期的只占位「即将推出」。底层仍是 Pinia `layers[]`，禁止为某个 Tab 另起引擎。

| 模块 | Tab | 面板要做的事 | Feature |
|---|---|---|---|
| adjust | **调整** | 裁剪、旋转/矫正、修改尺寸 | 008、010、032 |
| color | **滤镜调色** | 滤镜预设 + 四滑条 | 011 |
| portrait | **人像** | 先调研 | 034 |
| cutout | **抠图** | 自动/手动抠图、换背景 | 033、024 |
| brush | **画笔** | 先调研 | 035 |
| materials | **素材** | 贴纸、矩形/圆、文字 | 013、026、012 |

横切、不进左侧 Tab：选择变换（画布手柄，feat-008）、图层面板（右侧，feat-009）、文字（feat-012）、质量。文字入口后续可挂到素材或顶栏，不在本轮六 Tab 里强行塞。

### 1.2b 顶栏 Toolbar（功能归属）

参考美图顶栏：**左文档 / 中历史 / 右交付**。能力接线随对应 feat，布局在 feat-036 一次改完。

| 分区 | 控件 | 对应 feature | 状态 |
|---|---|---|---|
| 左 | 品牌名、打开 | feat-006 已接线打开 | 视觉随 036 |
| 中 | 历史入口（可先占位）、撤销、重做 | feat-014 | 按钮已占位 |
| 右 | 适配、保存/导出（主色按钮） | 适配 feat-007；导出 feat-015 | 适配已接线 |

不做：会员角标、账号头像、云优化。历史面板可后做，中区先留图标位。

### 1.2c 美图风格布局与视觉

【建议新增】feat-036。学结构与气质，不复制商标。

| 区域 | 参考 | 本仓库 |
|---|---|---|
| 顶栏 | 白底、矮、三分区 | 48～56px；左中右；主操作（保存）用强调色 |
| 左 Tab 列 | 窄、图标+四字内文案、选中点/底 | 已有 64px 列；选中改为粉/红强调 |
| 二级面板 | 白底、分组标题、完成/取消 | 220px；调整里裁剪/旋转/尺寸分组 |
| 画布 | 浅灰底，图居中 | host `#ebebeb`；Pixi `background` 跟 host，勿粉红舞台 |
| 右侧 | 可弱化为浅底列表 | feat-009 再收；036 先改底色与字色 |

不变量：`#pixi-host` 稳定宽高；切 Tab / 改肤色不得 `destroy` Application。UI 仍不 `import 'pixi.js'`。

### 1.3 非目标（当前 3～6 个月不做）

多人协同、云素材登录、把人像/画笔做成默认能力（先调研）、视频时间轴、移动端原生壳、GIF 时间轴、用 `create-pixi` 覆盖仓库。需要时【后续演进】单独立项。

### 1.4 必须回答的工程问题（索引）

| # | 问题 | 章节 |
|---|---|---|
| 1–4 | 模块清单、边界、底层 vs 业务 | 02、03、04/05 |
| 5–7 | Pixi / Vue·Pinia / Engine 各管什么 | 03 |
| 8–10 | 依赖、模型、实现 | 03 依赖图 + 04/05 |
| 11–12 | 优先级与插件化 | 07 |
| 13 | 如何避免架构失控 | 03 扩展点 |
| 14 | 大图 / 多层 / 滤镜性能 | 06 |
| 15 | Undo / Redo | 05 历史 |
| 16 | 导出与画布一致 | 05 导出 |

## 章节目录（对应提示词 01–30）

| 章 | 文件 |
|---|---|
| 01 项目定位 | 本页 |
| 02 成熟产品调研 / 03 功能矩阵 | [02-product-research.md](./02-product-research.md) |
| 04 通用功能架构 / 05 技术架构 / 06 Engine / 07 Object Model | [03-technical-architecture.md](./03-technical-architecture.md) |
| 08–15 选择、导入、图片、调整（裁剪/旋转/尺寸）、文本、素材几何、图层 | [04-modules-core.md](./04-modules-core.md) |
| 16–24 滤镜调色、人像/画笔调研、抠图、蒙版、特效、素材、历史、导出 | [05-modules-advanced.md](./05-modules-advanced.md) |
| 25 性能 / 26 异常 / 27 测试 | [06-quality.md](./06-quality.md) |
| 28 迭代路线（顶栏 + 左侧 Tab） / 29 Roadmap / 30 任务 | [07-roadmap.md](./07-roadmap.md) |

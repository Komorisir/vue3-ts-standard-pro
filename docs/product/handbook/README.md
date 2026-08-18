# 基于 PixiJS 的画布图片编辑器功能架构与开发迭代手册

> 工程研发手册，不是产品宣传。目标：后续 3～6 个月可按本文拆任务、定接口、实现与验收。  
> 行为契约仍以 `openspec/specs/` 与 `feature_list.json` 为准；本文是架构与迭代指南，不要整份灌进主 spec。

**版本：** 2026-08-18  
**适用工程：** Vue 3 + TypeScript + Pinia + PixiJS v8 浏览器图片画布编辑器  
**已落地基线：** feat-003～007（路由、壳、Application、导入、视口）。下一刀：feat-008 选择与变换。

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
| 【后续演进】 | 3～6 个月后：素材、模板、AI、多页、协同；不进当前 P0/P1 |

## 01 项目定位

### 1.1 产品是什么

桌面浏览器内的**本地图片画布编辑器**：打开站点即进 `/editor`，导入 JPEG/PNG/WebP，在 PixiJS WebGL 画布上浏览、变换、图层编辑、裁剪/调色、文字与标注，最后导出 PNG/JPEG（不含选框 overlay）。

对标方向取「轻量 Photopea / Pixlr E」的**对象+图层编辑**，而不是 Canva 的模板电商，也不是 Figma 的无限画板协同。参考成熟产品的**功能组织、模块边界、数据模型、交互模式**，不照搬某一家 UI。

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

### 1.3 非目标（当前 3～6 个月不做）

多人协同、云素材库、AI 修图作为默认能力、视频时间轴、移动端原生壳、GIF 时间轴、用 `create-pixi` 覆盖仓库。需要时【后续演进】单独立项。

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
| 08–15 选择、导入、图片、裁剪、文本、标注、形状、图层 | [04-modules-core.md](./04-modules-core.md) |
| 16–24 滤镜、蒙版、特效、素材、历史、剪贴板、快捷键、保存、导出 | [05-modules-advanced.md](./05-modules-advanced.md) |
| 25 性能 / 26 异常 / 27 测试 | [06-quality.md](./06-quality.md) |
| 28 迭代路线 / 29 Roadmap / 30 任务拆分 | [07-roadmap.md](./07-roadmap.md) |

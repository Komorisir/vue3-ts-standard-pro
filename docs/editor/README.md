# 编辑器模块文档

按 `src/editor/` 与 OpenSpec capability 对齐。**新功能归档后在本目录新增一篇**，不要把实现细节继续堆进 `product/editor-plan.md`。

新模块可复制 [`_template.md`](./_template.md)。

## 已落地

| 模块 | 文档 | 代码 | OpenSpec | feature |
|---|---|---|---|---|
| 分层与数据流 | [architecture.md](./architecture.md) | `src/editor/`、`src/shared/` | — | 全程 |
| 路由与应用壳 | [shell.md](./shell.md) | `src/router/`、`src/layouts/`、`src/editor/components/` | `editor-router`、`editor-shell` | feat-003、004、031、036、037、038 |
| Pixi Application | [pixi-app.md](./pixi-app.md) | `src/editor/core/` | `pixi-application` | feat-005 |
| 场景与导入 | [scene.md](./scene.md) | `src/editor/scene/`、`assets/`、`model/image*` | `scene-import` | feat-006 |
| 视口平移缩放 | [viewport.md](./viewport.md) | `model/viewportMath.ts`、`tools/useViewportGestures.ts` | `viewport-navigation` | feat-007 |
| 调整：裁剪 / 旋转 / 改尺寸 | [image-adjust.md](./image-adjust.md) | `model/imageAdjust.ts`、`history/`、`components/adjust/` | `image-adjust` | feat-010、feat-032 |

## 待落地（占位，实现时再写）

| 模块 | 建议文件 | feature |
|---|---|---|
| 选择与变换 | `transform.md` | feat-008 |
| 图层模型与面板 | `layers.md` | feat-009 |
| 形状与 Alpha 蒙版 | `mask.md` | feat-024 |
| 滤镜调色 | `filters.md` | feat-011 |
| 文字图层 | `text.md` | feat-012 |
| 素材几何（矩形/圆） | `shapes.md` | feat-013 |
| 贴纸置入 | `assets.md` | feat-026 |
| 抠图与换背景 | `cutout.md` | feat-033 |
| 撤销重做 | `history.md` | feat-014 |
| 导出 | `export.md` | feat-015 |
| 性能与释放 | `performance.md` | feat-016 |
| 键盘与无障碍 | `a11y.md` | feat-018 |

产品阶段总表仍在 [`../product/editor-plan.md`](../product/editor-plan.md) 第 5 节。

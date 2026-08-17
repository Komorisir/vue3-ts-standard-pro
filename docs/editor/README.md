# 编辑器模块文档

按 `src/editor/` 与 OpenSpec capability 对齐。**新功能归档后在本目录新增一篇**，不要把实现细节继续堆进 `product/editor-scheme.md`。

新模块可复制 [`_template.md`](./_template.md)。

## 已落地

| 模块 | 文档 | 代码 | OpenSpec | feature |
|---|---|---|---|---|
| 分层与数据流 | [architecture.md](./architecture.md) | `src/editor/`、`src/shared/` | — | 全程 |
| 路由与应用壳 | [shell.md](./shell.md) | `src/router/`、`src/layouts/`、`src/editor/components/` | `editor-router`、`editor-shell` | feat-003、004 |
| Pixi Application | [pixi-app.md](./pixi-app.md) | `src/editor/core/` | `pixi-application` | feat-005 |
| 场景与导入 | [scene.md](./scene.md) | `src/editor/scene/`、`assets/`、`model/image*` | `scene-import` | feat-006 |
| 视口平移缩放 | [viewport.md](./viewport.md) | `model/viewportMath.ts`、`tools/useViewportGestures.ts` | `viewport-navigation` | feat-007 |

## 待落地（占位，实现时再写）

| 模块 | 建议文件 | feature |
|---|---|---|
| 选择与变换 | `transform.md` | feat-008 |
| 图层模型与面板 | `layers.md` | feat-009 |
| 裁剪与蒙版 | `crop.md` | feat-010 |
| 滤镜调色 | `filters.md` | feat-011 |
| 文字图层 | `text.md` | feat-012 |
| 矢量标注 | `annotate.md` | feat-013 |
| 撤销重做 | `history.md` | feat-014 |
| 导出 | `export.md` | feat-015 |
| 性能与释放 | `performance.md` | feat-016 |
| 键盘与无障碍 | `a11y.md` | feat-018 |

产品阶段总表仍在 [`../product/editor-scheme.md`](../product/editor-scheme.md) 第 6 节。

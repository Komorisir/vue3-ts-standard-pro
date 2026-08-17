## Why

编辑器已有 Pixi 画布，但仍是空舞台，用户无法看见图。MVP 需要先能把本地图片放进分层场景。对应 `feature_list.json` 的 **feat-006**。做法见 `docs/pixijs-editor-dev-scheme.md` 第 3.1 节与第 6 节 P1 feat-006。

## What Changes

- 在渲染器舞台下建立 viewport / world / background / content / overlay 分层；导入的图只进 content
- 用户可通过顶栏「打开」、空态点击或拖入文件，导入 jpg / jpeg / png / webp
- 合法文件经 `Assets.load` 成为文档中的唯一主图，并在画布中央显示；再次导入替换上一张
- 非法或损坏文件给出可见错误，不写入文档、不往场景加图
- 文档中至少有一张图时隐藏空态提示
- 文档以 Pinia 为唯一真源，场景单向同步；本项不做图层面板、视口手势或撤销栈

## Capabilities

### New Capabilities

- `scene-import`: 场景分层与本地图片导入（居中显示、错误提示、空态随文档变化）

### Modified Capabilities

- `editor-shell`: 空态提示在有图后隐藏；顶栏「打开」与 host 拖入/点击开始执行导入
- `pixi-application`: 舞台在就绪后承载场景分层，而不再只是空的深色表面

## Non-goals

- 不实现视口平移、滚轮缩放、适配（feat-007）
- 不实现点选、变换手柄（feat-008）
- 不实现图层面板的显隐/锁定/排序 UI（feat-009）；本项只落最小文档模型
- 不实现撤销重做命令栈（feat-014）
- 不单测 `Assets.load`、Sprite 像素或 WebGL 帧
- 不把 DisplayObject 放进 Pinia

## Impact

- 新增 model 类型、本地文件校验、`loadLocalImage`、最小 editor store、scene 分层与按 id 同步
- `usePixiApp` 向 scene 暴露已初始化的 Application（仍不进 store）
- 顶栏「打开」可点；其余顶栏按钮仍禁用
- 验证：文件校验与图层工厂 TDD；导入居中与错误提示手工验收

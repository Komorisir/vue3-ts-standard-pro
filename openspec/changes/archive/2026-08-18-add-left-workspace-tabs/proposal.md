## Why

当前左侧只是一条窄工具栏，无法按工作区分组；顶栏也是一排深色按钮，对不上美图秀秀「左文档 / 中历史 / 右交付」的浏览方式。需要先改壳层信息架构与肤色，再把已有工具和后续能力挂进去。

对应 **feat-031**（左侧六 Tab）与 **feat-036**（顶栏三分区 + 浅色壳）。两项同属 chrome 模块、共享 `#pixi-host` 不重挂约束，因此在本 change 上扩充，不另开 change。界面分区背景见 `docs/product/editor-plan.md` 第 4 节、handbook [1.2a](../../docs/product/handbook/README.md)～[1.2c](../../docs/product/handbook/README.md) 与 `docs/editor/shell.md`。

## What Changes

- 左侧从单列工具按钮改为双列：最左图标 Tab 栏 + 邻接的工作区面板
- Tab 固定为且仅为此六项，顺序不变：**调整**、**滤镜调色**、**人像**、**抠图**、**画笔**、**素材**
- 首次进入默认选中 **调整**；点击另一 Tab 只切换邻接面板，不销毁中央 `#pixi-host`，不重挂 Pixi
- **调整** 面板继续承载现有工具：平移可用；选择 / 裁剪 / 文字 / 形状仍可占位
- 其余五个工作区展示标题与「即将推出」占位，不接线滤镜、人像、抠图、画笔或素材业务
- 顶栏改为左中右三分区：左品牌 + 打开；中历史占位 + 撤销 / 重做；右适配 + 保存（主操作）
- 壳层改为浅色：顶栏白底、Tab 列浅灰、host 与 Pixi `background` 均为 `#ebebeb`；选中 Tab 与「保存」共用粉/红强调色
- 打开 / 适配 / 平移的既有接线保持不变；撤销、重做、历史、保存仍为占位，不抄会员 / 头像 / 云优化

## Capabilities

### New Capabilities

- （无）工作区导航与顶栏分区仍属于应用壳，不另立 capability

### Modified Capabilities

- `editor-shell`: 左侧改为「分类 Tab + 工作区面板」；顶栏改为三分区；四区同时可见、稳定 host、空态与面板不创建渲染器的要求保留，并补充 Tab 切换、占位面板、浅色壳与强调色
- `pixi-application`: 空舞台背景从深色改为跟随 host 的浅灰，避免改肤色后闪一块深色画布

## Non-goals

- 不实现滤镜调色、人像、抠图、画笔、素材的真实编辑（仍属 feat-011 / 026 / 013 等后续项）
- 不在本项做裁剪、旋转、尺寸、选择变换（feat-008 / feat-010）
- 不接线撤销栈（feat-014）或真实导出 / 保存（feat-015）
- 不引入 VIP、账号头像、云优化或第二套品牌商标
- 不引入第二文档真源，不把 Tab 选中或肤色写入可导出工程
- 不单测 WebGL 帧

## Impact

- UI：`EditorLayout` 左栏加宽以容纳双列，并改为浅色 token；`EditorToolbar` 拆成左中右；`EditorToolRail` 收进调整面板
- 纯逻辑：工作区 Tab 目录、顶栏分区与壳层色板抽成可测 helper，先红后绿
- 引擎：`createPixiAppInitOptions` 的 `background` 跟 host 色板，不改 init / destroy 生命周期
- Pinia：文档图层 / 视口不变；平移仍走现有 `activeTool`
- 无新 npm 依赖
- 验证：目录与色板用 vitest；布局、肤色与 host 面积用手工验收

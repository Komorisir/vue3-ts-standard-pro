## Why

壳层已按美图浅色落地，但颜色、字号、Ant 控件密度和图标用法散落在组件里，Agent 写面板时会再发明一套样式。需要把 `docs/product/ui-spec.md` 收成可执行的 token 真源，并让现有壳立刻跟规范对齐。

对应 **feat-037**（chrome：编辑器 UI 规范与 token 真源；apply 时写入 `feature_list.json`）。人读全文见 [`docs/product/ui-spec.md`](../../../docs/product/ui-spec.md)；壳层背景见 `docs/product/editor-plan.md` 第 4 节与 [`docs/editor/shell.md`](../../../docs/editor/shell.md)。

## What Changes

- 扩展壳层 token 模块为唯一真源：色板、字号、间距、圆角、动效、字体栈同时映射到 CSS 变量和 Ant `ConfigProvider`
- 编辑器根使用 `componentSize: small`；漏网控件（如改尺寸输入）改为 compact
- 清掉全局样式里与浅色壳冲突的 Vite 暗色残留；系统暗色偏好不得把编辑器拧成深色字/底
- 现有壳去掉裸 hex：顶栏、左 Tab、四区 Layout、调整手风琴卡片改读 token；手风琴圆角收到 8px；折叠指示改为 IconPark outline
- 人读规范已写在 `docs/product/ui-spec.md`（含 Ant 白名单、IconPark、画布 overlay 分工）；`docs/editor/shell.md` 加链接，不复制全文

## Capabilities

### New Capabilities

- （无）本项是壳层视觉契约收口，不另立 capability

### Modified Capabilities

- `editor-shell`: 浅色美图壳保留；补充 compact 控件密度、中文友好字体栈、token 驱动的表面/文字/边框/状态色；系统暗色偏好不得覆盖浅色壳；调整手风琴用图标指示展开而非字符箭头

## Non-goals

- 不换品牌色、不做暗色主题、不折叠四区、不改顶栏 52 / 左 284 / 右 240 像素
- 不把裁剪 overlay 迁到 Pixi，不实现 feat-008 变换手柄
- 不二次封装 Ant 组件库，不引入第二套图标或 Web 字体文件
- 不写完整键盘/读屏（feat-018），不用 `notification`
- 不把 `docs/product/ui-spec.md` 全文灌进主 spec
- 不单测 WebGL 帧

## Impact

- UI：`EditorLayout` 的 `ConfigProvider` 补全 token 与 `componentSize` / `fontFamily`；顶栏、Tab、调整面板、`style.less` 去冲突样式
- 纯逻辑：`chromeTheme` 扩展可测常量（色、间距阶、字号阶、字体栈、Ant token 映射），先红后绿
- 引擎：Pixi `background` 仍跟 host token，不改 init / destroy
- Pinia：文档与视口不变
- 无新 npm 依赖（仍用 ant-design-vue 与 `@icon-park/vue-next`）
- 验证：token 与映射用 vitest；浅色壳、small 控件、手风琴图标用手工验收

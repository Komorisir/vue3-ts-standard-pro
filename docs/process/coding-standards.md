# 编码规范

适用于本仓库全部 TypeScript / Vue 代码。产品是 PixiJS v8 图片画布编辑器：Vue 管壳与交互入口，Pinia 是文档真源，Pixi 只做单向渲染同步。

配套：[`tdd.md`](./tdd.md)、[`openspec.md`](./openspec.md)、[`../product/editor-scheme.md`](../product/editor-scheme.md)、[`../editor/architecture.md`](../editor/architecture.md)。Cursor 摘要见 `.cursor/rules/coding-standards.mdc`。

---

## 1. 职责单一

每个模块、文件、组合式函数只承担**一类变化原因**。禁止「又管渲染又改文档又画 UI」的大聚合。

### 分层（禁止串层）

| 层 | 目录（落地后） | 只允许做 | 禁止做 |
|---|---|---|---|
| UI | `src/views/`、`src/layouts/`、`src/editor/components/` | 面板、按钮、表单；调用 store / 发出命令 | `import 'pixi.js'`；直接改 Sprite / Graphics |
| 状态 | `src/editor/store/` | 文档、选中、视口状态；暴露 action | 创建 `Application`；持有 DisplayObject |
| 业务命令 | `src/editor/history/`、`src/editor/model/` | Command、纯校验、类型 | 碰 canvas / ticker |
| 工具手势 | `src/editor/tools/` | 指针事件 → 生成 Command | 直接改场景图或 store 私有字段 |
| 渲染同步 | `src/editor/scene/` | 按 layerId diff 文档 → 场景 | 成为第二真源；在 sync 里写业务规则 |
| 引擎生命周期 | `src/editor/core/` | `Application` init / destroy / 挂载 | 图层算法、撤销栈 |
| 共享工具 | `src/shared/` | 无业务语义的纯函数 / 通用 hook | 依赖 Pinia 文档或 Pixi 对象 |

数据流只允许：

```
UI / tools  →  Command  →  Pinia 文档  →  scene/sync  →  Pixi
```

禁止反向：Pixi 事件处理函数里直接改文档字段；store 里 `import { Sprite }`。

### 文件膨胀

- 单文件超过约 **200 行有效逻辑**（不含空行与注释）时，按职责拆文件，不要继续往里堆。
- 一个 `export` 只表达一个能力。需要「应用服务」时用薄组装函数，不要写成上帝类。
- Vue SFC：一个组件一种界面职责。顶栏、图层面板、画布 host 分文件，不要做成巨型 `Editor.vue`。

---

## 2. 低耦合、高内聚

模块只依赖**公开契约**，不依赖对方文件内部实现。

### 允许的通信

- **入参 / 返回值**：纯函数、hook 参数、Command 载荷
- **类型契约**：`src/editor/model/types.ts` 中的 interface / type（文档、变换、命令）
- **事件**：Pixi `eventMode` + `FederatedEvent`；Vue 组件 `emit`；不要用全局 EventBus 传文档
- **Store 公开 API**：只调用 Pinia 的 state getter 与 action

### 禁止

- 跨模块读取或写入对方未导出的字段、`$` 内部、`_` 前缀约定私有成员
- `scene` 引用 `tools` 的闭包变量；`tools` 持有未通过参数传入的 Sprite
- UI 组件 `import` 另一个功能模块的内部 helper（应提升到 `shared/` 或 `model/`）
- 为了图省事把 DisplayObject 塞进 Pinia

同层可以组合；跨层只走上表契约。新增依赖前先问：能否只传数据、不传对象身份。

---

## 3. 可复用优先

先找 `src/shared/` 与 `src/editor/model/`，再写新代码。

必须抽离、禁止在业务里复制：

- 数值：`clamp`、矩形相交、弧度/角度（已有先用已有）
- 资源：本地 File → objectURL → `Assets.load` 的加载与释放
- 变换：world / viewport 坐标换算（集中在 `scene` 或 `shared` 的纯函数）
- 指针拖拽骨架：`static` + `globalpointermove` + 解绑（一处实现，工具复用）
- Vue：可复用的无业务组件放 `src/components/` 或 `editor/components/`，业务页只组装

业务层（store action、具体工具）只编排：校验 → 命令 → 提交。不要在 `CropTool` 里再写一套指针订阅。

---

## 4. 健壮容错

外部输入、画布操作、资源加载、用户手势都必须在边界上校验。非法数据不得打进 ticker 或 GPU。

### 必须做

- **入参**：`NaN` / `Infinity` / `min > max` / 空 File / 非图片 MIME 在入口拒绝，返回明确错误或 Result，不要静默当 0
- **资源**：`Assets.load` 用 try/catch；失败提示用户；`objectURL` 在图层删除与 `onUnmounted` 的 `finally` 里 `revoke`
- **引擎**：`init()` 完成前不读 `canvas` / `renderer`；卸载走官方 `destroy`；重复进入页面不得留下第二块 canvas
- **手势**：锁定层、隐藏层、无选中时操作直接 return；解绑 pointer 监听，避免泄漏
- **渲染循环**：ticker / 事件回调内捕获异常并记录，禁止未捕获异常撕掉整页

### 不要做

- 用 `as` 把未校验的用户输入当成合法 `Transform2D`
- 吞掉错误且不留日志（开发用 `console.error` 或统一 logger；不要空 `catch {}`）
- 在 sync 失败时拆掉整棵场景重建（按 id 跳过坏层，其余继续）

纯校验函数放 `model/` 或 `shared/`，用 Vitest 覆盖；画布崩溃路径在 change 的 design 里写手工清单。

---

## 5. 注释（可读性）

注释写**职责、边界、不变量、失败时行为**，用中文。标识符保持英文。

### 必须有

1. **文件头**（每个 `.ts` / `.vue`）：这段代码负责什么、不负责什么、依赖哪一层。
2. **公开导出**：函数、composables、Pinia store、Command 用 JSDoc：`@param`、`@returns`、`@throws`（若会抛）。
3. **非显而易见的决策**：例如「视口变换不写进图层 transform」「overlay 不进导出」。
4. **Vue SFC**：`<script setup>` 顶部用一段话说明该组件的界面职责。

### 不要写

- 复述下一行代码（`// 返回较小值`）
- 大段注释掉的旧实现
- 把 OpenSpec / AGENTS 原文贴进源码

### 示例

```ts
/**
 * 将数值限制在闭区间 [min, max]。
 * 仅做数值边界，不含视口或图层语义。
 *
 * @throws 当 min > max
 */
export function clamp(value: number, min: number, max: number): number {
  if (min > max) {
    throw new Error('clamp: min must be <= max')
  }
  return Math.min(max, Math.max(min, value))
}
```

---

## 自检（实现结束前）

- [ ] 这个文件只有一个变化原因？超 200 行是否已拆？
- [ ] 有没有跨层 `import pixi.js` 或把 DisplayObject 放进 store？
- [ ] 通用逻辑是否已抽到 `shared/` / `model/`，而不是复制一份？
- [ ] 外部输入与加载失败是否有校验和 `finally` 释放？
- [ ] 文件头与公开 API 的 JSDoc 是否写了职责和失败行为？

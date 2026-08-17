## Context

See `proposal.md` for motivation. `/editor` already mounts `EditorPage` as a single placeholder line. Coding standards require one Vue SFC per UI duty and forbid `import 'pixi.js'` in the UI layer. This change owns **UI only**. Neighbors keep using the existing route table; feat-005 will receive a public host id / element, not a Pixi object from the shell.

## Goals / Non-Goals

**Goals:**

- Split chrome into small UI components assembled by `EditorPage`
- Publish a stable host contract (`id` + empty-state copy) that feat-005 can `resizeTo`
- Keep every shell file free of `pixi.js` and editor Pinia

**Non-Goals:**

- Nested `/editor` child routes
- Wiring toolbar buttons to real commands
- Measuring resize in unit tests (jsdom layout is unreliable)

## Decisions

1. **Layer: UI only; contract is host id + slots/props**
   - Why: feat-005 needs a DOM node, not a layout god-object.
   - Alternative: One `Editor.vue` with all regions. Rejected by the 200-line / single-responsibility rule.

2. **Component split**
   - `EditorLayout`：四区排版（flex / Ant Design Layout）
   - `EditorToolbar`：顶栏占位（打开 / 撤销 / 适配 / 导出 文案）
   - `EditorToolRail`：左侧工具占位
   - `CanvasHost`：`#pixi-host` + 空态文案；不处理 File
   - `EditorSidePanel`：右侧图层/属性占位
   - `EditorPage`：只组装，不含样式细节
   - Alternative: keep everything in `EditorPage`. Rejected.

3. **Host contract in a tiny UI-agnostic module**
   - Export `PIXI_HOST_ID` and empty-state string from `src/editor/components/canvasHostContract.ts` (or `src/shared/editor/canvasHost.ts` if we want zero Vue in the constant file). Prefer `src/editor/components/` next to the host, or `src/editor/model/` if we treat it as a published constant. **Decision:** `src/editor/canvas/canvasHostContract.ts` — no Vue, no Pixi, so feat-005 can import the id without pulling components.
   - TDD: spec the exported id and copy first.
   - `@vue/test-utils` mounts `CanvasHost` and asserts the element id exists. Do **not** assert computed pixel size in jsdom.

4. **Ant Design Vue Layout for chrome, host is a plain div**
   - Why: panels already planned on Ant Design; the host must stay a simple element for `resizeTo`.
   - Alternative: CSS-grid only. Acceptable fallback if Layout fights flex height; prefer Layout first.

5. **Empty-state is visible text, not a working drop zone**
   - Why: open/drop is feat-006. Showing the copy now avoids a blank gray hole.
   - Click handlers MUST be no-ops or absent.

6. **No editor store**
   - Why: chrome placeholders are not document state. Do not invent a second source of truth.

## Risks / Trade-offs

- [Host height collapses to 0 in flex] → Layout 用 column flex + host `flex: 1; min-height: 0`；手工拉窗口确认
- [jsdom 量不到真实尺寸] → 单元测试只锁 id / 文案；resize 手工验收
- [占位按钮看起来可点] → 使用 disabled 或纯文案，避免假成功

## Migration Plan

1. 先红后绿写出 host 契约常量
2. 拆组件 + `EditorPage` 组装
3. `pnpm test:run` 与 `./init.sh`
4. 手工：四区可见；host 有面积；缩小窗口 host 仍在中央区

Rollback: 恢复 `EditorPage` 单行占位。

## Open Questions

None. 占位文案与四区结构以方案第 5 节为准。

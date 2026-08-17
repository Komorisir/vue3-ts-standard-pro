## Context

See `proposal.md` for motivation. `#pixi-host` already exists via `canvasHostContract`; `CanvasHost` is a stable empty div. Coding standards put `Application` init/destroy in `src/editor/core/`, and forbid UI files from `import 'pixi.js'`. PixiJS v8 requires `new Application()` with no constructor options, `await app.init(options)`, mount `app.canvas`, and official `destroy`. Do not introduce Pinia or a scene graph in this change.

## Goals / Non-Goals

**Goals:**

- Add `pixi.js` v8 with `pnpm add pixi.js` only
- Own renderer lifecycle in the engine layer; UI only supplies the host element
- Publish a pure init/destroy options contract that neighbors can read without touching WebGL
- Abort in-flight `init` on unmount so a fast leave cannot leave a second canvas

**Non-Goals:**

- Viewport/world/content containers (feat-006)
- Sharing the `Application` instance through Pinia or a global getter (feat-006 decides how scene sync receives `app`)
- Unit-testing `Application.init` or GPU frames

## Decisions

1. **Layer: engine lifecycle owns Pixi; UI only calls the composable**
   - `src/editor/core/usePixiApp.ts` imports `pixi.js`, constructs `Application`, mounts and destroys.
   - `CanvasHost.vue` calls `usePixiApp` and still MUST NOT `import 'pixi.js'` or hold DisplayObject.
   - Toolbar / tool rail / side panel stay untouched.
   - Public contract for this change: host id from `canvasHostContract` + composable side effects on that element. Do not put `Application` in Pinia.
   - Alternative: `EditorPage` starts the engine. Rejected — page assembly would mix chrome and renderer.
   - Alternative: a second Vue SFC under `core/`. Rejected — host already exists.

2. **Pure options module is the TDD surface**
   - `src/editor/core/pixiAppOptions.ts` exports:
     - `createPixiAppInitOptions(host: HTMLElement)` → `{ resizeTo: host, background: '#1a1a1a', antialias: true, autoDensity: true, resolution: window.devicePixelRatio || 1, preference: 'webgl' }`
     - `PIXI_APP_DESTROY_RENDERER` → `{ removeView: true, releaseGlobalResources: true }`
     - `PIXI_APP_DESTROY_STAGE` → `{ children: true, texture: true, textureSource: true }`
   - TDD: spec these objects first (host identity, `preference === 'webgl'`, dark background, destroy flags). No WebGL.
   - Alternative: inline literals in the composable. Rejected — then this change has no failing spec before implementation, against TDD for pure logic.

3. **`usePixiApp` lifecycle**
   - Resolve host with `document.getElementById(PIXI_HOST_ID)` (or the component root if it is the host). If missing: `console.error` and return; do not throw.
   - If `clientWidth`/`clientHeight` are 0, retry on animation frames until sized or unmounted (cap retries). Host already has `min-height: 200px`; this is a guard, not a layout rewrite.
   - `const app = new Application(); await app.init(createPixiAppInitOptions(host));` then `host.appendChild(app.canvas)` only if still mounted.
   - Generation / aborted flag: if unmount happens during `await init`, `destroy` the instance in `finally` and do not append.
   - `onUnmounted`: set aborted; if app exists, `try/finally` `app.destroy(PIXI_APP_DESTROY_RENDERER, PIXI_APP_DESTROY_STAGE)`.
   - Ticker callbacks are not added in this change; default autoStart is enough for an empty dark stage.
   - Manual: enter `/editor` → one canvas; leave and return → still one canvas; no WebGL warning in console.

4. **`resizeTo` is the host element, not `window`**
   - Why: chrome must not be included in renderer size; feat-007 keeps this target and only adds viewport pan/zoom.
   - Combine with `autoDensity` + `resolution: devicePixelRatio`.
   - Manual: drag the window; canvas client size tracks `#pixi-host`.
   - Do not unit-test pixel sizes in jsdom.

5. **Hint overlays the canvas**
   - Host stays `position: relative`. Canvas CSS: `position: absolute; inset: 0; display: block; z-index: 0`. Hint: higher z-index, existing `pointer-events: none`.
   - Alternative: hide the hint once canvas exists. Rejected — empty-document copy is still required.

6. **No scene, no store**
   - `app.stage` stays empty. Background comes from `init` options, not a checkerboard container.
   - Do not export a process-wide `getApp()`. feat-006 will receive `app` from the same mount point or a later core API.

## Risks / Trade-offs

- [Unmount during `await init` appends a canvas onto a detached host] → aborted flag; destroy without append
- [jsdom cannot run WebGL `init`] → only options/destroy constants are unit-tested; runtime is manual
- [Host size 0 at `onMounted`] → wait for non-zero client box; existing min-height is the layout fallback
- [UI accidentally imports `pixi.js`] → tasks include a grep/self-check that only `src/editor/core/` imports it
- [`releaseGlobalResources: true` is heavier than needed for a single app] → still use official teardown so leave/return does not flicker; feat-016 can tighten pooling later

## Migration Plan

1. `pnpm add pixi.js` (v8). Never `create-pixi`.
2. Red then green: `pixiAppOptions` spec + implementation.
3. Implement `usePixiApp`; wire it from `CanvasHost`; overlay styles.
4. `pnpm test:run` and `./init.sh`.
5. Manual: one canvas, dark empty stage, hint visible, resize, leave/return.

Rollback: remove the composable call, revert `pixi.js`, keep the shell host.

## Open Questions

None. WebGL preference, host `resizeTo`, and destroy option bag follow the product scheme and PixiJS v8 skill.

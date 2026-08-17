## Context

See `proposal.md` for motivation. `usePixiApp` already creates a PixiJS v8 `Application` and mounts `app.canvas`, but it does not return the instance or build a scene. Coding standards require Pinia as the only document source of truth and forbid UI/`store` from importing `pixi.js` or holding DisplayObject. Load path is File → objectURL → `Assets.load` → Sprite. Viewport pan/zoom is feat-007.

## Goals / Non-Goals

**Goals:**

- Mount viewport / world / background / content / overlay once the app is ready
- Import JPEG/PNG/WebP through Open, empty-host click, or drop
- Keep a minimal Pinia document; scene syncs one-way by layer id
- Expose the initialized `Application` from the engine layer without putting it in Pinia

**Non-Goals:**

- Command stack (feat-014): store actions are enough for this change
- Layer panel, visibility, lock, reorder UI (feat-009)
- Checkerboard fill for `background`; the container exists empty

## Decisions

1. **Layers and public contracts**
   - `model/`: `ImageLayer` types, MIME check, `createImageLayer`, `centerImageTransform`
   - `store/editor.ts`: Pinia document (`layers`); action `addImageLayer` 替换唯一主图并 revoke 旧 objectURL；no DisplayObject
   - `assets/loadLocalImage.ts`: objectURL + `Assets.load` (engine-adjacent, may import `pixi.js`)
   - `scene/`: `createSceneGraph(app)` and `syncImageLayers(content, layers)`
   - UI: `EditorToolbar` Open; `CanvasHost` drop / empty click; no `import 'pixi.js'`
   - Alternative: add Sprite directly from the file picker. Rejected — scene would become a second source of truth.

2. **`usePixiApp` returns a shallowRef**
   - `{ app: ShallowRef<Application | null> }`. Scene watches `app` and builds the graph when non-null.
   - Alternative: `provide`/`inject`. Acceptable later; a returned ref is enough for CanvasHost to wire one composable.
   - Alternative: module singleton `getApp()`. Rejected — hides lifetime.

3. **TDD surface is pure model + store, not Pixi**
   - Failing specs first: accepted MIME (`image/jpeg|png|webp` and `.jpg/.jpeg/.png/.webp` fallback), reject empty/non-image; `createImageLayer`; `centerImageTransform(viewW, viewH)` places `x/y` at the view center with `scale=1`, `rotation=0`.
   - Pinia `addImageLayer` replaces the previous main image (at most one image layer).
   - Manual: Open / drop / empty click; image centered; second import replaces the first; bad file shows Ant Design `message.error`; hint hides; leave page no leftover canvas.
   - Do not unit-test `Assets.load` or Sprite pixels.

4. **Load pipeline**
   - Validate file → `URL.createObjectURL` → `await Assets.load(url)` → read texture frame size → `addImageLayer` → sync creates `Sprite({ texture, anchor: 0.5 })` from `transform`.
   - `try/catch` around load; `finally` revoke the objectURL if load fails before the layer is stored. Stored layers keep `objectUrl` until replaced or page unmount.
   - Alternative: `Texture.from(Image)`. Rejected by the v8 assets skill.

5. **Centering uses `app.screen`, identity viewport**
   - `centerImageTransform(naturalWidth, naturalHeight, screen.width, screen.height)`.
   - Viewport stays `{ x: 0, y: 0, scale: 1 }`. feat-007 will move `viewport`, not layer `transform`.

6. **Open UX**
   - Hidden `<input type="file" accept="image/jpeg,image/png,image/webp">`（单选；拖入多文件时只采用最后一张合法图）。
   - Toolbar Open enabled; undo/redo/fit/export stay disabled.
   - Empty host click opens the picker; after any layer exists, host click does not open (leave room for select).
   - `dragover` `preventDefault`; `drop` reads `dataTransfer.files`.

7. **Scene graph labels**
   - `app.stage` → viewport → world → background | content (`sortableChildren`) | overlay.
   - Sync: by `layer.id`; add/update Sprite; skip unknown kinds; do not rebuild the whole tree.

## Risks / Trade-offs

- [Forgot `revokeObjectURL`] → fail path revokes in `finally`; replace revokes the previous main image URL; unmount revokes remaining URLs
- [Drop hits canvas, host never sees it] → listen on the host with `preventDefault`; canvas is a child of host
- [Empty-host click vs later select] → picker only when `layers.length === 0`
- [jsdom cannot load textures] → no Sprite unit spec; CanvasHost import tests mock the store action
- [Half-built scene if init races import] → disable import until `app` is non-null; queue is unnecessary if Open is no-op until ready

## Migration Plan

1. Red/green model + store specs
2. `usePixiApp` return value; scene graph; sync
3. `loadLocalImage` + toolbar/host wiring; hide hint when `layers.length > 0`
4. `pnpm test:run` and `./init.sh`
5. Manual import / error / hint / leave-return

Rollback: stop calling scene/import from CanvasHost/Toolbar; keep feat-005 canvas.

## Open Questions

None. MIME set, identity viewport, and “no command stack yet” follow the scheme and feat-007 / feat-014 split.

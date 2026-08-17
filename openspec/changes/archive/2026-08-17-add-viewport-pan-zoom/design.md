## Context

See `proposal.md` for motivation. Viewport and world groups already exist but stay at identity. Pinia holds layers and view size; scene syncs Sprites one-way. Coding standards: tools emit store updates, scene applies viewport to the Container, UI/store MUST NOT `import 'pixi.js'` or hold DisplayObject. `resizeTo: host` and `autoDensity` already exist (feat-005). Command stack is feat-014.

## Goals / Non-Goals

**Goals:**

- Store viewport `{ x, y, scale }` in Pinia and sync it onto the existing viewport Container
- Pan via pan tool, Space, or middle mouse; wheel zooms about the pointer
- Fit computes scale/position from the main image world bounds and host size
- After a successful import, auto-fit the main image into the host (same Fit as the toolbar)
- When the window / host size changes, resize the renderer to the host and re-fit the main image

**Non-Goals:**

- Command objects (feat-014): store actions are enough
- Object selection / transform handles (feat-008): left-drag without pan modifiers is not a layer move
- Ctrl+0 (feat-018)

## Decisions

1. **Layers and public contracts**
   - `model/viewportMath.ts` (or `shared/` if kept free of editor types): `clampViewportScale`, `panViewport`, `zoomViewportAt`, `fitViewportToBounds`, `viewCenterToWorld`, `imageLayerWorldBounds`
   - `store/editor.ts`: `viewport`, `activeTool`; actions `panBy`, `zoomAt`, `fitView`, `setActiveTool`; no DisplayObject
   - `tools/`: pan / wheel / Space listeners; they call store actions only
   - `scene/`: apply `viewport` onto the viewport Container (position + uniform scale); do not write back
   - UI: enable Fit and the pan tool; no `import 'pixi.js'`
   - Alternative: mutate `viewport.position` in a Pixi pointer handler and skip Pinia. Rejected — second source of truth.

2. **Pan does not steal feat-008 left-drag**
   - Left-drag pans only while the pan tool is active, Space is held, or the middle button is down.
   - Alternative: any empty-canvas left-drag pans. Rejected — feat-008 needs left-drag for select/move.
   - Empty-host click still opens the picker only when there is no image **and** the pan tool is not active and the click is not a pan gesture.

3. **TDD surface is pure viewport math + store, not Pixi**
   - Failing specs first: `clampViewportScale` rejects non-positive / non-finite and clamps to `[0.1, 8]`; `zoomViewportAt` keeps the world point under the pointer; `fitViewportToBounds` puts the rect inside the view with padding; `panBy` adds deltas to `x/y` only; store `fitView` with no layers resets identity.
   - Manual: pan tool / Space / middle-button; wheel about pointer without page scroll; Fit frames the image; import auto-fits the host; dragging the window resizes the canvas and re-fits; leave/return still one canvas.
   - Do not unit-test WebGL sharpness (`autoDensity` already on).

4. **Zoom-at-pointer formula (screen space, viewport under stage)**
   - `world = ((pointerX - x) / scale, (pointerY - y) / scale)`
   - `scale' = clamp(scale * factor)`
   - `x' = pointerX - world.x * scale'` (same for `y`)
   - Wheel `factor` from `deltaY` (positive = zoom out). `preventDefault` on the host so the page does not scroll.
   - Alternative: scale world instead of viewport. Rejected by the scheme (viewport owns pan/zoom).

5. **Fit**
   - World bounds from the main image: center at `transform.x/y`, size `naturalWidth * scaleX` × `naturalHeight * scaleY` (anchor 0.5).
   - `scale = min(viewW / bounds.w, viewH / bounds.h) * 0.9`, then clamp; position so bounds center maps to view center.
   - No image → `{ x: 0, y: 0, scale: 1 }`.
   - Alternative: reset only scale and keep pan. Rejected — Fit means “see the whole picture”.

6. **Import auto-fits the host**
   - Load path still places the layer at `viewCenterToWorld` so the document origin is the current view center.
   - `addImageLayer` then calls `fitView()` so the whole picture is visible in the host (same math as toolbar Fit).
   - Alternative: keep the previous pan/zoom after import. Rejected — opening a new picture should show the entire image in the host.

7. **Space is a temporary pan modifier, not a persisted tool**
   - Keydown Space (when focus is not in an input) sets a `spacePan` flag; keyup clears it. `preventDefault` to avoid page scroll.
   - Middle-button pan does not change `activeTool`.
   - Default `activeTool` remains unset / none so empty-click import still works until the user picks 平移.

8. **Host resize uses ResizeObserver, not only window `resize`**
   - Pixi `ResizePlugin` listens to `window` `resize` and may read `clientWidth` before layout finishes.
   - Scene observes the host; on size change it calls `app.resize()` then `setViewSize` from the host client size.
   - `setViewSize` re-fits when the recorded size actually changes and a main image exists. Same size is a no-op so ResizeObserver noise does not undo pan/zoom.
   - Alternative: keep the previous pan/zoom after a real host resize. Rejected for this change — the canvas and main image should follow the window.

## Risks / Trade-offs

- [Wheel scrolls the page] → `wheel` `preventDefault` on the host; listen on host, not `window`
- [Pan vs empty-click import] → picker only when no image, pan tool off, and the pointer did not drag
- [Zoom writes into layer transform] → only `store.viewport` changes; sync applies to the viewport Container
- [Space repeats while held] → ignore `repeat` on keydown
- [jsdom has no wheel/WebGL] → math + store specs only; gestures are manual
- [Window resize leaves a stale canvas] → host ResizeObserver + `app.resize()` after layout; do not trust `app.screen` from before resize

## Migration Plan

1. Red/green viewport math + store specs
2. Sync viewport Container from store; wire pan / wheel / Space
3. Enable Fit and the pan tool; import places at view-center-in-world then `fitView`
4. `pnpm test:run` and `./init.sh`
5. Manual pan / zoom / Fit / import auto-fit / window resize

Rollback: stop applying viewport from store; Fit/pan UI disabled; import again uses raw view center.

## Open Questions

None. Pan modifiers, zoom clamp, and Fit padding follow the scheme’s “viewport not layer transform” split and leave left-drag free for feat-008.

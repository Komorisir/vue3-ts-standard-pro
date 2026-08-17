## 1. Viewport math and store (TDD)

- [x] 1.1 Write a failing spec that `clampViewportScale` rejects non-finite or non-positive values and clamps to `[0.1, 8]`
- [x] 1.2 Write a failing spec that `zoomViewportAt` keeps the same world point under the pointer after the scale change
- [x] 1.3 Write a failing spec that `fitViewportToBounds` places the bounds inside the view with padding and that `panViewport` changes only x/y
- [x] 1.4 Write a failing spec that `viewCenterToWorld` at identity equals `(viewW/2, viewH/2)` and that `imageLayerWorldBounds` uses anchor-0.5 size
- [x] 1.5 Implement the math helpers until those specs pass
- [x] 1.6 Write a failing Pinia spec that `panBy` / `zoomAt` update `viewport` without changing layer transforms, and that `fitView` with no layers resets identity
- [x] 1.7 Implement store viewport / tool actions until that spec passes
- [x] 1.8 Write a failing Pinia spec that `addImageLayer` with a known view size fits the main image into the host without changing the layer transform
- [x] 1.9 Call `fitView` from `addImageLayer` until that spec passes
- [x] 1.10 Write a failing Pinia spec that `setViewSize` with a main image refits into the new size, and that the same size does not undo pan/zoom
- [x] 1.11 Implement `setViewSize` refit until that spec passes

## 2. Scene sync and gestures

- [x] 2.1 Apply store `viewport` to the existing viewport Container (uniform scale + position); do not write DisplayObject into the store
- [x] 2.2 Implement pan gestures: pan tool left-drag, Space+left-drag, middle-button drag; `preventDefault` Space so the page does not scroll
- [x] 2.3 Implement host `wheel` zoom-at-pointer with `preventDefault`; do not unit-test WebGL frames
- [x] 2.4 Pass `viewCenterToWorld` into import centering so a new main image is placed at the current view center in world space, then fitted by `addImageLayer`
- [x] 2.5 On host ResizeObserver, call `app.resize()` then `setViewSize` from the host client size; do not unit-test WebGL frames

## 3. UI wiring

- [x] 3.1 Enable toolbar Fit; keep undo / redo / export disabled
- [x] 3.2 Enable the pan tool on the tool rail; other tools stay disabled; empty-host click does not open the picker while the pan tool is active
- [x] 3.3 Add Chinese file headers and JSDoc on public exports

## 4. Verify and record

- [x] 4.1 Run `pnpm test:run`, `pnpm run lint`, and `pnpm run build`
- [x] 4.2 Run `./init.sh` (or the same checks on Windows) and `openspec validate add-viewport-pan-zoom --strict`
- [x] 4.3 Update `feature_list.json` feat-007 evidence and `progress.md`
- [ ] 4.4 Record the manual check: pan tool / Space / middle-button move the view; wheel zooms about the pointer without page scroll; Fit frames the image; import auto-fits the host; layer document transform unchanged; leave and return still one canvas

## 1. Model and store (TDD)

- [x] 1.1 Write a failing spec that accepted image files are JPEG/PNG/WebP (MIME or extension) and empty or other types are rejected
- [x] 1.2 Write a failing spec that `createImageLayer` stores objectUrl, natural size, and identity-scale transform fields
- [x] 1.3 Write a failing spec that `centerImageTransform` places x/y at the view center with scale 1 and rotation 0
- [x] 1.4 Implement the model helpers until those specs pass
- [x] 1.5 Write a failing Pinia spec that `addImageLayer` replaces the previous main image (only one remains) and does not hold DisplayObject
- [x] 1.6 Implement `useEditorStore` until that spec passes

## 2. Scene graph and load path

- [x] 2.1 Change `usePixiApp` to return a `ShallowRef` of the initialized Application (still no Pinia)
- [x] 2.2 Create viewport / world / background / content / overlay under `app.stage` when the app is ready; viewport stays identity
- [x] 2.3 Implement `syncImageLayers` so content Sprites follow document layers by id (`Assets.load` + `Sprite`, anchor 0.5)
- [x] 2.4 Implement `loadLocalImage`: validate → objectURL → `Assets.load` → add layer; fail with a visible error and revoke in `finally` when the layer is not stored

## 3. UI wiring

- [x] 3.1 Enable toolbar Open with a hidden file input; keep undo / redo / fit / export disabled
- [x] 3.2 Wire CanvasHost drop and empty-host click to the same import path; do not `import 'pixi.js'` from UI
- [x] 3.3 Hide the empty-document hint when `layers.length > 0`; add Chinese file headers and JSDoc on public exports

## 4. Verify and record

- [x] 4.1 Run `pnpm test:run`, `pnpm run lint`, and `pnpm run build`
- [x] 4.2 Run `./init.sh` (or the same checks on Windows) and `openspec validate add-scene-import --strict`
- [x] 4.3 Update `feature_list.json` feat-006 evidence and `progress.md`
- [x] 4.4 Record the manual check: Open / drop / empty click show a centered image; second import replaces the main image; bad file errors; hint hides; leave and return still one canvas

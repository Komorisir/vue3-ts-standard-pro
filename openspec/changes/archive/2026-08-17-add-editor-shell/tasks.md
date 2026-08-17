## 1. Host contract (TDD)

- [x] 1.1 Write a failing spec that the exported host id is `pixi-host` and the empty-state copy mentions drop or open
- [x] 1.2 Implement `canvasHostContract` until that spec passes
- [x] 1.3 Write a failing `CanvasHost` mount spec that the host element uses the exported id and shows the empty-state copy
- [x] 1.4 Implement `CanvasHost` (no File handlers, no `pixi.js`) until the mount spec passes

## 2. Four-region chrome

- [x] 2.1 Add `EditorToolbar`, `EditorToolRail`, and `EditorSidePanel` as disabled or text-only placeholders
- [x] 2.2 Add `EditorLayout` that places the four regions and keeps the host flexible with a non-zero min size
- [x] 2.3 Assemble the shell in `EditorPage` only; add Chinese file headers and JSDoc on public exports
- [x] 2.4 Confirm no shell file imports `pixi.js` or an editor Pinia store

## 3. Verify and record

- [x] 3.1 Run `pnpm test:run`, `pnpm run lint`, and `pnpm run build`
- [x] 3.2 Run `./init.sh` (or the same checks on Windows) and `openspec validate add-editor-shell --strict`
- [x] 3.3 Update `feature_list.json` feat-004 evidence and `progress.md`
- [x] 3.4 Record the manual check: four regions visible; host has area; resizing the window keeps the host in the center

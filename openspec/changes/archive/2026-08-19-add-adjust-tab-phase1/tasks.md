## 1. Document fields and adjust math (TDD)

- [x] 1.1 Write a failing spec for `listCropRatios()` returning 原比例、1:1、4:3、3:4、16:9、9:16、3:2、2:3
- [x] 1.2 Write a failing spec for `clampCropRect` that keeps the rect inside the natural image, preserves the chosen ratio, and rejects non-positive size
- [x] 1.3 Write a failing spec for natural-pixel crop ↔ Sprite-local mask rect (anchor 0.5)
- [x] 1.4 Write a failing spec for `normalizeDegrees` covering 450 → 90, negatives, and 360 → 0
- [x] 1.5 Write a failing spec for px / in / cm round-trip at DPI 96 so switching units does not change pixels
- [x] 1.6 Write a failing spec for locked-ratio width/height updates and unlocked independent updates; reject 0, negative, non-finite, and edge > 8192
- [x] 1.7 Implement `CropRect` / `flipX` / `flipY` on `ImageLayer` and the math modules until those specs pass
- [x] 1.8 Confirm `pnpm test:run` is green for the new model specs

## 2. Minimal command stack (TDD)

- [x] 2.1 Write a failing spec that a linear stack can push, undo, and redo two sequential commands
- [x] 2.2 Write a failing spec that undo/redo of rotate then flip restores rotation without losing the flip contract
- [x] 2.3 Implement `EditorCommand` plus stack helpers in `src/editor/history/` until those specs pass
- [x] 2.4 Confirm `pnpm test:run` is green for the history specs

## 3. Store actions

- [x] 3.1 Add store actions to update main-image crop, rotation, flip, and display size; no-op when there is no main image
- [x] 3.2 Wire 90° / flip to immediate Command push; custom angle and resize snapshot on focus and push one Command on blur / Enter / collapse when dirty
- [x] 3.3 Crop session: snapshot on expand, write draft crop for preview, commit Command on apply/collapse if dirty, restore snapshot on cancel
- [x] 3.4 Update `imageLayerWorldBounds` to use the visible (cropped) size; keep scale positive and flips out of scale
- [x] 3.5 Extend existing store specs; UI still must not import `pixi.js`

## 4. Scene sync

- [x] 4.1 Sync Sprite position, positive scale, rotation, and flip signs from the document
- [x] 4.2 Apply a rectangular Graphics mask from `ImageLayer.crop`; skip mask when crop is absent
- [x] 4.3 Draw crop box and outside dimming on overlay only while the crop session is active; overlay stays out of export
- [x] 4.4 Do not rebuild the whole scene tree; do not write DisplayObject state back to the store

## 5. Adjust accordion UI

- [x] 5.1 Replace Adjust placeholders with a panel that keeps pan and lists 裁剪、旋转/矫正、改尺寸/比例, all collapsed by default
- [x] 5.2 Enforce exclusive expand/collapse; expanding another module commits the current session first
- [x] 5.3 Remove 选择 / 文字 / 形状 from this panel; expanding modules must not remount `#pixi-host`
- [x] 5.4 Add Chinese file headers and JSDoc; split components if a file exceeds ~200 lines of real logic

## 6. Crop, rotate, and resize panels

- [x] 6.1 Crop panel: ratio chips, apply / cancel; crop tool gestures drag and resize the box with ratio lock and edge clamp; pan / space still pans
- [x] 6.2 Rotate panel: left 90, right 90, horizontal flip, vertical flip, custom angle with validation
- [x] 6.3 Resize panel: width, height, lock-ratio (default on), unit px / in / cm; preview valid input; commit once on blur / Enter / collapse
- [x] 6.4 Disable or no-op all three modules when no main image exists

## 7. Toolbar undo / redo

- [x] 7.1 Enable top-bar Undo / Redo from `canUndo` / `canRedo`; History and Save stay placeholders
- [x] 7.2 Confirm one undo step reverses one committed adjust command (including a committed crop)

## 8. Verify and record

- [x] 8.1 Run `pnpm test:run`, `pnpm run lint`, and `pnpm run build`
- [x] 8.2 Run `./init.sh` and `npx -y @fission-ai/openspec@latest validate add-adjust-tab-phase1 --strict`
- [x] 8.3 Mark feat-010 and feat-032 done in `feature_list.json` with this change as evidence; keep feat-008 not-started
- [x] 8.4 Update `progress.md` and note that panel rotate shipped here while canvas transform did not
- [ ] 8.5 Record the manual checklist from design.md（手风琴、裁剪框、旋转翻转、改尺寸、撤销、无变换手柄、一块 canvas）

## 9. Crop overlay and rotate fit (PRD v1.1)

- [x] 9.1 Write a failing spec for `resizeCropRectFromHandle` edge midpoints (n/s/e/w) that keep the opposite edge fixed and preserve ratio
- [x] 9.2 Write a failing spec for `imageLayerWorldBounds` rotation AABB and `cropOverlayLayout` mapping crop onto the unrotated image quad plus rotation
- [x] 9.3 Write a failing store spec that rotate / flip / crop commit refit the viewport, and that `beginCropSession` after rotate drafts against natural size
- [x] 9.4 Implement the math until those specs pass; clip the dim mask to the canvas host; add edge handles and a drag-only rule-of-thirds grid
- [x] 9.5 Extract crop overlay out of `CanvasHost.vue` so host stays a thin assembler
- [x] 9.6 Confirm `pnpm test:run` and `pnpm run lint` for the overlay / fit changes

## 10. Crop overlay follow-up (PRD v1.2)

- [x] 10.1 Edge midpoints change only one dimension; handles are rectangles
- [x] 10.2 Re-entering crop after apply covers the current visible (cropped) image
- [x] 10.3 Confirm `pnpm test:run` and `pnpm run lint`

## 11. Independent modules and visible-image center (PRD v1.3)

- [x] 11.1 Write failing specs that crop rebases transform to the visible center and rotate after crop keeps that center
- [x] 11.2 Implement rebase, sprite anchor on visible center, overlay around transform, fitView when expanding crop/rotate
- [x] 11.3 Confirm `pnpm test:run` and `pnpm run lint`

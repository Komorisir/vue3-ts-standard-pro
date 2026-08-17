## 1. Dependency

- [x] 1.1 Add PixiJS v8 with `pnpm add pixi.js` only; do not run `create-pixi`

## 2. Init/destroy options (TDD)

- [x] 2.1 Write a failing spec that `createPixiAppInitOptions(host)` sets `resizeTo` to that host, `preference` to `webgl`, `autoDensity` true, and a dark `background`
- [x] 2.2 Extend that spec so destroy option bags include `removeView`, `releaseGlobalResources`, and stage `children` / `texture` / `textureSource`
- [x] 2.3 Implement `pixiAppOptions` until those specs pass (no `Application.init` in tests)

## 3. Application lifecycle

- [x] 3.1 Implement `usePixiApp`: `new Application()` then `await init` with the options helper; append `app.canvas` only after init and only if still mounted
- [x] 3.2 On unmount (including unmount during init), `destroy` with the official option bags inside try/finally; missing host logs and does not throw
- [x] 3.3 Call `usePixiApp` from `CanvasHost`; overlay the empty-state hint above the canvas with `pointer-events: none`
- [x] 3.4 Add Chinese file headers and JSDoc on public exports; confirm only `src/editor/core/` imports `pixi.js`, and that chrome panels and Pinia stay out of this change

## 4. Verify and record

- [x] 4.1 Run `pnpm test:run`, `pnpm run lint`, and `pnpm run build`
- [x] 4.2 Run `./init.sh` (or the same checks on Windows) and `openspec validate add-pixi-app --strict`
- [x] 4.3 Update `feature_list.json` feat-005 evidence and `progress.md`
- [x] 4.4 Record the manual check: one canvas on `/editor`; dark empty stage; hint still visible; window resize matches host; leave and return still one canvas

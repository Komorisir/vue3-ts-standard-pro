## 1. Workspace tab catalog (TDD)

- [x] 1.1 Write a failing spec that `listWorkspaceTabs()` returns exactly 调整、滤镜调色、人像、抠图、画笔、素材 in that order
- [x] 1.2 Write a failing spec that `DEFAULT_WORKSPACE_TAB` is 调整 and `isWorkspaceImplemented` is true only for 调整
- [x] 1.3 Implement `src/editor/model/workspaceTabs.ts` until those specs pass
- [x] 1.4 Confirm `pnpm test:run` covers the new spec and is green for this file

## 2. Left workspace UI

- [x] 2.1 Add `EditorWorkspaceTabs` that renders the catalog and emits the selected id; default selection is 调整
- [x] 2.2 Add a shared unimplemented placeholder panel that shows the workspace title and「即将推出」
- [x] 2.3 Add `EditorWorkspaceNav` that holds the selected id, shows `EditorToolRail` on 调整, and the placeholder on the other five tabs
- [x] 2.4 Wire `EditorPage` to mount `EditorWorkspaceNav` in the tools slot; do not put `CanvasHost` inside any tab `v-if`
- [x] 2.5 Widen `EditorLayout` left sider to fit the tab column plus panel (~64px + ~220px); keep canvas `flex: 1; min-width: 0`
- [x] 2.6 Add Chinese file headers and JSDoc on public exports; UI must not `import 'pixi.js'`

## 3. Verify and record

- [x] 3.1 Run `pnpm test:run`, `pnpm run lint`, and `pnpm run build`
- [x] 3.2 Run `./init.sh` and `npx -y @fission-ai/openspec@latest validate add-left-workspace-tabs --strict`
- [x] 3.3 Add `feat-031` to `feature_list.json` (美图式左侧工作区导航) and record evidence in `progress.md`
- [x] 3.4 Record the manual check: six tabs visible; default 调整 with pan still working; other tabs show placeholder only; switching tabs keeps one canvas and a non-zero host; Open / Fit / right panel unchanged

## 4. Chrome tokens and toolbar catalog (TDD)

- [x] 4.1 Write a failing spec that `listToolbarRegions()` returns 文档、历史、交付 in that order
- [x] 4.2 Write a failing spec that host background is `#ebebeb` and accent is a single pink-red token shared by selected tab and Save
- [x] 4.3 Implement `src/editor/model/chromeTheme.ts` until those specs pass
- [x] 4.4 Point `createPixiAppInitOptions().background` at the host background token and update its spec
- [x] 4.5 Confirm `pnpm test:run` covers the new specs and is green for these files

## 5. Toolbar thirds and light shell

- [x] 5.1 Restructure `EditorToolbar` into left (brand + Open), center (History + Undo + Redo), right (Fit + Save); keep Open / Fit wired; leave History / Undo / Redo / Save disabled
- [x] 5.2 Apply light chrome tokens on `EditorLayout`, tab column, workspace panel, side panel, and canvas host; selected tab and Save share the accent
- [x] 5.3 Do not remount `CanvasHost` or change Pixi init / destroy lifecycle beyond the background token
- [x] 5.4 Keep Chinese file headers and JSDoc; UI must not `import 'pixi.js'`; no VIP / avatar chrome

## 6. Re-verify and record feat-036

- [x] 6.1 Run `pnpm test:run`, `pnpm run lint`, and `pnpm run build`
- [x] 6.2 Run `./init.sh` and `npx -y @fission-ai/openspec@latest validate add-left-workspace-tabs --strict`
- [x] 6.3 Update `feat-036` in `feature_list.json` and record evidence in `progress.md`
- [x] 6.4 Record the manual check: three toolbar regions; Open / Fit still work; History / Undo / Redo / Save disabled; light shell; selected tab matches Save accent; host `#ebebeb`; switching tabs still one canvas

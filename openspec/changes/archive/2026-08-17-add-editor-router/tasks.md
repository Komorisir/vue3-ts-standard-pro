## 1. Route table (TDD)

- [x] 1.1 Write a failing spec that the exported route records send `/` and unknown paths to `/editor`, and that `/editor` is a named page route
- [x] 1.2 Implement the exported route records until `pnpm test:run` passes those cases

## 2. Wire the app

- [x] 2.1 Create a history-mode router from the route records and register it in the app before mount
- [x] 2.2 Add a placeholder editor view with no Pixi or layout chrome
- [x] 2.3 Make the root app render only the router outlet
- [x] 2.4 Remove the Vite / HelloWorld demo from the entry path

## 3. Verify and record

- [x] 3.1 Run `pnpm test:run`, `pnpm run lint`, and `pnpm run build`
- [x] 3.2 Run `./init.sh` (or the same checks on Windows) and `openspec validate add-editor-router --strict`
- [x] 3.3 Update `feature_list.json` feat-003 evidence and `progress.md`
- [x] 3.4 Record the manual check: refresh `/` and `/editor` both show the editor placeholder

## 1. OpenSpec project context

- [x] 1.1 Confirm `openspec/config.yaml` context and quoted rules parse without CLI warnings
- [x] 1.2 Validate this change with `openspec validate setup-sdd-tdd-harness --strict`

## 2. TDD pipeline

- [x] 2.1 Add `vitest`, `@vue/test-utils`, and `jsdom` as devDependencies
- [x] 2.2 Add `vitest.config.ts`, `tsconfig.vitest.json`, exclude specs from app tsconfig, and `test` / `test:run` scripts
- [x] 2.3 Write a failing `clamp` spec covering in-range, edges, and min > max
- [x] 2.4 Implement `clamp` until `pnpm test:run` passes

## 3. Harness injection

- [x] 3.1 Add `docs/openspec.md` and `docs/tdd.md`
- [x] 3.2 Add `.cursor/rules/openspec.mdc` and `.cursor/rules/tdd.mdc`
- [x] 3.3 Update `AGENTS.md` startup, working rules, definition of done, and verification commands
- [x] 3.4 Update `init.sh` to run `pnpm test:run` and `openspec validate --all`

## 4. State and verification

- [x] 4.1 Add feat-019 to `feature_list.json` and narrow feat-017 to product tests only
- [x] 4.2 Update `progress.md` and `session-handoff.md`
- [x] 4.3 Run `./init.sh` and record evidence
- [x] 4.4 Archive this change after verification so `sdd-workflow` and `tdd-pipeline` become main specs

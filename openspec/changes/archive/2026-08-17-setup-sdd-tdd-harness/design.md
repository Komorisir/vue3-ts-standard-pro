## Context

See `proposal.md` for motivation. The repo already has AGENTS.md, feature_list.json, init.sh, and product docs, but no OpenSpec root and no test runner. Vue 3 + Vite (rolldown-vite) is already in place; `vue-router` is a dependency but unused. This change only adds process and verification, not editor UI.

## Goals / Non-Goals

**Goals:**

- Make OpenSpec the planning home; keep `feature_list.json` as the execution tracker
- Add Vitest in a separate config so eslint/stylelint Vite plugins do not run inside tests
- Inject SDD + TDD into the existing harness without rewriting it

**Non-Goals:**

- Custom OpenSpec schema (keep `spec-driven`)
- Component-level Vue test coverage for HelloWorld
- Installing `pixi.js` or registering the router

## Decisions

1. **OpenSpec stays brownfield-first**
   - Why: Official guidance says do not bulk-import the PRD. Main specs grow from archived changes.
   - Alternative: Convert P0–P6 into `openspec/specs/` now. Rejected because those specs would describe unimplemented behavior and go stale.

2. **Separate `vitest.config.ts`**
   - Why: `vite.config.ts` loads eslint/stylelint/html plugins that are irrelevant and brittle in unit tests.
   - Alternative: Merge `test` into `vite.config.ts`. Rejected for plugin noise.

3. **jsdom + explicit Vitest imports**
   - Why: Vue SFC tests later need a DOM; explicit `import { describe, it, expect } from 'vitest'` avoids eslint global setup.
   - Alternative: happy-dom + `globals: true`. Faster, but more eslint/tsconfig wiring for little gain at this stage.

4. **`clamp` as the TDD bootstrap, not a dummy `expect(true)`**
   - Why: Viewport zoom will need clamping; the helper is real product math and proves red-green.
   - Alternative: Empty suite with `passWithNoTests`. Rejected because it does not prove the pipeline.

5. **OpenSpec CLI via `npx @fission-ai/openspec@latest` in `init.sh`**
   - Why: Global CLI on this machine is 1.5.0; init used 1.8.0. Pinning via npx avoids a stale global.
   - Alternative: Add `@fission-ai/openspec` as a project devDependency. Deferred to keep the app lockfile focused; revisit if CI needs a pinned CLI.

6. **Harness mapping**
   - OpenSpec change = one feature_list item
   - `docs/pixijs-editor-*.md` remain source material
   - Cursor rules `openspec.mdc` / `tdd.mdc` route agents; AGENTS.md stays short

## Risks / Trade-offs

- [Stale global `openspec` 1.5.0 on PATH] → Scripts and docs call `npx -y @fission-ai/openspec@latest`
- [Vitest vs rolldown-vite mismatch] → Isolated vitest config; if install fails, pin a Vitest 3.x that supports Vite 7
- [Agents skip OpenSpec and jump to code] → AGENTS.md startup + Definition of Done require an active change
- [Over-testing canvas] → Spec explicitly forbids WebGL unit tests

## Migration Plan

1. Write OpenSpec artifacts for this change
2. Install test deps and land `clamp` via TDD
3. Update harness files and verification
4. Run `./init.sh` and `openspec validate --all`
5. Archive this change so `sdd-workflow` and `tdd-pipeline` become main specs
6. Next session: `/opsx-propose` for feat-003 (editor router)

Rollback: revert the commit that adds OpenSpec, Vitest, and harness edits. No runtime data to migrate.

## Open Questions

None. feat-003 remains a separate change.

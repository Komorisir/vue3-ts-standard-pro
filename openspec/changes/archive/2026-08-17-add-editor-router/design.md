## Context

See `proposal.md` for motivation. `vue-router` is already a dependency. `main.ts` only calls `setupStore` then `mount`. `App.vue` still renders the Vite logos and `HelloWorld`. No `src/router` exists. This change introduces the first application-level routing pattern; later features (layout, Pixi) hang off `/editor`.

## Goals / Non-Goals

**Goals:**

- Register a history-mode router before mount
- Export a testable route table so redirects can be asserted without booting WebGL
- Leave `/editor` as a blank-capable placeholder view

**Non-Goals:**

- Nested editor child routes (add when feat-004 needs them)
- Auth guards or scroll behavior customization
- Keeping HelloWorld as a `/demo` route

## Decisions

1. **HTML5 history mode (`createWebHistory`)**
   - Why: Vite SPA default; URLs stay `/editor` without hash.
   - Alternative: `createWebHashHistory`. Rejected unless we later ship as a file:// or CEF path that cannot rewrite.

2. **Export route records separately from `createRouter`**
   - Why: TDD can assert path, redirect, and name without mounting the app.
   - Alternative: Only export the router instance. Harder to unit-test; would push verification to manual refresh only.

3. **Catch-all redirects to `/editor`**
   - Why: This product is a single editor surface in P0; unknown URLs should not 404 a blank Vue root.
   - Alternative: A dedicated 404 view. Deferred until there is more than one real page.

4. **Placeholder `EditorPage` only; delete unused HelloWorld**
   - Why: feat-004 replaces the page body with EditorLayout. Keeping the demo component invites accidental imports.
   - Alternative: Leave HelloWorld on disk unused. Rejected as dead code.

5. **No Pinia editor store yet**
   - Why: Routing does not change document state. Pinia remains the future document source of truth; this change must not invent a second one.

## Risks / Trade-offs

- [History mode 404 on static hosts] → Dev server already falls back to `index.html`; production host must do the same. Not a P0 blocker.
- [Manual refresh not covered by Vitest] → Record a two-step checklist: open `/` and `/editor` after `pnpm dev`.
- [Placeholder looks unfinished] → Acceptable; feat-004 owns chrome.

## Migration Plan

1. Add route table + failing spec, then implement records
2. Wire router in `main.ts`, slim `App.vue`, add placeholder page
3. Remove HelloWorld
4. Run `pnpm test:run` and `./init.sh`
5. Manually confirm `/` and `/editor` in the browser

Rollback: revert the change; the previous demo page returns.

## Open Questions

None. Unknown-path handling is decided as redirect-to-editor.

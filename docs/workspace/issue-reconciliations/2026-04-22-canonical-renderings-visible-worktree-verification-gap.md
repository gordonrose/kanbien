# Canonical Renderings Visible-Worktree Verification Gap

## Summary

The `time-picker` and `simple-select` canonical-renderings slice was implemented
in an isolated worktree, but the active IDE workspace remained on a different
branch and did not contain the same changes. This created a false "done"
impression: the slice was browser-verifiable in `/tmp/kanbien-canonical-renderings-next`
but not verifiable in `/home/gordon/kanbien`, which was the workspace the user
was actually inspecting.

## Root Cause

- the implementation branch and the visible IDE branch diverged
- the completion claim relied on isolated-worktree verification only
- the change loop did not treat "user can verify this in the workspace they are
  actually looking at" as part of the completion gate
- the visual harness was pinned to the preview origin and did not require
  same-origin proof against the live user-facing server

Technically, the visible workspace lacked:

- generated render-route resolution for `simple-select` and `time-picker` in
  `src/frontend/designSystem/router.ts`
- generated-route hydration in the dedicated canonical controllers
- the `0033` and `0034` canonical seed migrations
- maintained docs updated to the generated route truth
- browser proof in the visible workspace branch

## Why The Loop Missed It

Classification:

- wrong-layer coverage
- missing workspace-verification gate
- cross-worktree seam blind spot

The existing verification answered "does the isolated branch behave?" but not
"is the user looking at the same branch and worktree that contains the fix?"
That let a real user-visible mismatch escape despite technically correct local
browser proof elsewhere.

The live failure mode was especially misleading because:

- the URL on `localhost:3000` matched the canonical render route
- breadcrumb logic in `app.mjs` rewrote the trail for that path
- but the raw HTML body remained the generic overview shell

Concrete browser evidence:

- `http://127.0.0.1:3000/design-system/canonical-renderings/time-picker/TPR-002`
  returned no `data-time-picker-surface` body marker and still exposed the
  `Design-System Route Families` overview heading
- the same path on the preview origin exposed
  `data-time-picker-surface="canonical"` and no overview fallback heading

## Reconciliation Changes Added

- created a dedicated visible-workspace branch from the explicit GitHub base:
  `codex/canonical-renderings-visible`
- added a bootstrap artifact for the visible workspace chat
- ported the `time-picker` and `simple-select` generated canonical-renderings
  slice into `/home/gordon/kanbien`
- added launcher-card click-through checks in the family Playwright suites so
  the proof covers launcher page to dedicated render surface, not only `href`
  strings
- added a reusable route-surface truth helper that asserts:
  - exact route
  - expected body surface marker
  - visible dedicated surface locator
  - absence of the known overview fallback heading
- updated Playwright config to support `PLAYWRIGHT_BASE_URL`, so the same
  governed visual suites can run against the actual live origin instead of only
  the preview server
- recorded this reconciliation note to make the process failure durable

## Coverage Lesson

An isolated-worktree implementation is only a candidate fix until the user can
verify the same surface in the workspace they are actually using. For governed
frontend slices, "done" must include:

- source present in the user-visible workspace or explicit handoff to the
  correct worktree
- launcher card click-through proof on the final route family
- honest reporting when verification happened in a different workspace than the
  one the user is inspecting

## Watch Items

- broader generated canonical shell/navigation parity still remains outside this
  narrow family slice
- future isolated-worktree work should explicitly state the verification
  workspace before any completion language is used

# 2026-04-22 Canonical Theme Scope Contract Gap

> Archived on 2026-05-27 during the workspace QA and issue-reconciliation
> cleanup. The prevention lesson is now promoted into canonical-render-page
> theme-scope checks, current template/reference-pack authority, and active
> visual/integration tests.

## Symptom

Dedicated canonical render pages could still theme page-owned chrome instead of
only theming the specimen render area.

## Root Cause

Several dedicated render controllers assigned `data-theme-scope` to the full
`.canonical-render-layout`, which includes canonical intro, metadata, and other
page-owned chrome. That made specimen-local dark theme spill beyond the review
surface.

## Why The Loop Missed It

Earlier fixes handled specific families or text symptoms, but the repo lacked a
shared audit that enforced where dedicated render controllers are allowed to put
theme scope.

## Prevention Added

- Moved dedicated render theme scope from `.canonical-render-layout` to the
  local preview frame or preview shell.
- Added `tests/integration/frontend/designSystemCanonicalThemeScopeAudit.test.ts`
  so future render controllers fail if they theme the whole render layout.

## Follow-Up Rule

For dedicated canonical render pages, `data-theme-scope` belongs on the local
preview frame or preview shell only. Page-owned review chrome must stay outside
that scope by default.

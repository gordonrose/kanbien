# Context Nav Parent Owner Feature Loop Gap

## Summary

The parent-owned context-nav projection change was initially implemented as a
backend/domain update with focused tests and some docs, but it was described too
strongly before the full feature-loop artifact set had been checked.

## Root Cause

The implementation path classified the work as a backend projection semantics
change and correctly avoided a design-system UI loop, but it did not first walk
`docs/standards/change-artifact-requirements.md` to determine the full required
artifact set. That skipped explicit traceability, QA release-gate evidence, and
frontend consumer harness verification during the first pass.

## Why The Loop Missed It

- The repo instructions contain the right completion gate, but they allow a
  coding agent to begin backend work after git preflight without an executable
  feature-loop checklist forcing artifact classification first.
- The existing PRD-derived test-case doc did not include parent-owned
  context-nav projection cases, so new tests could be added without immediately
  mapping them to active `TC-*` IDs.
- The root-admin visual harness mocked the context-nav projection with the old
  page-owned owner lookup, so frontend visibility could not be proven honestly
  until the harness was reconciled.
- `npm run git:preflight` guarded branch/worktree state, not feature-loop
  completeness.

## Reconciliation Changes

- Added traceable `TC-*` coverage for:
  - sibling child pages inheriting parent-owned context-nav rows
  - nested children using their immediate parent as owner
  - HTTP projection reads resolving parent owner rows
  - projection authz/security and denied-audit behavior
  - root-admin browser rendering of inherited parent-owned targets
- Updated the root-admin visual harness to derive the context-nav owner from
  `currentPage.parentPageId ?? currentPage.webAppPageId`.
- Refreshed source-independent docs and planning artifacts for the changed
  semantics.
- Added QA checklist, AI/standards addendum, and test-summary addendum for the
  feature-loop evidence.

## Verification

- `npx vitest run tests/unit/webAppPageSettings/service.test.ts tests/integration/webAppPageSettings/flow.test.ts tests/security/webAppPageSettings/security.test.ts tests/audit/webAppPageSettings/audit.test.ts`
  passed with 17 tests across 4 files.
- `npx vitest run tests/integration/webAppPageSettings/persistence.test.ts`
  executed and skipped locally with 2 skipped tests.
- `npx playwright test tests/visual/app/rootAdminShell/rootAdminWebAppHierarchy.spec.ts --grep "TC-WEB-PAGE-SET-INT-010"`
  passed with 1 browser test.
- `npm run typecheck` passed.
- `npm run test:traceability` exited nonzero for unrelated repo-wide gaps, but
  reports `WEB-PAGE-SET: 19/19 traceable` for this feature family.

## Coverage Lesson

For backend changes that are visible through an existing frontend consumer, the
feature loop must include at least one consumer-level harness or browser proof
when a frontend route already consumes the changed contract. A backend-only
classification is not enough when the behavior is operator-visible.

## Watch Items

- Consider an executable feature-loop start gate or checklist script that
  forces change-class classification and required artifact selection before the
  first material implementation edit.
- Consider strengthening `AGENTS.md` or the repo-local change skill language so
  backend capability changes cannot be summarized as complete until
  `docs/standards/change-artifact-requirements.md` has been explicitly
  consulted and the result recorded.

# Brochure Preview Stale Server

## Summary

The user opened `http://localhost:4325/design-system/patterns/brochure-page`
and saw the generic JSON `INTERNAL_ERROR` response instead of the brochure
pattern page.

## Root Cause

Port `4325` was occupied by an older Node preview server whose working
directory was `/tmp/kanbien-design-system-brochure-pattern (deleted)`. The
browser was therefore hitting a stale server from a deleted worktree instead
of the active `/home/gordon/kanbien` branch.

The current branch's design-system router can serve
`/design-system/patterns/brochure-page`; a targeted integration route check
returns `200` for that route, and the refreshed preview server on `4325`
returns `200 OK`.

## Why The Loop Missed It

The existing brochure visual spec proved the page under Playwright's managed
preview server, but there was no narrow route-level regression check for the
brochure pattern detail page. That left a gap between "the Playwright preview
can render it" and "the exact manually shared preview URL serves HTML instead
of the generic app error response."

## Reconciliation Changes

- Added an integration route assertion for
  `/design-system/patterns/brochure-page`.
- Extended the brochure visual spec so the existing drawer now proves the
  brochure-specific display controls are real runtime controls.
- Replaced the stale `4325` preview process with a fresh server from
  `/home/gordon/kanbien`.

## Coverage Lesson

New governed pattern detail routes should have at least one route-level
assertion that checks for their preview marker and rejects generic error
payloads, alongside the browser-level visual spec.

## Follow-Up Watch Items

- If another deleted-worktree preview process remains alive, stop it before
  sharing a localhost URL.
- Keep manually shared design-system preview URLs tied to the current branch
  or a named worktree in the handoff.

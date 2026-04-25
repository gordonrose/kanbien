# 2026-04-18 Frontend Human Review Guard Hook Gap

## Summary

Recent `Drawer Select` escapes exposed a repeatable frontend verification gap:
Playwright checks were running, but they were still too indirect to fail when a
human reviewer would immediately say the rendered surface looked broken.

## User-Visible Symptom

- automation passed while the browser still showed obviously broken rendering
- the misses were visible defects such as overlay escape, host-content overlap,
  and unreadable dark-state contrast
- each escaped issue required another user report before the suite learned the
  actual visual truth

## Root Cause

The visual suites had assertions for state, focus, route truth, and some local
geometry, but they did not yet have a shared practice for encoding a
human-visible failure mode directly after an escape.

That left the repo with working Playwright infrastructure but inconsistent
prevention discipline:

- some fixes added strong geometry or contrast assertions
- others still stopped at `toBeVisible()`, route presence, or state attributes
- there was no shared hook or skill rule turning "a person would call this
  broken" into a repeatable regression pattern

## Why The Existing Loop Missed It

The frontend loop emphasized rendered verification, but it did not explicitly
require a human-visible regression guard after each escaped visual issue.

So the suite could prove:

- the page loaded
- the right route or canonical state existed
- a panel was open or focused

without proving the actual reviewer complaint:

- this overlaps
- this escapes its frame
- this stacks in the wrong place
- this text is too weak to read

## Classification

- wrong-layer frontend proof
- missing shared visual-regression hook
- process gap between "rendered" and "human-visible"

## Reconciliation Changes

- added a shared helper at
  `tests/visual/designSystem/support/helpers/humanReviewGuards.ts`
- introduced `withHumanReviewGuard(...)` so visual suites can group the exact
  human-visible failure mode they are protecting
- added reusable guard helpers for containment, vertical stacking, and computed
  foreground-color assertions
- refactored `tests/visual/designSystem/canonicals/forms/drawerSelectCanonical.spec.ts` to use
  the shared hook for the escaped `Drawer Select` layout and contrast failures
- updated `.codex/skills/40-frontend/frontend-design-system-loop-maintainer/SKILL.md` to
  require at least one direct human-visible regression guard after escaped
  visual issues
- updated `.codex/skills/30-testing-and-reconciliation/issue-reconciliation-maintainer/SKILL.md` to require
  the same prevention step during reconciliation work

## Prevention Lesson

For frontend escapes, "rendered verification" is still too vague unless the
suite asserts the exact way a human would describe the breakage.

After a visual escape, the loop should add:

- the implementation fix
- the normal interaction/state proof
- one direct human-visible regression guard at the right layer

## Verification

- `npx playwright test tests/visual/designSystem/canonicals/forms/drawerSelectCanonical.spec.ts`

## Resolution Status

- candidate fix awaiting user confirmation

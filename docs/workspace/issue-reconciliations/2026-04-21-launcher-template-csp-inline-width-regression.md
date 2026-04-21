# 2026-04-21 Launcher Template CSP Inline Width Regression

## Summary

The `/design-system/templates/launcher` page appeared stuck at oversized
five-column launcher cards even after repeated width and grid adjustments. The
user-visible symptom was a launcher panel that left substantial unused
horizontal space when the browser was widened.

## Root Cause

The intended launcher lane override was applied as an inline `style` attribute
on `.canonical-launcher-layout`:

- `style="max-width: 1760px;"`

That override was not taking effect in the live page, so the browser kept
falling back to the shared stylesheet rule:

- `.canonical-launcher-layout { max-width: var(--canonical-launcher-layout-width, 88rem); }`

Because the launcher route runs under the repo's CSP posture, the inline width
override was not a reliable source of truth for the live browser behavior. The
result was a real rendered lane width of `1408px`, which kept the launcher grid
effectively boxed into the old five-column posture.

## Why The Loop Missed It

The issue escaped because the current coverage and workflow were pointed at the
wrong layer.

Classification:

- wrong-layer coverage
- missing regression scenario
- unrealistic harness assumption

Specific misses:

- the route integration test for `/design-system/templates/launcher` only
  proved route availability and source text presence; it did not exercise live
  rendered geometry
- there was no dedicated visual or geometry guard for launcher-template lane
  width or launcher-grid column count
- multiple iterations assumed that changing source HTML or CSS was equivalent
  to changing rendered browser truth
- the loop did not immediately verify computed styles in the browser, so the
  inline-style-versus-CSP mismatch stayed hidden longer than it should have

## Reconciliation Changes Added

Implementation:

- moved the launcher width cap into stylesheet-backed CSS via
  `.launcher-template-layout`
- switched the launcher template off the ignored inline `max-width` override
- adjusted wide-lane launcher breakpoints so the `8`-column ceiling is
  reachable in the live padded panel

Prevention:

- added `tests/visual/designSystem/templates/launcher.spec.ts`
- the new visual suite proves:
  - default desktop launcher baseline stays at `5` columns
  - wide desktop expansion reaches `8` columns
  - the launcher grid stays contained within the panel instead of overflowing

## Coverage Lesson

For governed frontend layout work, source assertions are not enough when the
reported bug is "this still looks wrong in the browser."

Future launcher-family changes should:

- verify computed browser geometry as soon as a CSS change appears to "do
  nothing"
- avoid relying on inline presentation overrides for governed design-system
  layout behavior
- add a direct visual or geometry guard whenever a layout contract is phrased
  in human terms like "five columns by default" or "expands to eight when room
  is available"

## Verification

- `npx vitest run tests/integration/designSystem/route.test.ts -t "launcher template detail page"`
- `npx playwright test tests/visual/designSystem/templates/launcher.spec.ts --config=playwright.config.ts`

## Follow-Up Watch Items

- if future launcher templates need different max-column contracts, prefer
  explicit template-owned classes and browser-verified geometry tests instead
  of per-page inline width overrides
- when a new launcher variant is introduced, consider a shared helper for
  asserting launcher-grid column counts and containment across related routes

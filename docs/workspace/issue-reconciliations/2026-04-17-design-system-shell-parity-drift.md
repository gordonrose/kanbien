# Design-System Shell Parity Drift

## Summary

The `CDR-001` context-nav-drawer canonical exposed a broader shell-parity
problem inside `/design-system`:

- the host canonical page chrome could still express one shell-scroll behavior
- the rendered canonical surface could express a different shell-scroll
  behavior

That split made one review route carry two versions of the same shared shell
contract, which undercuts the point of a governed design system.

## Root Cause

Two different parity seams were left too loose:

1. The host canonical routes depended on shared shell chrome behavior that was
   only partially covered on the dedicated canonical-route index pages, not on
   the actual component canonical renderer routes such as
   `/design-system/components/context-nav?...`.
2. The rendered `context-nav` canonical surface used a simplified internal
   scroll model where only the lower content lane scrolled, so the rendered
   `sub-nav` did not scroll away under the rendered sticky `top-nav` the same
   way the real host shell did.

The result was a mixed review experience:

- host shell `context-nav` attachment could drift from the signed-off shell
  behavior on the component renderer route
- rendered shell `sub-nav` and rail attachment no longer matched the live
  shell-scroll contract already approved elsewhere

## Why The Loop Missed It

Coverage existed for nearby truths, but at the wrong seams:

- `tests/visual/designSystem/contextNavScrollAttachment.spec.ts` covered the
  top-level `/design-system/canonicals/context-nav` route, not the actual
  component canonical renderer route carrying `CDR-*` states
- `tests/visual/designSystem/contextNavCanonicalFrame.spec.ts` covered
  rendered geometry and drawer states, but it did not yet prove that the
  rendered shell used the same scroll contract as the governed host shell

Classification:

- missing regression scenario on the component canonical route
- wrong-layer parity coverage between host shell and rendered shell
- stale canonical rendering assumption about internal scroll behavior

## Reconciliation Changes

- moved the rendered `sub-nav` into the scrollable canonical surface so the
  rendered shell can now scroll the row away beneath the rendered sticky
  `top-nav`
- updated the rendered rail attachment math to measure live rendered geometry
  instead of static inner offsets so the rail reanchors upward as the rendered
  `sub-nav` scrolls away
- restored the mobile bottom bar as a true bottom-attached overlay after the
  inner scroll change so `CDR-003` lane attachment remains honest
- added browser-backed coverage for:
  - host shell rail attachment on the actual component canonical route
  - rendered shell internal scroll parity with disappearing `sub-nav`
  - preserved drawer and mobile attachment states after the parity fix

## Coverage Lesson

For governed shell families, it is not enough to prove:

- host shell behavior on one route
- rendered canonical behavior on another route

The suite also needs to prove that host canonical pages and rendered canonical
surfaces apply the same signed-off shell behaviors when they both express the
same family contract.

## Verification

- `npx playwright test tests/visual/designSystem/contextNavCanonicalFrame.spec.ts -g "host shell on the component canonical route|rendered shell lets the sub-nav scroll away|CDR-001 desktop canonical|CDR-002 desktop canonical|CDR-003 mobile canonical|outside-click close returns focus" --workers=1`

## Resolution Status

- candidate fix awaiting user confirmation

## Residual Risk

- other `/design-system` host pages may still carry older shared shell
  assumptions unless we continue the broader shell-parity audit
- the canonical host and rendered surface still share one document even after
  this parity correction

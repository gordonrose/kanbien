## Summary

The root-admin `web-app-hierarchy` POC showed inline navigation actions
inconsistently across the hierarchy rows. The recent change verified one page
row with both actions, but did not honestly prove the broader row mix that the
live tree renders.

## Root Cause

Two separate gaps combined here:

- The shared tree seam already exposed the eye action across the root-admin
  consumer through `onOpenNode`, but the root-admin adapter did not provide a
  durable external-link target for root-family rows. That meant the live row
  set could present different inline-action combinations than the tests
  covered.
- The inline open action itself used a fill-only eye SVG. In the real
  root-admin rendering, the button still mounted and remained clickable, but
  the glyph could disappear visually, leaving what looked like an empty square
  action.

## Why The Loop Missed It

- The earlier root-admin visual regression asserted only one page row.
- That coverage was realistic for one page state, but too narrow for the full
  row taxonomy visible in the POC.
- No test explicitly checked root-family or module rows, so the suite did not
  guard the "every row should still show the eye action, and rows with durable
  routes should also show the external-link action" contract.

## Reconciliation Changes

- Added root-family external-link wiring from `routePrefix` in the
  root-admin hierarchy adapter.
- Replaced the fill-only eye glyph with a stroke-based eye icon so the open
  action remains visibly rendered in the real root-admin surface.
- Added visual coverage for root-family, module, and page rows in the
  root-admin hierarchy Playwright suite.
- Added direct SVG-style assertions so the prevention layer verifies the eye
  action glyph itself, not only the clickable wrapper button.

## Coverage Lesson

When a governed hierarchy mixes multiple row types, validating a single page
row is not enough. The prevention layer should sample each meaningful row class
that can legitimately differ in available actions.

## Watch Items

- Module rows still do not expose a second durable external-link action because
  there is no approved module route contract yet.
- User confirmation is still needed that the live localhost surface now matches
  expectations in the browser.

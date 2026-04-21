## Summary

Loading `http://localhost:3000/root-admin#tenants` could surface the breadcrumb tooltip immediately, before the user intentionally hovered anything.

## Root Cause

The shared page-shell tooltip layer treated any `mouseover` on a tooltip-bearing node as valid hover intent, even if that node had just been rendered underneath a stationary cursor during page load or route redraw. Root-admin now uses tooltip-bearing breadcrumb nodes from the shared shell seam, so that shared hover behavior could make a fresh page load look like an active hover.

## Why The Loop Missed It

The shell suite covered explicit hover behavior, but it did not cover the inverse browser truth: tooltips must stay hidden when a page loads under a parked pointer.

## Reconciliation Changes Added

- updated the shared page-shell tooltip controller to suppress hover tooltips until a real pointer move occurs
- reset tooltip hover arming during root-admin render and hash-route transitions
- added a browser regression that loads `#tenants` with the cursor already parked over the breadcrumb area and requires the tooltip to stay hidden

## Coverage Lesson

Hover regressions need both positive and negative coverage. It is not enough to prove that tooltips appear on hover; we also need to prove they do not appear on load or redraw without fresh pointer intent.

## Follow-Up Watch Items

- if the design-system shell starts consuming this shared tooltip seam directly, keep the same parked-pointer regression at the canonical shell layer too

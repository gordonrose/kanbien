# Context-Nav Overlap Lane Reservation

## Summary

On desktop canonical launcher pages, the fixed `context-nav` rail was sitting
on top of the page instead of owning a reserved layout lane. The main content
started at the left edge of the viewport and visually slid behind the rail.

## Root Cause

The launcher pages used a fixed-position `context-nav`, but the page content
only compensated with inner padding. That padded the contents inside the main
element, but it did not move the main layout box itself out of the rail lane.

## Why The Loop Missed It

The earlier checks proved route availability and static shell presence, but
they did not verify rendered geometry between:

- the fixed `context-nav`
- the main content container

So the page could include the right component family while still violating the
actual spatial contract.

## Classification

- missing browser-backed geometry coverage
- wrong-layer verification
- layout-lane reservation drift

## Reconciliation Changes

- changed desktop `.design-system-page-main` layout so the main content box now
  starts after the context-nav rail using `margin-inline-start`
- kept the mobile override at zero so the bottom-nav layout still works
- added a Playwright geometry check that verifies the main content starts at or
  beyond the right edge of the desktop rail on the context-nav launcher page

## Coverage Lesson

For fixed shell primitives, spacing inside a container is not enough proof.
We need at least one browser-backed assertion that checks the relationship
between the fixed shell and the content box itself.

## Follow-Up

Apply the same browser-backed geometry scrutiny to the remaining shell issues:

- top-nav stickiness
- sub-nav/context-nav attachment while scrolling
- dynamic height compensation when sub-nav scrolls away

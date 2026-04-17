# Shell Scroll Attachment Drift

## Summary

The `/design-system` shell diverged from `root-admin` scroll behavior in two
related ways:

- the top-nav scrolled off the page instead of remaining pinned
- the fixed `context-nav` did not stay attached to the bottom of the visible
  shell stack while the sub-nav scrolled away

This created a visible gap and broke the expected rail-height compensation
behavior during scroll.

## Root Cause

The top-level shell `top-nav` was still rendered as a normal flow element
instead of a sticky shell anchor, and the `context-nav` used a static offset
model that only updated on resize-like events rather than on actual page
scroll.

## Why The Loop Missed It

The earlier route and layout checks verified:

- route availability
- family presence
- horizontal lane reservation

But they did not yet prove scroll-time geometry between:

- the top-nav
- the sub-nav
- the fixed context-nav

## Classification

- missing browser-backed scroll coverage
- wrong-layer verification
- shell attachment drift

## Reconciliation Changes

- made the top-level shell `top-nav` sticky at the top of the viewport
- scoped that sticky behavior to direct child shell top-nav instances so
  preview surfaces inside canonical frames do not inherit it accidentally
- updated `updateContextNavOffset()` to track the real top-level shell stack
  instead of the first `.top-nav` or `.sub-nav` found in the document
- added scroll-driven scheduling so the `context-nav` top offset follows the
  visible bottom edge of the shell stack while the sub-nav scrolls away
- added browser-backed coverage for:
  - desktop lane reservation
  - partial-scroll shell attachment
  - post-sub-nav shell attachment

## Coverage Lesson

For sticky and fixed shell primitives, source presence and resize checks are
not enough. The loop needs browser-backed assertions that prove scroll-time
geometry, especially where one fixed shell element is supposed to track another
scrolling shell seam.

## Follow-Up

Carry the same scroll-attachment checks into first-consumer parity once the
context-nav lands in the real root-admin shell.

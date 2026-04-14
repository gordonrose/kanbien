# Design System Route Qualitative Layout Regression

## Summary

- Date found: `2026-04-14`
- User-visible symptom:
  the new public `/design-system` route looked visibly under-designed and
  harness-like even though the frontend gate was green
- Affected surface:
  governed design-system page routes

## Root Cause

The first implementation moved the governed page coverage out of `/root-admin`,
but it reused the root-admin reference primitives too literally.

That left the new public route with:

- preview-sandbox geometry as the default visual posture
- an icon-only navigation rail that was too skeletal for a public page shell
- styling that still read like an internal verification harness rather than a
  deliberate design-system surface
- a filter area that inherited rail-collapse behavior from the old shell model
  instead of behaving like a page-level filter bar

The implementation was mechanically correct and accessible, but the visible
information architecture and visual hierarchy were not yet product-quality.

## Why The Feature Loop Missed It

- the current frontend gate is strong on geometry, overflow, RTL anchoring,
  keyboard flow, semantics, and automated accessibility
- the current governed assertions do not yet encode qualitative shell
  expectations such as whether a public route still visibly reads like a test
  harness
- screenshots were present, but without a higher-level route-specific visual
  bar they only proved stability, not whether the chosen shell composition was
  appropriate

This was primarily a **wrong-layer coverage** miss:
the existing loop protected correctness well, but not enough route-level design
intent for a newly public surface.

## Reconciliation Changes Added

- introduced a dedicated route-specific stylesheet:
  [src/frontend/designSystem/assets/styles.css](/home/gordon/kanbien/src/frontend/designSystem/assets/styles.css:1)
- upgraded the `/design-system` markup with visible nav labels, a stronger
  intro section, and a more intentional public shell:
  [src/frontend/designSystem/index.html](/home/gordon/kanbien/src/frontend/designSystem/index.html:1)
- changed the route to default to a wide public-page posture instead of a
  medium preview posture:
  [src/frontend/designSystem/assets/app.mjs](/home/gordon/kanbien/src/frontend/designSystem/assets/app.mjs:1)
- preserved the governed interaction contracts while redesigning:
  accessibility menu anchoring stayed direction-aware and the filter bar now
  collapses in place rather than reverting to old rail-only behavior

## Coverage Lesson

When a governed surface moves from an internal preview to a public-facing route,
the existing gate needs more than screenshot stability and accessibility proof.

It also needs route-level shell intent that checks:

- whether the default page posture matches the intended public layout
- whether navigation remains legible without relying on hover tooltips
- whether inherited harness behaviors are still appropriate for the new route

## Follow-Up Watch Items

- add a route-level design review checklist for new public frontend surfaces so
  “looks like harness scaffolding” is caught before merge
- consider a small set of explicit shell heuristics for public routes, such as
  minimum visible navigation labelling and public-layout default posture

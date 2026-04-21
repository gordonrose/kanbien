# Design-System Breadcrumb Business-Logic Drift

## Summary

Several `/design-system` pages used breadcrumb trails that looked structurally
correct but did not reflect the real page hierarchy. The clearest example was
the components catalog page using `Home / Components / Catalog`, where
`Catalog` was not a real hierarchy step.

## Root Cause

The breadcrumb implementation focused on preserving visual behavior and
responsive reduction, but did not have an explicit rule requiring breadcrumb
labels and depth to stay faithful to actual business or route hierarchy.

That left room for visually plausible filler labels to be introduced.

## Why The Loop Missed It

The current route-level verification proved:

- the breadcrumb shell existed
- the right families were present
- canonical pages were reachable

It did not prove that breadcrumb content itself was semantically honest.

## Classification

- missing coverage
- documentation gap
- business-logic population drift

## Reconciliation Changes

- added an explicit breadcrumb rule that labels and depth must reflect real
  hierarchy and must not use filler labels
- updated the breadcrumb pattern note so content expectations now require real
  hierarchy rather than demo completion
- corrected the components catalog breadcrumb from an invented
  `Home / Components / Catalog` trail to an honest `Home / Components` trail
- tightened route tests to assert the corrected breadcrumb labels and reject
  `Catalog` on the components page

## Coverage Lesson

For navigation chrome, structural correctness is not enough. The loop also
needs content-governance assertions so breadcrumbs cannot silently drift into
demo labels that imply false IA.

## Follow-Up

Codify the equivalent route-to-breadcrumb mapping rules for the broader feature
loop so real app pages inherit the same “no invented hierarchy” rule.

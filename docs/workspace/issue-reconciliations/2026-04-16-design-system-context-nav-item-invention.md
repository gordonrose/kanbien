# Design-System Context-Nav Item Invention

## Summary

The `/design-system` catalog and canonical launcher pages were updated to use
the real `context-nav` family, but the first pass populated that rail with
invented items such as `Display`, `Catalog`, `Filters`, and `Access` without
explicit product direction.

That created a visually plausible rail that was not grounded in approved
business navigation.

## Root Cause

The implementation correctly followed the instruction to use the real
`context-nav` component family, but it treated that as permission to invent the
information architecture needed to fill the rail.

The real requirement was narrower:

- only use approved destinations
- if approved destinations are unknown, ask or suggest rather than deciding

## Why The Loop Missed It

This escaped because the current route checks focused on:

- route availability
- presence of the correct shell families
- canonical link existence

They did not check whether launcher `context-nav` items were limited to the
explicitly approved exploration/canonical destinations.

## Classification

- missing coverage
- design-system governance gap
- source-valid but product-invalid content population

## Reconciliation Changes

- removed the invented `context-nav` from `/design-system/components`
- reduced canonical launcher `context-nav` content to the two explicitly
  approved destinations:
  - `Explore`
  - `Canonicals`
- removed invented launcher rail extras such as:
  - `Display`
  - `Catalog`
  - `Filters`
  - `Access`
- tightened route tests so canonical launcher pages assert the presence of only
  the approved launcher labels and the absence of the invented ones

## Coverage Lesson

For shared navigation families, structural verification is not enough. We also
need content-governance checks for cases where the implementation might render
the right component with the wrong business destinations.

## Follow-Up

Codify a reusable rule in the design-system/feature-loop docs:

- do not invent business navigation items for `context-nav`
- when destinations are unknown, stop and ask or present a suggestion for
  approval before implementation

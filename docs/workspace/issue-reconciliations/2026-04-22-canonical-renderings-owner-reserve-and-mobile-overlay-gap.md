# Canonical Renderings Owner Reserve And Mobile Overlay Gap

Date: 2026-04-22

## Symptom

Multiple `/design-system/canonical-renderings/*` families were clipping visible
child surfaces instead of accommodating them inside the canonical review frame.

Confirmed live-browser failures during the same-origin audit included:

- `simple-select`: `SSR-002`, `SSR-005`, `SSR-006`
- `time-picker`: `TPR-002`, `TPR-004`, `TPR-006`, `TPR-007`, `TPR-008`, `TPR-009`
- `date-picker`: `DTPR-004`, `DTPR-005`, `DTPR-007`, `DTPR-008`

## Local Manifestation

- desktop anchored listboxes and picker panels were absolutely positioned below
  their triggers but their owning render hosts did not reserve block space
- nested overlap states could reset a reserve to zero when one root under the
  same owner stayed closed
- local mobile overlay canonicals clipped month grids and time columns because
  the overlay container stayed fixed to the render card while inner content
  overflowed visibly past it

## Suspected Shared Seam

- canonical render-surface overflow model
- canonical host ownership of escaped child surfaces
- local mobile overlay posture for canonical render shells

## Existing Governed Pattern To Compare Against

Earlier family-local reserve patches for desktop date-picker states proved that
owner-reserve works better than frame-wide accommodation, but they were not
shared and they did not aggregate across multiple open/closed roots owned by
the same host surface.

## Architectural-First Decision

`shared-contract fix required`

The same clipping class appeared across three canonical families and two state
classes, so another family-local patch would have repeated the drift.

## Why A More Central Fix Was Chosen

The real missing contract was not "make this one family taller." It was:

- reserve space on the owning field/card for escaped anchored child surfaces
- aggregate reserves per owner across every root under that owner
- keep local mobile overlays scroll-contained inside the canonical render area

That contract now lives in shared canonical owner-reserve logic plus shared
local mobile-overlay overflow rules.

## Why The Earlier Loop Missed It

- browser verification had been too narrow and often stopped at one ref class
- the earlier date-picker reserve logic overwrote the owner reserve per root,
  so a later closed root under the same field silently removed the needed space
- there was no same-origin family sweep across all generated canonical refs
  before claiming the issue class was resolved

## What Changed Afterward

- added shared canonical owner-reserve logic in
  `src/frontend/designSystem/assets/canonicalOwnerReserve.mjs`
- adopted that shared reserve contract in `date-picker`, `time-picker`, and
  `simple-select` canonical controllers
- tightened local mobile overlay CSS so canonical date/time overlays scroll
  inside the render area instead of visually spilling past it
- expanded canonical visual specs and source audits to cover the newly exposed
  clipping classes

## Prevention Layer Added

- shared source audit updates in
  `tests/integration/frontend/designSystemCanonicalResponsiveWidthAudit.test.ts`
- family visual assertions in:
  - `tests/visual/designSystem/canonicals/forms/datePickerCanonical.spec.ts`
  - `tests/visual/designSystem/canonicals/forms/timePickerCanonical.spec.ts`
  - `tests/visual/designSystem/canonicals/forms/simpleSelectCanonical.spec.ts`
- same-origin live browser audit rerun against `/canonical-renderings`

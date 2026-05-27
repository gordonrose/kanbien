# 2026-04-18 Time Picker Canonical Render-Surface Gap

## Supersession Note

Archived on 2026-05-27 after the QA and issue-reconciliation freshness pass.
The child canonical render-surface lesson is now represented by the current
canonical launcher checklist, design-system loop skill, time-picker
verification checklist, and visual tests. Treat this record as historical
escaped defect evidence, not current operating authority.

## Summary

The new `Time Picker` canonical launcher looked complete in the repo, but its
links were still routing back to `/design-system/templates/form` instead of to
a dedicated child render page.

That meant the launcher was naming child canonicals without actually giving
the seam its own canonical render surface.

## User-Visible Symptom

- `/design-system/canonicals/time-picker` existed
- the `TPR-*` links opened the parent `Form Template` route instead of a
  dedicated `Time Picker` render page
- the child seam therefore behaved unlike `Simple Select`, which already had:
  - a canonical launcher
  - a dedicated canonical render route

## Root Cause

The `Time Picker` loop stopped after:

- creating the launcher route
- adding `TPR-*` ref URLs
- adding parent-hosted first-load state plumbing inside
  `src/frontend/designSystem/assets/app.mjs`

It did not complete the dedicated child render-surface pattern already used by
`Simple Select`.

So the launcher could claim child canonicals existed, but the repo still had
no dedicated:

- `/design-system/components/time-picker`
- time-picker-specific canonical renderer script

## Why The Existing Loop Missed It

The current coverage checked the wrong truth.

It proved:

- launcher presence
- `TPR-*` link labels
- first-load state on the parent form route

It did not prove:

- that the launcher pointed to a dedicated child render route
- that the child seam had canonical-shell breadcrumb coverage as both:
  - launcher
  - render surface

## Classification

- wrong-layer coverage
- shared-seam blind spot
- missing regression scenario in the canonical shell suite
- unrealistic harness assumption

The harness assumed "deterministic ref state on the parent route" was good
enough, but the repo's canonical architecture requires a dedicated child render
surface once a seam is being governed as its own family.

## Reconciliation Changes

- added dedicated canonical breadcrumb chains for:
  - `/design-system/canonicals/time-picker`
  - `/design-system/components/time-picker`
- added a dedicated child render surface:
  - `src/frontend/designSystem/components/time-picker.html`
- added a dedicated child canonical renderer:
  - `src/frontend/designSystem/assets/timePickerCanonical.mjs`
- updated the launcher so `TPR-*` links now point at
  `/design-system/components/time-picker?...`
- removed the temporary parent-hosted `TPR-*` state bootstrap from
  `src/frontend/designSystem/assets/app.mjs`
- extended executable proof so the issue would have been caught:
  - `tests/visual/designSystem/canonicals/forms/timePickerCanonical.spec.ts`
  - `tests/visual/designSystem/canonicals/shell/canonicalShell.spec.ts`

## Coverage Lesson

For child seams in this repo, launcher coverage is not enough.

A new canonical family is incomplete until all three exist and agree:

1. launcher route
2. dedicated render route
3. canonical shell coverage for both launcher and render

If a launcher still points at a parent page, the seam is not yet using the
repo's canonical architecture honestly.

## Verification

- `npx playwright test tests/visual/designSystem/canonicals/forms/timePickerCanonical.spec.ts tests/visual/designSystem/canonicals/shell/canonicalShell.spec.ts tests/visual/designSystem/canonicals/forms/formTemplate.spec.ts`

## Resolution Status

- candidate fix awaiting user confirmation

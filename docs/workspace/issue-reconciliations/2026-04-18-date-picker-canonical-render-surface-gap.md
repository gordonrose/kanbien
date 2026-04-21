# 2026-04-18 Date Picker Canonical Render Surface Gap

## Summary

The new `Date Picker` canonical launcher existed, but its links still opened
the parent `/design-system/templates/form` route instead of a dedicated child
render surface. That repeated the same class of honesty gap we previously hit
with `Simple Select`.

## User-Visible Symptom

- `/design-system/canonicals/date-picker` looked like a dedicated child
  launcher
- each `DTPR-*` link opened `/design-system/templates/form?...` rather than a
  dedicated `Date Picker` render page
- the child seam therefore had a launcher but not a true child render surface

## Root Cause

The first `Date Picker` canonical pass stopped after creating:

- a launcher page
- route-level browser proof on the parent form
- reference-pack and verification wiring that pointed at the launcher

That was enough to make the artifact chain look complete, but not enough to
match the established child-seam contract already used by `Simple Select`:

1. dedicated launcher
2. dedicated render surface
3. canonical-shell breadcrumb registration
4. tests that assert the launcher points at the render surface

## Why The Existing Loop Missed It

This escaped because the initial `datePickerCanonical.spec.ts` only checked:

- launcher button count
- launcher label visibility
- whether the linked routes loaded a visible form shell

It did not assert that launcher links targeted `/design-system/components/date-picker`.
That meant the tests accepted parent-route links as if they were dedicated
child canonical routes.

## Classification

- wrong-layer coverage
- artifact completeness gap
- child-surface honesty drift

## Reconciliation Changes

- added the dedicated render surface at:
  `src/frontend/designSystem/components/date-picker.html`
- added the render-state driver at:
  `src/frontend/designSystem/assets/datePickerCanonical.mjs`
- repointed `/design-system/canonicals/date-picker` links to
  `/design-system/components/date-picker?...`
- added breadcrumb registry coverage for:
  - `/design-system/canonicals/date-picker`
  - `/design-system/components/date-picker`
- strengthened `tests/visual/designSystem/canonicals/forms/datePickerCanonical.spec.ts` so it
  asserts launcher links target the dedicated render surface
- extended `tests/visual/designSystem/canonicals/shell/canonicalShell.spec.ts` to cover both the
  `Date Picker` launcher and render routes
- synced the `Date Picker` reference-pack and verification checklist to the
  dedicated render surface

## Prevention Lesson

For every new child-seam canonical family, the work is incomplete until all of
these exist together:

1. dedicated launcher
2. dedicated render surface
3. shared canonical-shell breadcrumb registration
4. tests that assert launcher links target the render surface, not just any
   visible route

Counting launcher buttons or loading the linked route is not sufficient on its
own.

## Verification

- `npx playwright test tests/visual/designSystem/canonicals/forms/datePickerCanonical.spec.ts tests/visual/designSystem/canonicals/forms/datePicker.spec.ts tests/visual/designSystem/canonicals/forms/formTemplate.spec.ts tests/visual/designSystem/canonicals/shell/canonicalShell.spec.ts`

## Resolution Status

- candidate fix awaiting user confirmation

# 2026-04-18 Drawer Select Canonical Render-Surface Repeat Gap

## Summary

The new `Drawer Select` canonical launcher repeated the same escaped issue that
had already occurred for `Date Picker` and `Time Picker`: the launcher existed,
but its `DSR-*` links still opened the parent `/design-system/templates/form`
route instead of a dedicated child render surface.

## User-Visible Symptom

- `/design-system/canonicals/drawer-select` looked like a dedicated child
  canonical family
- each `DSR-*` link still opened the parent `Form Template` page
- the child seam therefore had a launcher page but not an honest child render
  surface
- this was the fourth occurrence of the same launcher-truth mistake

## Root Cause

The loop again stopped at the wrong layer:

1. behavior lock
2. reference pack
3. launcher page
4. parent-route ref bootstrap
5. route-level browser proof on the parent form

That made the artifact chain appear complete enough for review while skipping
the repo’s actual child-canonical minimum:

1. dedicated launcher
2. dedicated child render surface
3. launcher links targeting the render surface
4. breadcrumb and canonical-shell coverage for launcher and render
5. tests that assert launcher `href` truth

## Why The Existing Loop Missed It

The current skill and harness language said enough about launcher creation and
canonical review order, but they were still not strict enough about render
surface truth.

The executable coverage for `Drawer Select` also checked the wrong truth:

- launcher button count
- launcher labels
- whether the parent route reopened the named state

It did not assert that the launcher links targeted a dedicated child render
route.

## Classification

- wrong-layer coverage
- launcher-truth gap
- artifact honesty drift
- repeated process miss

## Reconciliation Changes

- updated the frontend design-system loop skill so child-seam canonicals are
  not considered complete without a dedicated render surface and direct `href`
  assertions
- updated the design-system loop harness with the same child canonical
  launcher contract
- added a dedicated canonical launcher checklist at:
  `docs/workspace/design-system/verification/canonical-launcher-checklist.md`
- corrected the `Drawer Select` reference pack and verification checklist so
  the current `DSR-*` batch is described as provisional host-route work rather
  than as completed child canonicals
- added the dedicated child render surface at
  `src/frontend/designSystem/components/drawer-select.html`
- added the dedicated canonical state driver at
  `src/frontend/designSystem/assets/drawerSelectCanonical.mjs`
- repointed `/design-system/canonicals/drawer-select` so every `DSR-*` link
  now targets `/design-system/components/drawer-select`
- removed the old parent-route `DSR-*` bootstrap from
  `src/frontend/designSystem/assets/app.mjs`
- strengthened `tests/visual/designSystem/canonicals/forms/drawerSelectCanonical.spec.ts` so it
  now asserts launcher `href` truth and verifies the dedicated child route
- extended `tests/visual/designSystem/canonicals/shell/canonicalShell.spec.ts` with `Drawer
  Select` launcher and render-shell coverage

## Prevention Lesson

For child seams in this repo, a launcher page is not enough.

The family is not `canonical-created` until:

1. the dedicated render surface exists
2. launcher links point at that render surface
3. tests assert those `href`s directly

If links still point at the parent route, the batch is provisional host-route
review only and must be labeled that way.

## Verification

- source inspection of:
  - `.codex/skills/frontend-design-system-loop-maintainer/SKILL.md`
  - `docs/architecture/guides/design-system-loop-harness.md`
  - `docs/workspace/design-system/verification/canonical-launcher-checklist.md`
  - `docs/workspace/design-system/reference-packs/drawer-select-reference-pack.md`
  - `docs/workspace/design-system/verification/drawer-select-verification-checklist.md`
- executable verification:
  - `npx playwright test tests/visual/designSystem/canonicals/forms/drawerSelectCanonical.spec.ts tests/visual/designSystem/canonicals/shell/canonicalShell.spec.ts --grep "drawer-select|Drawer Select"`

## Resolution Status

- candidate fix awaiting user confirmation

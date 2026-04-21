# Form Template Fallback Note

## Scope

- Template family:
  `Form Template`
- Status:
  active rollback baseline
- Governed source route:
  `/design-system/templates/form`
- Canonical launcher:
  `/design-system/canonicals/form-template`
- Source behavior lock:
  `docs/workspace/design-system/behavior-locks/form-template-behavior-lock.md`
- Source reference pack:
  `docs/workspace/design-system/reference-packs/form-template-reference-pack.md`
- Source verification checklist:
  `docs/workspace/design-system/verification/form-template-verification-checklist.md`

## Purpose

- This note records the signed-off governed `Form Template` as the rollback
  target if a later replacement, downstream adoption, or parent-level refactor
  drifts from the approved parent composition.
- The fallback target is the governed parent template, not the earlier loose
  prototype memory.

## Fallback Trigger

- Use this fallback when a later change causes visible drift in:
  section cadence, footer action zoning, mixed child-seam composition,
  mobile stacking, magnification behavior, RTL review posture, or the parent
  page shell around extracted child seams.
- Treat child-seam regressions separately when the drift is isolated to a
  signed-off child family such as `Date Picker`, `Time Picker`, or
  `Drawer Select`.

## Rollback Source Of Truth

- Restore parent framing from:
  `docs/workspace/design-system/templates/form-template.md`
- Restore parent reference states from:
  `docs/workspace/design-system/reference-packs/form-template-reference-pack.md`
- Re-check parent proof through:
  `tests/visual/designSystem/canonicals/forms/formTemplate.spec.ts`
  `tests/visual/designSystem/canonicals/forms/formTemplateCanonical.spec.ts`
- Use the governed launcher at `/design-system/canonicals/form-template` as
  the human review surface before treating the fallback as complete.

## Rollback Boundary

- What the parent fallback owns:
  page shell, title and status posture, section rhythm, grouped field
  composition, footer action zoning, and the parent-owned framing around
  extracted child seams
- What the parent fallback does not replace:
  signed-off child-family internals for `Simple Select`, `Date Picker`,
  `Time Picker`, `Drawer Select`, or the exploratory child-owned `Choice
  Group` surface unless those child artifacts are also explicitly being rolled
  back

## Minimum Recovery Checks

- Confirm the parent `FTR-*` states still map honestly to the live route.
- Re-run:
  `npx playwright test tests/visual/designSystem/canonicals/forms/formTemplate.spec.ts`
- Re-check the parent canonical launcher and confirm:
  default, error, disabled, mobile, RTL, magnification, and overlay-heavy
  states still read as one coherent form page rather than a pile of unrelated
  child seams.

# Date Picker Reference Pack

## Purpose

Freeze the current `Date Picker` child seam baseline so its next canonical set
can be reviewed against named reference targets instead of against memory of
the broader `Form Template` parent route.

This pack is more concrete than the child behavior lock and narrower than the
parent form template. It records the exact child-owned picker states the next
review loop must preserve.

## Scope

- Family:
  `date-picker`
- Status:
  signed-off child reference baseline
- Current source surface:
  `/design-system/templates/form`
- Host parent family:
  `docs/workspace/design-system/behavior-locks/form-template-behavior-lock.md`
- Related behavior lock:
  `docs/workspace/design-system/behavior-locks/date-picker-behavior-lock.md`
- Related verification checklist:
  `docs/workspace/design-system/verification/date-picker-verification-checklist.md`
- Related canonical launcher:
  `/design-system/canonical-renderings/date-picker`
- Related canonical render surface:
  `/design-system/canonical-renderings/date-picker/:ref`
- Legacy compatibility routes:
  `/design-system/canonicals/date-picker`
  `/design-system/components/date-picker`
- Existing executable verification:
  `tests/visual/designSystem/canonicals/forms/datePicker.spec.ts`
  `tests/visual/designSystem/canonicals/forms/datePickerCanonical.spec.ts`

## Signed-Off Rule Source

This pack inherits the approved child-seam rules from:

- `DTP-BL-001` through `DTP-BL-015` in
  `docs/workspace/design-system/behavior-locks/date-picker-behavior-lock.md`

Those behavior locks remain the rule source.
This pack turns them into named reference targets for child review.

## What This Pack Inherits

This child pack inherits, but does not redefine:

- parent field-tile placement, local field help, and parent error copy
- parent section rhythm and page action zoning
- the active time-picker seam's hour/minute option anatomy and close grammar

Those remain governed upstream by the parent `Form Template` chain and the
active `Time Picker` chain.

## Current Surface Truth

- the current child seam lives inside `/design-system/templates/form`
- the family currently includes:
  - single-date trigger and popover
  - date-range trigger, staged summary, and footer `Done`
  - date-range-with-time trigger, staged summary, nested time slots, and outer
    summary synchronization
  - previous and next month stepping
  - anchored month and year jump controls on the leading and trailing rendered
    month edges for multi-month variants
  - mobile full-screen overlay posture with sticky header and sticky footer
  - RTL-aware mobile nav glyph mirroring
- the current implementation still depends on the signed-off parent route for:
- surrounding field-tile shell, field labels, and helper copy
  - page chrome and action rails
  - shared display-settings review toggles
- the child seam now has a persistence-backed generated canonical launcher at
  `/design-system/canonical-renderings/date-picker`
- the child seam now also has a persistence-backed generated canonical render
  surface at `/design-system/canonical-renderings/date-picker/:ref`
- legacy compatibility routes remain available at
  `/design-system/canonicals/date-picker`
  and `/design-system/components/date-picker`
- the dedicated render surface keeps parent-owned label/help/error framing
  visible while rendering child-owned picker states directly

## Required Reference States

| Ref ID | Route | State | Why it exists | Evidence status | Notes |
| --- | --- | --- | --- | --- | --- |
| `DTPR-001` | `/design-system/canonical-renderings/date-picker/DTPR-001` | Single-date resting trigger and anchored one-month panel | Preserves the quick single-date variant and its compact child posture | covered-by-test | Generated child render surface now opens directly into the single-date review state |
| `DTPR-002` | `/design-system/canonical-renderings/date-picker/DTPR-002` | Date-range staged start-selection state with `Done` disabled | Preserves the explicit range state machine before completion | covered-by-test | Generated child render surface now shows the staged state directly |
| `DTPR-003` | `/design-system/canonical-renderings/date-picker/DTPR-003` | Date-range completed state after reverse-order normalization | Preserves the forgiving backwards-selection rule and completed summary state | covered-by-test | Generated child render surface now shows the normalized result directly |
| `DTPR-004` | `/design-system/canonical-renderings/date-picker/DTPR-004` | Date-range-with-time open state with nested time-picker overlap | Preserves the one allowed nested overlap inside the child seam | covered-by-test | Generated child render surface now opens directly into the nested overlap state |
| `DTPR-005` | `/design-system/canonical-renderings/date-picker/DTPR-005` | Date-range-with-time outer label after nested time edits | Preserves date-picker ownership of the composed collapsed summary | covered-by-test | Generated child render surface now shows the synchronized outer label directly |
| `DTPR-006` | `/design-system/canonical-renderings/date-picker/DTPR-006` | Multi-month range navigation with anchored month/year jump controls | Preserves long-range navigation without repeated-only stepping | covered-by-test | Generated child render surface now shows the reanchored month window directly |
| `DTPR-007` | `/design-system/canonical-renderings/date-picker/DTPR-007` | Mobile full-screen date-range overlay with sticky header and sticky footer | Preserves the child-owned mobile overlay posture | covered-by-test | Generated child render surface now opens directly into the mobile overlay state |
| `DTPR-008` | `/design-system/canonical-renderings/date-picker/DTPR-008` | RTL mobile overlay with mirrored previous and next glyphs | Preserves native-feeling mirrored navigation in the constrained overlay state | covered-by-test | Generated child render surface now scopes RTL to the canonical review |
| `DTPR-009` | `/design-system/canonical-renderings/date-picker/DTPR-009` | Hidden closed-state guarantee under mobile overlay rules | Preserves the invariant that only the active panel surfaces | covered-by-test | Generated child render surface now shows the closed mobile review state directly |
| `DTPR-010` | `/design-system/canonical-renderings/date-picker/DTPR-010` | Dark-theme and magnified range review | Preserves jump-control, summary, and sticky-region readability under shared stress states | covered-by-test | Generated child render surface now shows the stress state directly |

## Proposed Canonical Review Batch

The proposed child canonical set for the next dedicated review gate is:

- `DTPR-001` single-date
- `DTPR-002` range staged
- `DTPR-003` range normalized complete
- `DTPR-004` range-with-time nested overlap
- `DTPR-005` range-with-time outer label sync
- `DTPR-006` anchored jump controls
- `DTPR-007` mobile overlay
- `DTPR-008` RTL mobile
- `DTPR-010` magnification and theme stress

This covers the requested single-date, range, range-with-time, mobile, RTL,
and magnification/theme stress set on the dedicated child render surface.

## High-Risk Review Batch

The highest-risk review states are:

- `DTPR-002` date-range staged start-selection state
- `DTPR-003` reverse-order normalized range state
- `DTPR-004` range-with-time nested overlap
- `DTPR-007` mobile full-screen overlay
- `DTPR-008` RTL mobile overlay
- `DTPR-010` dark-theme and magnified range review

These states carry the biggest drift risk because they prove the child state
machine, normalization, nested overlap boundary, overlay posture, RTL, and
stress-state readability.

## Parity Rule

A future extracted date-picker implementation or real consumer matches this
pack only when:

- it satisfies the locked `DTP-BL-*` child behaviors
- it preserves the required `DTPR-*` states or approved equivalents
- any difference from the parent `Form Template` route is recorded explicitly
  rather than assumed from the child artifact alone

## Exit Condition

This child reference pack is now operational through the generated launcher at
`/design-system/canonical-renderings/date-picker` and the generated render
surface at `/design-system/canonical-renderings/date-picker/:ref`, with the
legacy launcher and legacy render route retained for compatibility during the
migration.
Later sign-off should review this pack before child canonical sign-off.

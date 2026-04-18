# Simple Select Reference Pack

## Purpose

Freeze the current `Simple Select` child seam baseline so child-specific
canonicals can be reviewed against named reference targets instead of loose
memory of the parent `Form Template` route.

This pack is more concrete than the child behavior lock and narrower than the
broader parent template. It records the exact select states the child canonical
set must preserve.

## Scope

- Family:
  `simple-select`
- Status:
  signed-off child reference baseline
- Current source surface:
  `/design-system/templates/form`
- Host parent family:
  `docs/workspace/design-system/behavior-locks/form-template-behavior-lock.md`
- Related behavior lock:
  `docs/workspace/design-system/behavior-locks/simple-select-behavior-lock.md`
- Related verification checklist:
  `docs/workspace/design-system/verification/simple-select-verification-checklist.md`
- Related canonical launcher:
  `/design-system/canonicals/simple-select`
- Related canonical render surface:
  `/design-system/components/simple-select`
- Existing executable verification:
  `tests/visual/designSystem/simpleSelect.spec.ts`
  `tests/visual/designSystem/simpleSelectCanonical.spec.ts`

## Signed-Off Rule Source

This pack inherits the approved child-seam rules from:

- `SS-BL-001` through `SS-BL-012` in
  `docs/workspace/design-system/behavior-locks/simple-select-behavior-lock.md`

Those behavior locks remain the rule source.
This pack turns them into named reference targets for child review.

## What This Pack Inherits

This child pack inherits, but does not redefine:

- parent page shell and section cadence
- parent field label/help/error framing
- parent review-state toggles for `errors`, `disabled`, and `mobile`
- parent theme and direction controls
- broader form overlay exclusivity outside simple-select peers

Those remain governed upstream by the parent `Form Template` chain.

## Current Surface Truth

- the current child seam is the first `Dropdown` field inside
  `/design-system/templates/form`
- the surface currently includes:
  - one visible trigger button
  - one hidden input storing the selected value
  - one anchored listbox
  - three single-select options
- the current default selected value is `all-active-tenants`
- the current default visible trigger label is `All active tenants`
- the current option set is:
  - `All active tenants`
  - `Trial tenants`
  - `Enterprise tenants`
- the listbox currently opens beneath the trigger and matches the field width
  rather than introducing side-panel or modal chrome
- the child seam now has a dedicated canonical launcher at
  `/design-system/canonicals/simple-select`
- the current launcher still opens the signed-off parent route because the
  child seam is governed honestly through parent-hosted reference states rather
  than through a standalone component surface
- the current seam already supports:
  - trigger toggle open/close
  - focus handoff from trigger into the option list on open
  - single active option reflection
  - `ArrowUp` and `ArrowDown` option traversal while open
  - outside-click dismissal
  - `Escape` dismissal
  - trigger focus return on owned close
- the current seam intentionally does not support:
  - search
  - multi-select chips
  - explicit close buttons
  - drawer or modal semantics
  - focus trapping

## Required Reference States

| Ref ID | Route | State | Why it exists | Evidence status | Notes |
| --- | --- | --- | --- | --- | --- |
| `SSR-001` | `/design-system/components/simple-select?ref=SSR-001&width=420&state=baseline&theme=normal&dir=ltr&zoom=0` | Default closed baseline | Preserves the calm resting trigger and parent-owned framing before interaction | canonical-created | Dedicated child render surface now shows the closed baseline directly |
| `SSR-002` | `/design-system/components/simple-select?ref=SSR-002&width=420&state=open&theme=normal&dir=ltr&zoom=0` | Open anchored listbox with focus moved into the option stack | Preserves the lightweight beneath-trigger opening posture and the seam-owned keyboard entry model | covered-by-test | Dedicated child render surface now opens directly into the focused list state |
| `SSR-003` | `/design-system/components/simple-select?ref=SSR-003&width=420&state=selected&theme=normal&dir=ltr&zoom=0` | Selected-option reflection after choosing a new option | Preserves single-selection sync between hidden value, active option, and trigger label | covered-by-test | Dedicated child render surface now shows the reflected selected state directly |
| `SSR-004` | `/design-system/components/simple-select?ref=SSR-004&width=420&state=disabled&theme=normal&dir=ltr&zoom=0` | Disabled inherited state | Preserves the child seam’s non-interactive posture under parent disabled review without inventing a child-specific disabled API | covered-by-test | Dedicated child render surface now shows the disabled inherited state directly |
| `SSR-005` | `/design-system/components/simple-select?ref=SSR-005&width=420&state=open&theme=normal&dir=rtl&zoom=0` | RTL open state | Preserves mirrored text/direction posture while keeping the same anchored-listbox grammar | covered-by-test | Dedicated child render surface scopes RTL to the local seam review |
| `SSR-006` | `/design-system/components/simple-select?ref=SSR-006&width=420&state=open&theme=dark&dir=ltr&zoom=0` | Theme-stress open state | Preserves the same lightweight listbox behavior against a non-default parent theme | covered-by-test | Dedicated child render surface scopes dark theme to the local seam review |

## High-Risk Review Batch

The highest-risk review states are:

- `SSR-002` open anchored listbox
- `SSR-003` selected-option reflection
- `SSR-004` disabled inherited state
- `SSR-005` RTL open state
- `SSR-006` theme-stress open state

These states carry the biggest drift risk because they prove the child seam’s
lightweight opening grammar, keyboard entry/traversal, selection truthfulness,
inherited disabled behavior, and cross-cutting direction/theme posture.

## Parity Rule

A future extracted simple-select implementation or real consumer matches this
pack only when:

- it satisfies the locked `SS-BL-*` child behaviors
- it preserves the required `SSR-*` states or approved equivalents
- any difference from the parent `Form Template` route is recorded explicitly
  rather than assumed from the child artifact alone

## Exit Condition

This child reference pack becomes operational when:

- the `SSR-*` states are reviewed directly from the current host route or a
  later dedicated child canonical surface
- the verification checklist points at this child pack explicitly
- later sign-off asks for this pack review before child canonical sign-off

This child reference pack is now operational through the dedicated launcher at
`/design-system/canonicals/simple-select` and the dedicated render surface at
`/design-system/components/simple-select`.

# Time Picker Reference Pack

## Purpose

Freeze the signed-off `Time Picker` child seam so future comparison, parity
work, and later promotion can reference named child-owned targets instead of
memory of the broader `Form Template` parent route.

This pack is more concrete than the child behavior lock and narrower than the
parent form template. It records the exact child-owned picker states the
signed-off seam must preserve.

## Scope

- Family:
  `time-picker`
- Status:
  signed-off child reference pack
- Current source surface:
  `/design-system/templates/form`
- Host parent family:
  `docs/workspace/design-system/behavior-locks/form-template-behavior-lock.md`
- Related behavior lock:
  `docs/workspace/design-system/behavior-locks/time-picker-behavior-lock.md`
- Related verification checklist:
  `docs/workspace/design-system/verification/time-picker-verification-checklist.md`
- Related canonical launcher:
  `/design-system/canonical-renderings/time-picker`
- Related canonical render surface:
  `/design-system/canonical-renderings/time-picker/:ref`
- Existing executable verification:
  `tests/visual/designSystem/canonicals/forms/formTemplate.spec.ts`
  `tests/visual/designSystem/canonicals/forms/timePickerCanonical.spec.ts`

## Signed-Off Rule Source

This pack inherits the approved child-seam rules from:

- `TP-BL-001` through `TP-BL-010` in
  `docs/workspace/design-system/behavior-locks/time-picker-behavior-lock.md`

Those behavior locks remain the rule source.
This pack turns them into named reference targets for child review.

## What This Pack Inherits

This child pack inherits, but does not redefine:

- parent field-row placement, local field help, and parent error copy
- parent section rhythm and page action zoning
- date-picker-owned calendar rendering, staged range guidance, anchored jumps,
  range normalization, and `Done` semantics

Those remain governed upstream by the parent `Form Template` chain and the
existing `Date Picker` chain.

## Current Surface Truth

- the current child seam lives inside `/design-system/templates/form`
- the family currently includes:
  - one standalone time-picker field in the `Basics` section
  - one nested `Start time` picker inside `Date range with time`
  - one nested `End time` picker inside `Date range with time`
  - one trigger per instance showing a normalized `HH:MM` value
  - one dialog-style panel with `Hour` and `Minute` quick-pick columns
  - one explicit close button inside each panel header
  - bubbling `formtimechange` events so host seams can rerender composed labels
  - mobile full-screen overlay posture for open time panels
- the current implementation still depends on the signed-off parent route for:
  - surrounding field labels and helper/error copy
  - page chrome and action rails
  - shared display-settings review toggles
- the persistence-backed generated launcher now exists at
  `/design-system/canonical-renderings/time-picker`
  and opens the first `TPR-*` batch on the dedicated child render surface at
  `/design-system/canonical-renderings/time-picker/:ref`
- the legacy compatibility launcher remains available at
  `/design-system/canonicals/time-picker`
  and the legacy compatibility render route remains available at
  `/design-system/components/time-picker`

## Required Reference States

| Ref ID | Route | State | Why it exists | Evidence status | Notes |
| --- | --- | --- | --- | --- | --- |
| `TPR-001` | `/design-system/canonical-renderings/time-picker/TPR-001` | Standalone resting trigger with closed panel and visible current value | Preserves the default child seam before open-state or responsive stress is applied | canonical-created | The persistence-backed child render surface now owns this resting state directly |
| `TPR-002` | `/design-system/canonical-renderings/time-picker/TPR-002` | Standalone picker open with hour and minute columns visible | Freezes the primary child-seam shape that must not collapse into a generic dropdown | covered-by-test | The generated launcher now opens this state directly from persisted canonical truth; the dedicated child render surface also browser-checks explicit close-button dismissal, hidden panel state, `aria-expanded=false`, and trigger focus return |
| `TPR-003` | `/design-system/canonical-renderings/time-picker/TPR-003` | Standalone quick-pick completion where hour stays open and minute completes, closes, and returns focus | Preserves the core signed-off interaction rather than only the open appearance | covered-by-test | The generated render route now exposes the completed state directly, while route-level Playwright still covers minute-completion behavior |
| `TPR-004` | `/design-system/canonical-renderings/time-picker/TPR-004` | Nested time picker open inside an already open `date range with time` host | Records the allowed overlap exception and the child seam’s behavior inside the composed host flow | covered-by-test | The generated child render surface isolates the nested overlap case instead of routing through the full form page; it also browser-checks explicit nested close-button dismissal, hidden child panel state, `aria-expanded=false`, trigger focus return, and continued parent host visibility |
| `TPR-005` | `/design-system/canonical-renderings/time-picker/TPR-005` | Nested minute completion updates the composed range label without collapsing the parent host | Proves the child emits truthful changes while staying inside the host workflow | canonical-created | This generated render state isolates outer-label sync on the child surface |
| `TPR-006` | `/design-system/canonical-renderings/time-picker/TPR-006` | Mobile standalone picker open as a full-viewport overlay | Captures the responsive posture that materially changes layout and layering | canonical-created | Also guards the hidden-state regression class by proving mobile-open posture on the generated child surface |
| `TPR-007` | `/design-system/canonical-renderings/time-picker/TPR-007` | RTL mobile picker open with inherited mirrored shell context | Identifies the highest-value directional child stress state | canonical-created | The generated launcher now opens this RTL mobile state directly |
| `TPR-008` | `/design-system/canonical-renderings/time-picker/TPR-008` | Dark-theme standalone picker open | Identifies the highest-value theme stress state for panel contrast and option legibility | canonical-created | The first generated canonical batch includes this dark-theme open-state review on the child render surface |
| `TPR-009` | `/design-system/canonical-renderings/time-picker/TPR-009` | RTL and magnified open-state review | Preserves seam readability under the highest-risk combined host stress state | canonical-created | This remains outside the priority batch but now has a persistence-backed deterministic child render URL |

## Signed-Off Canonical Review Batch

The signed-off child canonical set for this seam is:

- `TPR-002` standalone open quick-pick
- `TPR-004` nested overlap inside `date range with time`
- `TPR-006` mobile overlay
- `TPR-007` RTL mobile overlay
- `TPR-008` dark-theme open-state review

This covers the requested standalone, nested range-with-time, mobile, RTL, and
theme-stress set on the dedicated child launcher and render surface.

## High-Risk Review Batch

The highest-risk review states are:

- `TPR-003` minute-completion close and focus return
- `TPR-002` explicit standalone close-button dismissal
- `TPR-004` nested overlap inside the open range-with-time flow
- `TPR-004` explicit nested close-button dismissal
- `TPR-005` composed outer-label sync after nested time edits
- `TPR-006` mobile full-screen overlay
- `TPR-007` RTL mobile overlay
- `TPR-008` dark-theme open-state review

These states carry the biggest drift risk because they prove the seam’s quick-
pick contract, completion grammar, overlap boundary, overlay posture, and
stress-state readability.

## Parity Rule

A future extracted time-picker implementation or real consumer matches this
pack only when:

- it satisfies the locked `TP-BL-*` child behaviors
- it preserves the required `TPR-*` states or approved equivalents
- any difference from the parent `Form Template` route is recorded explicitly
  rather than assumed from the child artifact alone

## Exit Condition

This child reference pack is now the operational signed-off baseline because:

- the `TPR-*` states now have a persistence-backed generated child canonical
  launcher at `/design-system/canonical-renderings/time-picker`
- the verification checklist points at this child pack explicitly
- explicit standalone and nested close-button dismissal now has rendered
  browser proof on the generated child render surface
- the canonical render surface and executable proof now support direct future
  parity review through persistence-backed generated routes without routing
  back through the parent form page

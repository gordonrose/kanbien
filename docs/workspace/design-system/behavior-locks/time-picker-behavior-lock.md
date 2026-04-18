# Time Picker Behavior Lock

## Purpose

Lock the behavioral rules for the `Time Picker` child seam before treating it
as a reusable extracted family from the signed-off `Form Template` parent.

This artifact governs the time-picker seam itself.
Parent-template rules such as page framing, section cadence, grouped-field
composition, and action zoning stay governed by:

- `docs/workspace/design-system/behavior-locks/form-template-behavior-lock.md`

Date-picker rules such as calendar rendering, staged range guidance, month and
year jumps, and `Done` semantics stay governed by:

- `docs/workspace/design-system/behavior-locks/date-picker-behavior-lock.md`

Do not duplicate those parent or date-picker behaviors here unless the
time-picker seam needs to reference them explicitly.

## Review Status Legend

- `approved`:
  behavior should be preserved in the child reference pack and later consumers
- `rejected`:
  current behavior should not be treated as the target
- `undecided`:
  behavior still needs iteration before being locked

## Scope

- Family:
  `time-picker`
- Review outcome:
  signed-off child behavior lock
- Current source surface:
  `/design-system/templates/form`
- Host parent family:
  `docs/workspace/design-system/behavior-locks/form-template-behavior-lock.md`
- Related reference pack:
  `docs/workspace/design-system/reference-packs/time-picker-reference-pack.md`
- Related verification checklist:
  `docs/workspace/design-system/verification/time-picker-verification-checklist.md`

## Ownership Boundary

- The parent `Form Template` owns field-row placement, local helper/error copy
  outside the picker panel, section rhythm, and page/header/footer action
  zoning.
- The `Date Picker` seam owns calendar month rendering, staged range guidance,
  anchored jump controls, range normalization, and `Done` completion for range
  workflows.
- The `Time Picker` seam owns the trigger label, trigger expansion state,
  panel visibility, hour/minute option anatomy, minute-completion behavior,
  seam-owned close paths, focus recovery for seam-owned dismissals, and mobile
  open-panel overlay posture.
- In `date range with time`, the parent date-picker seam still owns the
  composed workflow and outer summary label, while the nested `Time Picker`
  child seam owns only time editing and event emission inside that host flow.

## Behavior Review

| ID | Behavior statement | Why it matters | Current implementation note | Status | User feedback |
| --- | --- | --- | --- | --- | --- |
| `TP-BL-001` | The `Time Picker` must be governed as a child seam of `Form Template` rather than as a replacement for the whole parent page or field row. | Keeps extraction honest and prevents the child seam from silently absorbing parent page ownership. | The current time pickers live inside stable form-field rows while the page shell, section cadence, and action rails stay parent-owned. | `approved` | Treat this as a child seam, not a parent page. |
| `TP-BL-002` | The seam must preserve a quick two-column chooser with `Hour` and `Minute` columns rather than drifting into a generic dropdown or freeform input. | Protects the signed-off brisk time-selection posture. | `/design-system/templates/form` renders hour and minute option columns for standalone and nested instances from one controller. | `approved` | Preserve the real quick-pick interaction instead of abstracting it into a generic dropdown. |
| `TP-BL-003` | Selecting an hour must update the current value in place but keep the picker open so minute selection can complete the value intentionally. | Distinguishes the seam’s staging step from its completion step. | `initializeFormTimePickers()` rerenders active hour state after hour selection without closing the panel. | `approved` | Quick hour selection should update in place, not complete the interaction. |
| `TP-BL-004` | Selecting a minute must complete the value, close the picker, and return focus to the owning trigger. | This is the key approved completion rule for the seam. | Minute-button selection calls `updateTimeValue(..., { closeAfterSelect: true })`, which closes the panel and restores trigger focus. | `approved` | Preserve the approved rule that minute selection completes the value and closes the picker. |
| `TP-BL-005` | Explicit seam-owned dismissals such as the close button and `Escape` must close the picker and return focus to its trigger. | Makes recovery and keyboard behavior explicit instead of incidental. | `closeTimePicker(root, { restoreFocus: true })` is used for close-button and `Escape` dismissals. | `approved` | Be explicit about focus return and close semantics. |
| `TP-BL-006` | Outside-click dismissal may close the picker without stealing focus back from the outside target. | Preserves broader form focus choreography and keeps owned versus non-owned dismissal semantics distinct. | Document-level outside-click handling closes the active picker without `restoreFocus`. | `approved` | Owned close paths should return focus; outside intent should not fight the browser. |
| `TP-BL-007` | Opening one top-level time picker must not let unrelated peer overlays accumulate, but a nested time picker may remain open inside an already open `date range with time` picker. | Records the approved overlap exception without broadening it into a generic stacking rule. | Time pickers self-manage one active instance, while the parent contract allows nested time-in-range overlap as the single approved exception. | `approved` | Preserve the approved overlap rule where time picker may sit inside an open date-range-with-time flow. |
| `TP-BL-008` | In `date range with time`, nested start/end time pickers own only time editing and must not close the parent date picker or replace the parent’s staged date guidance. | Keeps the seam boundary honest against the adjacent date-picker seam. | Nested `formtimechange` events bubble so the date picker can rerender its composed label while the date panel remains open. | `approved` | Keep this seam narrow and do not absorb date-range parent logic unless it truly belongs here. |
| `TP-BL-009` | In mobile review mode, an open time-picker panel must convert from an anchored popover into a full-screen overlay while closed panels remain hidden. | Captures the approved responsive posture and the hidden-state regression lesson. | Mobile styling applies only to `.form-time-menu:not(.hidden)` and converts the open panel into a full-viewport overlay. | `approved` | Mobile posture is part of the seam where applicable. |
| `TP-BL-010` | The seam must stay reviewable under inherited RTL, theme, and magnification stress, but those host-shell appearance states should be frozen through child canonicals rather than by moving shell ownership into the seam. | Names the required stress contexts without pretending the child owns global shell framing. | The picker inherits `dir`, theme variables, and magnification from the parent route today; child-specific canonicals still need to freeze the highest-value open states. | `approved` | Include RTL/mobile/theme stress where relevant. |

## Exit Criteria For This Step

This behavior lock step is complete because the child-seam rules above now
guide:

- the signed-off child reference pack
- the signed-off `TPR-*` canonical set
- the signed-off child verification checklist

Future work should preserve this approved child boundary rather than reopening
parent or date-picker ownership accidentally.

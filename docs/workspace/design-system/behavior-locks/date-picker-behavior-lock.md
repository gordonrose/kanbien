# Date Picker Behavior Lock

## Purpose

Lock the behavioral rules for the `Date Picker` child seam before treating it
as a reusable extracted family from the signed-off `Form Template` parent.

This artifact governs the date-picker seam itself.
Parent-template rules such as page framing, section cadence, grouped-field
composition, and action zoning stay governed by:

- `docs/workspace/design-system/behavior-locks/form-template-behavior-lock.md`

Nested time-option picking stays governed by the active `time-picker` child
seam.
Do not duplicate those parent or nested-time behaviors here unless the
date-picker seam needs to reference them explicitly.

## Review Status Legend

- `approved`:
  behavior should be preserved in the child reference pack and later consumers
- `rejected`:
  current behavior should not be treated as the target
- `undecided`:
  behavior still needs iteration before being locked

## Scope

- Family:
  `date-picker`
- Review outcome:
  signed-off child behavior lock
- Current source surface:
  `/design-system/templates/form`
- Host parent family:
  `docs/workspace/design-system/behavior-locks/form-template-behavior-lock.md`
- Related reference pack:
  `docs/workspace/design-system/reference-packs/date-picker-reference-pack.md`
- Related verification checklist:
  `docs/workspace/design-system/verification/date-picker-verification-checklist.md`

## Ownership Boundary

- The parent `Form Template` owns field-row placement, local helper/error copy
  outside the picker panel, section rhythm, and page/header/footer action
  zoning.
- The `Date Picker` seam owns the trigger label, trigger expansion state,
  panel visibility, calendar month rendering, selection staging, date summary
  guidance, jump controls, local `Done` gating, and mobile picker overlay
  posture.
- The active `Time Picker` child seam owns hour/minute option anatomy, minute-
  completion behavior, its own open/close choreography, and its internal focus
  recovery.
- The `Date Picker` seam still owns the composed range-with-time contract where
  nested time pickers feed the outer trigger summary and remain the only
  allowed nested overlap inside an already open range-with-time panel.

## Behavior Review

| ID | Behavior statement | Why it matters | Current implementation note | Status | User feedback |
| --- | --- | --- | --- | --- | --- |
| `DTP-BL-001` | The `Date Picker` must be governed as a child seam of `Form Template` rather than as a replacement for the whole parent page or field row. | Keeps extraction honest and prevents the child seam from silently absorbing parent page ownership. | The current date pickers live inside stable form-field rows while the page shell, section cadence, and action rails stay parent-owned. | `approved` | Treat this as a child seam, not a parent page. |
| `DTP-BL-002` | The seam must preserve three variants inside one family: single-date, date-range, and date-range-with-time. | Keeps the extracted family aligned with the approved live surface instead of freezing only the simplest calendar case. | `/design-system/templates/form` currently ships all three variants from one interaction controller. | `approved` | Cover the single, range, and range-with-time cases where they really belong to the seam. |
| `DTP-BL-003` | Single-date selection must behave as a quick one-step choice: selecting a day updates the trigger label, closes the panel immediately, and returns focus to the trigger on owned close. | Distinguishes the lightweight single-date flow from the more deliberate range authoring flow. | `initializeFormDatePickers()` updates the hidden value, rerenders the trigger label, and closes `single` mode with focus restoration after a day click. | `approved` | Single-date should stay fast and calm. |
| `DTP-BL-004` | Range and range-with-time variants must preserve explicit staged selection: first choose a start date, then choose an end date, and do not auto-close after the first click. | Protects the intentional multi-step scheduling model rather than letting it drift into generic calendar behavior. | The current controller stores `selectionStage`, clears the end value on a new start selection, and keeps the panel open after the first date click. | `approved` | Preserve staged range selection. |
| `DTP-BL-005` | While a range is incomplete, the panel must show truthful guidance about the current stage and keep `Done` disabled until an end date exists. | Makes the state machine legible and prevents a half-authored range from masquerading as complete. | The range summary changes between default, `start selected`, and `selected range` copy, and the `Done` button remains disabled until `endInput.value` exists. | `approved` | Preserve `Done` gating and real interaction rules. |
| `DTP-BL-006` | If the second selected range date falls earlier than the current start date, the seam must normalize the range order instead of leaving a backwards or invalid state. | Keeps the control forgiving without making users manually restart the flow. | The current logic swaps `startInput` and `endInput` when the second chosen date is earlier than the stored start. | `approved` | Preserve reverse-range normalization. |
| `DTP-BL-007` | Multi-month range variants must preserve anchored month and year jump controls at the leading and trailing month edges in addition to previous/next stepping. | Locks the signed-off long-range navigation affordance that emerged from iteration. | The first and last rendered month panels expose anchored jump groups while middle months stay title-only. | `approved` | Preserve anchored month/year jumps. |
| `DTP-BL-008` | The seam must keep the month window anchored to the active start of the authored range after navigation or selection changes instead of drifting unpredictably. | Preserves orientation after staged edits and jump-control changes. | The current controller resets `data-viewStart` to the active start date after start selection, reverse normalization, and completed range updates. | `approved` | Keep the calendar anchored to the authored range. |
| `DTP-BL-009` | In range-with-time mode, the `Date Picker` seam owns the composed outer summary label and must keep it synchronized with both date changes and nested time-picker changes. | Makes the outer collapsed value truthful while still letting the future time-picker seam own the internals of choosing a time. | The current date-picker rerenders the outer trigger label on both `formselectchange` and bubbled `formtimechange` events from nested time pickers. | `approved` | Be explicit about what belongs to date-picker versus nested time-picker behavior. |
| `DTP-BL-010` | The only allowed nested overlap is a time picker opened inside an already open range-with-time date picker; unrelated selects, drawers, or peer pickers must not stay open at the same time. | Keeps overlay ownership coherent while preserving the one approved composed case. | The shared form-surface runtime now passively closes unrelated open select, drawer-select, date, and standalone time surfaces before opening a new top-level picker, while preserving nested time-picker overlap inside range-with-time. | `approved` | Nested time inside date-range-with-time is the one allowed overlap. |
| `DTP-BL-011` | In mobile review mode, an open date-picker panel must convert from an anchored popover into a full-screen overlay with sticky header and sticky footer regions while preserving the same staged range logic. | Makes the approved mobile posture part of the child seam rather than a parent-only accident. | Mobile CSS promotes open date menus to fixed full-viewport overlays with sticky header/footer regions and preserved range summary and `Done` footer. | `approved` | Preserve the mobile full-screen overlay posture. |
| `DTP-BL-012` | Closed date-picker panels must remain truly hidden in default, mobile, and mixed review states; only the actively opened panel may surface. | Protects the specific hidden-state regression class the parent loop already had to reconcile. | The current implementation keeps `.form-date-menu.hidden` concealed and only applies overlay/mobile layout selectors to `.form-date-menu:not(.hidden)`. | `approved` | Hidden-state guarantees need to stay first-class. |
| `DTP-BL-013` | RTL review must mirror month-navigation glyph direction and preserve readable leading and trailing control placement in both anchored and mobile overlay states. | Ensures directionality reaches the seam’s real navigation grammar instead of stopping at text alignment. | Mobile nav-button pseudo-content flips in `html[dir="rtl"]`, and the broader layout already inherits mirrored direction state from the review controls. | `approved` | Preserve RTL behavior as a real interaction rule. |
| `DTP-BL-014` | The seam must remain reviewable under magnification and theme stress without clipping jump controls, range summaries, or sticky action regions. | Keeps child sign-off honest under the same shared review pressures used elsewhere in the design system. | The current route now has direct browser proof for a dark-theme magnified range state in addition to the inherited theme and magnification controls. | `approved` | Include stress states where they are materially relevant. |
| `DTP-BL-015` | Parent-owned field help/error copy, page-level mobile stacking, and footer workflow actions stay outside this child seam unless a later review explicitly promotes them. | Prevents the child family from becoming a catch-all for surrounding form semantics. | The current picker panels sit inside parent-owned field and page framing that remains stable regardless of which picker variant is active. | `approved` | Parent keeps page framing and action zoning. |

## Exit Criteria For This Step

This behavior lock step is complete when the child-seam rules above are stable
enough to guide:

- the child reference pack
- the proposed child canonical set
- the child verification checklist

Do not treat the `Date Picker` canonical set as the next sign-off gate until
these child behaviors are explicitly reviewed first.

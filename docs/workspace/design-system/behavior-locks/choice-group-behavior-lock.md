# Choice Group Behavior Lock

## Purpose

Lock the behavioral rules for the `Choice Group` child-seam candidate before
treating it as a reusable extracted family from the signed-off `Form Template`
parent.

This artifact governs the grouped radio/checkbox seam itself.
Parent-template rules such as page framing, section cadence, grouped-field
composition, and action zoning stay governed by:

- `docs/workspace/design-system/behavior-locks/form-template-behavior-lock.md`

Do not duplicate those parent behaviors here unless the child seam needs to
reference them explicitly.

## Review Status Legend

- `approved`:
  behavior should be preserved in the child reference pack and later consumers
- `rejected`:
  current behavior should not be treated as the target
- `undecided`:
  behavior still needs iteration before being locked

## Scope

- Family:
  `choice-group`
- Review outcome:
  signed-off child behavior lock
- Current source surface:
  `/design-system/templates/form`
- Host parent family:
  `docs/workspace/design-system/behavior-locks/form-template-behavior-lock.md`
- Related reference pack:
  `docs/workspace/design-system/reference-packs/choice-group-reference-pack.md`
- Related verification checklist:
  `docs/workspace/design-system/verification/choice-group-verification-checklist.md`

## Ownership Boundary

- The parent `Form Template` owns page framing, section cadence, field-row
  placement, helper/error framing outside the fieldset shell, grid-span
  decisions, and release-checklist composition.
- The `Choice Group` seam owns the fieldset shell, legend, stacked choice
  rows, shared row anatomy, and inline group-error slot for grouped selection
  controls.
- The shared-statement checklist remains a `Choice Group` variant, but its
  current release-checklist copy and full-width placement remain parent-owned
  until a later loop proves a more generic host.

## Behavior Review

| ID | Behavior statement | Why it matters | Current implementation note | Status | User feedback |
| --- | --- | --- | --- | --- | --- |
| `CG-BL-001` | `Choice Group` must be governed as a child seam of `Form Template` rather than as a replacement for the whole parent page or section. | Keeps extraction honest and prevents the child seam from absorbing page rhythm too early. | The current grouped-choice surfaces live inside the stable `Preferences` section while the page shell and action rails remain parent-owned. | `approved` | Treat this as a child seam, not a parent page. |
| `CG-BL-002` | The child seam must preserve a semantic fieldset with a visible legend instead of collapsing grouped choices into unrelated standalone rows. | Keeps grouped controls understandable to both visual and assistive-technology users. | The current radios, standard checkboxes, and shared-statement checklist all render as `fieldset` groups with legends. | `approved` | Preserve the fieldset and legend structure. |
| `CG-BL-003` | The seam must preserve two distinct grouped-choice patterns: conventional grouped choices and a shared-statement checklist where one lead statement governs multiple checkbox rows. | Protects the nuanced pattern that motivated this review and prevents flattening everything into one generic checkbox stack. | The current `Checkboxes with shared statement` group uses a lead statement above the row stack instead of repeating that sentence inside each row. | `approved` | Keep the shared-statement pattern distinct. |
| `CG-BL-004` | Each option row must preserve the approved two-part anatomy: native radio or checkbox control plus a copy stack with a primary label and optional supporting description. | Makes the child seam more specific than a bare list of inputs and preserves the reviewed density. | All current grouped-choice rows use a native input with a `strong` label and a secondary line beneath it. | `approved` | Preserve the row anatomy. |
| `CG-BL-005` | Inline group-error treatment belongs to the child seam and must stay attached to the fieldset rather than moving into detached summaries or toast-style feedback. | Keeps validation attributable at the grouped-choice seam boundary. | Each current group exposes a local `.form-group-error` element that appears in parent error review mode. | `approved` | Group errors should stay local. |
| `CG-BL-006` | The seam must support both single-select and multi-select grouping without redefining them as separate families when the fieldset shell and row anatomy remain the same. | Avoids premature fragmentation between radio groups and checkbox groups. | The current route uses the same fieldset and row chassis for both a radio group and checkbox groups. | `approved` | Keep radios and checkboxes in one grouped-choice seam for now. |
| `CG-BL-007` | The shared-statement variant may add one lead statement block above the option stack, but that addition must not replace the legend or the inline group-error slot. | Preserves the nuance without breaking the shared grouped-choice chassis. | The current shared-statement group keeps its legend and group-error element while adding a lead statement block. | `approved` | Add the statement block without replacing the core shell. |
| `CG-BL-008` | Each option row must keep the full row as the practical activation target through native label/control semantics rather than shrinking interaction down to the radio or checkbox glyph alone. | Prevents later extractions from preserving the visual row shell while quietly breaking ease of selection and touch-target size. | The current markup wraps each option row in a `<label>` that contains both the control and copy stack, so clicking the row text still activates the native control. | `approved` | Keep the whole row clickable, not just the small control. |
| `CG-BL-009` | Keyboard focus must stay visibly attributable on grouped-choice rows and remain geometry-safe rather than relying on a barely visible native focus ring or shifting layout when focus enters a row. | Protects keyboard usability and helps later extracted renders stay honest under accessible interaction review. | The current shared form styles use a `:focus-within` treatment on `.form-choice-row` so focused radios or checkboxes visibly highlight the containing row without changing the layout. | `approved` | Preserve clear focus visibility for keyboard users. |
| `CG-BL-010` | Legends, shared-statement copy, row labels, and supporting descriptions must wrap cleanly under long-content, RTL, and narrow-width pressure without clipping, overlap, or breaking the control-to-copy relationship. | Prevents future visual regressions when the seam is reused with real copy that is longer, localized, or denser than the current parent example. | The current row layout uses a control-plus-copy grid with wrapping copy content, but longer-label and localization stress still remain a follow-up review area. | `approved` | Long content should wrap cleanly without breaking the row structure. |
| `CG-BL-011` | Inherited theme states must keep legends, shared-statement copy, row descriptions, row boundaries, and inline group errors distinguishable and readable rather than letting dark or non-default theme treatment flatten the seam into one low-contrast block. | Protects child-seam legibility when later consumers inherit broader theme systems. | The current grouped-choice styles inherit parent theme tokens and still distinguish legend, statement, row, and error surfaces, but child-specific theme stress remains a later proof gap. | `approved` | Theme changes should not flatten the group into unreadable mush. |
| `CG-BL-012` | RTL must preserve a coherent mirrored row relationship: the native control, row copy, spacing, and scanning order should feel intentionally mirrored rather than remaining LTR-biased with only text alignment flipped. | Prevents subtle directionality regressions that make grouped-choice rows feel awkward or misaligned in RTL contexts. | The current rows inherit document direction and parent layout mirroring, but child-specific RTL row review still remains parent-hosted today. | `approved` | Mirror the row relationship, not just the text. |
| `CG-BL-013` | If inherited error and disabled review states appear together, grouped-choice errors must remain readable and attributable while the rows still clearly read as unavailable. | Prevents muddy combined-state visuals where disabled treatment buries the local error message or error styling disguises unavailable controls. | The parent form lock already governs combined review states, and the grouped-choice seam inherits that obligation for its own local error slot and row shell. | `approved` | Error and disabled should both stay legible on grouped choices. |
| `CG-BL-014` | Disabled, mobile, RTL, and theme review states are inherited from the parent template, but the child seam must remain truthful inside them without inventing a separate overlay or layout grammar. | Records the cross-cutting review contexts while keeping host review modes parent-owned. | Current grouped-choice surfaces inherit review-state styling from the parent form shell and remain visible in default, error, and disabled mobile RTL parent proof. | `approved` | Keep cross-cutting review inherited from the parent. |
| `CG-BL-015` | Current full-width placement of the shared-statement checklist is parent-owned host composition, not a permanent child-seam rule. | Prevents today’s host-specific grid decision from becoming accidental API. | The current shared-statement group spans both columns inside the parent grid, but that span comes from the host form layout rather than the fieldset shell itself. | `approved` | Do not freeze host grid-span as child API. |
| `CG-BL-016` | `Choice Group` should not be treated as `system-ready` for broad reuse until it proves a second governed consumer or an approved expansion shows the parent-owned stress states need child-owned routes. | Keeps the signed-off seam from being over-promoted while preserving the approved parent-owned stress boundary. | The seam now has a signed-off child launcher/render surface plus parent-hosted stress proof, but it still lacks a second governed consumer. | `approved` | Signed off now; do not over-promote it yet. |

## Exit Criteria For This Step

This behavior lock step is complete when the child-seam rules above are stable
enough to guide:

- the child reference pack
- the child verification checklist
- the signed-off child canonical set

Do not treat `Choice Group` as `system-ready` until downstream artifacts prove
at least one future consumer beyond the parent form route or an approved
expansion changes the parent-owned stress-state boundary.

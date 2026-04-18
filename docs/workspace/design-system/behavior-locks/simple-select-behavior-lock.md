# Simple Select Behavior Lock

## Purpose

Lock the behavioral rules for the `Simple Select` child seam before treating
its canonical set as the next review gate.

This artifact governs the extracted anchored-listbox seam itself.
Parent-template rules such as page framing, section cadence, helper/error copy,
and overall form review modes stay governed by:

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
  `simple-select`
- Review outcome:
  signed-off child behavior lock
- Current source surface:
  `/design-system/templates/form`
- Host parent family:
  `docs/workspace/design-system/behavior-locks/form-template-behavior-lock.md`
- Related reference pack:
  `docs/workspace/design-system/reference-packs/simple-select-reference-pack.md`
- Related verification checklist:
  `docs/workspace/design-system/verification/simple-select-verification-checklist.md`

## Behavior Review

| ID | Behavior statement | Why it matters | Current implementation note | Status | User feedback |
| --- | --- | --- | --- | --- | --- |
| `SS-BL-001` | The `Simple Select` must be governed as a child seam of `Form Template` rather than as a replacement for the whole parent page or field row. | Keeps child extraction honest and avoids freezing parent-owned page rhythm too early. | The current dropdown lives inside one parent-owned field row within `/design-system/templates/form`, while the page shell and section cadence remain parent-owned. | `approved` | Treat this as a child seam, not a parent page. |
| `SS-BL-002` | The child seam must inherit parent framing from `Form Template`: field label, help text, error slot, spacing, and review-state framing stay parent-owned. | Prevents the seam from quietly absorbing field-row or page-layout ownership. | The current dropdown relies on the parent `.form-field` wrapper and sibling help/error copy rather than owning those surfaces itself. | `approved` | Inherit parent framing from `form-template`. |
| `SS-BL-003` | The at-rest surface must remain a single trigger button that reflects exactly one selected option. | Keeps the seam intentionally lighter than drawer-select and preserves a calm collapsed summary. | The trigger shows one current label sourced from the hidden value and selected option text. | `approved` | Keep this smaller than drawer-select. |
| `SS-BL-004` | Opening the seam must reveal a lightweight anchored listbox directly beneath the trigger instead of converting into a drawer, sheet, or modal treatment. | Protects the reviewed low-friction selection posture and preserves surrounding form context. | The current `.form-select-menu` is absolutely positioned under the trigger inside the field shell and does not introduce scrim, panel chrome, or detached overlay framing. | `approved` | Preserve the lightweight anchored-listbox feel. |
| `SS-BL-005` | Trigger ownership belongs to the child seam: the same trigger opens the listbox, toggles it closed, and truthfully updates `aria-expanded`. | Keeps the open/close contract local to the seam and accessible to assistive tech. | `initializeFormSelects()` toggles `aria-expanded` on the trigger and adds/removes the `hidden` state on the listbox. | `approved` | The seam should own trigger behavior. |
| `SS-BL-006` | The listbox must preserve a single-selection model: choosing an option updates the hidden value, reflects the new label in the trigger, marks only one option selected, and closes the listbox. | Makes the seam dependable as the simplest selection primitive in the family. | The current implementation updates the hidden input, trigger label, `.active` class, and `aria-selected`, then closes the listbox. | `approved` | Selected option reflection belongs here. |
| `SS-BL-007` | Outside click dismissal belongs to the child seam, but that dismissal should not steal focus back from the user’s new outside target. | Preserves natural form continuation while still letting the seam own dismissal. | The document click handler closes the active select when the event target is outside the root, without restoring focus to the trigger. | `approved` | Own outside click dismissal without broad overlay behavior. |
| `SS-BL-008` | Opening the listbox must move focus into the active option list rather than leaving focus parked on the trigger. | Keeps keyboard movement inside the lightweight list seam once it is open and avoids forcing users back through the trigger to traverse options. | The current controller now focuses the selected option, or a boundary option when opened with arrow-key intent. | `approved` | Focus should stay in the list once it opens. |
| `SS-BL-009` | While the listbox is open, `ArrowDown` and `ArrowUp` must move focus through the option stack without closing the seam. | Preserves a calm keyboard traversal model for the lightweight listbox without turning it into a heavier overlay family. | The option buttons now handle `ArrowDown` and `ArrowUp` locally and move focus to the adjacent option. | `approved` | Directional arrows should move up and down the list. |
| `SS-BL-010` | Pressing `Escape` while the listbox is open must close the listbox and return focus to the trigger. | Protects keyboard recovery and gives the seam an explicit owned-close path. | The document `keydown` handler closes the active select on `Escape` with `restoreFocus: true`. | `approved` | `Escape` dismissal and focus return belong to the seam. |
| `SS-BL-011` | Owned close paths triggered from inside the seam, including option selection, must return focus to the trigger when the seam itself owns the close. | Keeps keyboard continuity predictable after an intentional in-component action. | Option-click selection closes with `restoreFocus: true`, putting focus back on the trigger. | `approved` | Return focus to the trigger on owned close. |
| `SS-BL-012` | Peer simple-select surfaces should remain mutually exclusive: opening one simple select closes another open simple select instead of stacking multiple lightweight listboxes. | Prevents small overlays from accumulating and becoming visually noisy inside dense forms. | `initializeFormSelects()` tracks a single `activeFormSelect` and closes a previously open root before opening a new one. | `approved` | Keep the seam calm and predictable. |
| `SS-BL-013` | Disabled, RTL, and theme review states are inherited from the parent template, but the child seam must remain visually truthful within them without inventing new overlay grammar. | Records the cross-cutting review dimensions without letting the child seam redefine parent state models. | The trigger and listbox inherit parent theme and direction styling, while disabled review comes from the parent form-shell state rather than a child-specific API. | `approved` | Keep the child grounded in the parent’s review modes. |
| `SS-BL-014` | The child seam must stay intentionally smaller than drawer-select: no search, no selected-stack summary, no explicit close button, no scrim, no focus trap, and no modal or drawer semantics by default. | Prevents scope creep and keeps the seam boundary distinct from the broader overlay family. | The current dropdown uses only trigger plus listbox, while those broader behaviors live exclusively in `drawer-select`. | `approved` | Do not let it inherit broader overlay behavior from other seams. |

## Exit Criteria For This Step

This behavior lock step is complete when the child-seam rules above are stable
enough to guide:

- the child reference pack
- the child canonical set
- the child verification checklist

Do not treat the `Simple Select` canonical set as the next sign-off gate until
these child behaviors are explicitly reviewed first.

# List Detail Split Layout Behavior Lock

## Purpose

Lock the behavioral rules for the `ListDetailSplitLayout` child seam before
treating its canonical set as the next review gate.

This artifact governs the extracted master-detail layout relationship itself.
Parent-template rules such as selection invalidation, lazy-load choreography,
search state, and shell-level announcements stay governed by:

- `docs/workspace/design-system/behavior-locks/list-page-behavior-lock.md`

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
  `list-detail-split-layout`
- Current source surface:
  `/design-system/templates/list-page`
- Host parent family:
  `docs/workspace/design-system/behavior-locks/list-page-behavior-lock.md`
- Related reference pack:
  `docs/workspace/design-system/reference-packs/list-detail-split-layout-reference-pack.md`
- Related pattern artifact:
  `docs/workspace/design-system/patterns/list-detail-split-layout-pattern.md`
- Related component artifact:
  `docs/workspace/design-system/components/list-detail-split-layout-component.md`
- Related child seams already signed off:
  `docs/workspace/design-system/components/list-record-card-component.md`
  `docs/workspace/design-system/components/list-detail-panel-component.md`

## Behavior Review

| ID | Behavior statement | Why it matters | Current implementation note | Status | User feedback |
| --- | --- | --- | --- | --- | --- |
| `LDSL-BL-001` | The `ListDetailSplitLayout` must be governed as a child seam of `List Page` rather than as a replacement for the whole parent template. | Keeps page-level state and shell behavior separate from the extracted lane relationship. | The current parent route already composes repeated cards plus a detail lane inside one split shell. | `approved` | This seam should cover the lane relationship, not the entire page. |
| `LDSL-BL-002` | On desktop widths with an active record, the seam must present a pushed two-lane layout with the list column on one side and the open detail lane on the other. | Defines the core split-layout reading model that later consumers would share. | The current desktop layout adds the second lane only when the detail surface is open. | `approved` | Keep the desktop pushed split relationship. |
| `LDSL-BL-003` | With no active detail open, the seam must collapse back to a single list lane rather than reserving an empty second column. | Prevents dead layout space and keeps the closed state calm. | The current split layout only applies the second column under `.detail-open`. | `approved` | Closed state should return to one lane. |
| `LDSL-BL-004` | On mobile widths, the detail lane must become a full-sheet overlay that covers the list region inside the seam while remaining beneath shared shell overlays. | Preserves the narrow-width reading model without leaking above shell chrome. | The current mobile CSS switches the detail lane to full-region overlay behavior. | `approved` | Keep the mobile overlay posture. |
| `LDSL-BL-005` | The seam must preserve independent scrolling for the list lane and the detail reading lane rather than collapsing into one mixed scroll surface. | Keeps browsing the list and reading the selected detail usable at the same time. | The current desktop layout gives the list column and detail body their own overflow containers. | `approved` | The two reading lanes should stay independent. |
| `LDSL-BL-006` | The seam must mirror natively in RTL, including which side the detail lane occupies relative to the list lane. | Makes the split relationship itself feel correct in RTL, not just the inner content. | The current parent route already mirrors the open split in RTL with the detail lane on the opposite side. | `approved` | The whole split should mirror, not only the contents inside it. |
| `LDSL-BL-007` | The seam must remain readable under half-page and magnified review pressure without clipping the detail lane or collapsing the list lane into unusable width. | Makes constrained-width and WCAG-related reflow pressure part of the child contract. | The current parent route already proves split readability under `zoom=100` and long content. | `approved` | Keep the split usable under tighter widths and zoom. |
| `LDSL-BL-008` | If preserving a desktop split would squeeze both lanes into unreadable widths under stronger width or magnification pressure, the seam should fall back to the approved overlay or single-lane posture instead of preserving a visibly unusable two-column split. | Prevents the split relationship from surviving past the point where it still helps reading, and turns “don’t let both sides get too squashed” into an explicit governed rule. | The current child preview proves magnified split readability, but it does not yet isolate a dedicated split-to-overlay fallback threshold once both lanes become too constrained. | `approved` | If both sides get too squashed, the drawer should become an overlay. |
| `LDSL-BL-009` | The seam may inherit the signed-off `ListRecordCard` and `ListDetailPanel` internals, but it must not redefine their internal anatomy as part of this child contract. | Prevents the layout child from swallowing previously extracted child seams back into itself. | The current split relationship depends on those inner seams but does not need to own their internal content rules. | `approved` | Let the split own the shell relationship, not the inner card or panel anatomy. |
| `LDSL-BL-010` | Parent-owned behaviors such as search-driven invalidation, lazy-load append policy, live-region announcements, and focus-return choreography must remain outside this child seam unless a later review promotes them. | Keeps the split-layout API honest and avoids accidental parent-state creep. | The current parent route still owns those behaviors in `listPage.mjs`. | `approved` | Keep those parent-state concerns out of this seam for now. |

## Exit Criteria For This Step

This behavior lock step is complete when the child-seam rules above are stable
enough to guide:

- the child reference pack
- the child canonical set
- the child verification checklist

Do not treat the `ListDetailSplitLayout` canonicals as the next sign-off gate
until these child behaviors are explicitly reviewed first.

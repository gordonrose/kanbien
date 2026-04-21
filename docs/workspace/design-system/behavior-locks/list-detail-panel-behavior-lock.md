# List Detail Panel Behavior Lock

## Purpose

Lock the behavioral rules for the `ListDetailPanel` child seam before treating
its canonical set as the next review gate.

This artifact governs the extracted open-detail surface itself.
Parent-template rules such as selection choreography, split placement, mobile
modal semantics, and shell stacking stay governed by:

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
  `list-detail-panel`
- Review outcome:
  signed-off child behavior lock
- Current source surface:
  `/design-system/templates/list-page`
- Host parent family:
  `docs/workspace/design-system/behavior-locks/list-page-behavior-lock.md`
- Related reference pack:
  `docs/workspace/design-system/reference-packs/list-detail-panel-reference-pack.md`
- Related pattern artifact:
  `docs/workspace/design-system/patterns/list-detail-panel-pattern.md`
- Related component artifact:
  `docs/workspace/design-system/components/list-detail-panel-component.md`

## Behavior Review

| ID | Behavior statement | Why it matters | Current implementation note | Status | User feedback |
| --- | --- | --- | --- | --- | --- |
| `LDP-BL-001` | The `ListDetailPanel` must be governed as a child seam of `List Page` rather than as a replacement for the whole parent template. | Keeps child extraction honest and avoids freezing parent-owned layout or shell behavior too early. | The current detail surface already has stable internal anatomy, while parent selection and placement rules remain template-owned. | `approved` | This seam should extract the open detail surface, not the whole page. |
| `LDP-BL-002` | The child seam must preserve three primary internal zones: header, scrollable body, and footer navigation. | Protects the panel’s reading rhythm and keeps controls from drifting into an undifferentiated column. | The current detail surface uses a stacked header/body/footer structure with distinct spacing and hierarchy. | `approved` | Keep the clear three-zone structure. |
| `LDP-BL-003` | The header must keep the copy cluster separate from the action row so title reading and action affordances do not compete for the same visual lane. | Preserves scanability and prevents long titles from collapsing action controls. | The current header places meta, title, and subtitle in one cluster and `Edit`, `Share`, and close controls in another. | `approved` | Keep the copy and actions as separate zones. |
| `LDP-BL-004` | The close control must remain explicit and always available in the header action row rather than being replaced by an implicit shell-level dismissal affordance. | Preserves orientation and gives the child seam a stable explicit close action independent of parent chrome. | The current detail surface uses a clearly labelled close button in the header row. | `approved` | The panel should keep its own clear close affordance. |
| `LDP-BL-005` | The panel body must own the primary overflow lane so long detail content scrolls internally without displacing the header or footer zones. | Keeps reading continuity intact under long content and magnification pressure. | The current implementation uses `.list-page-detail-body` as the dedicated internal overflow container. | `approved` | Internal body scrolling should stay part of the seam. |
| `LDP-BL-006` | Compact metadata may truncate with tooltip recovery, while the title and long-form body content should wrap rather than ellipsize. | Preserves hierarchy and prevents unreadable identity fields under constrained width. | The current surface truncates header metadata and wraps title and body copy in the governed long-content state. | `approved` | Metadata can truncate, but title and body should read naturally. |
| `LDP-BL-007` | Missing optional secondary fields such as metadata, subtitle, or tags should be omitted cleanly rather than replaced with noisy placeholders. | Keeps the panel resilient when incomplete records are selected. | The parent route already exercises omission behavior in the missing-attributes state. | `approved` | Omit absent secondary chrome cleanly. |
| `LDP-BL-008` | If detail content fails, the child seam must keep the panel frame open and show a local error treatment inside the body rather than collapsing the surface. | Preserves the user’s place in the reading flow and scopes the failure honestly to the detail content. | The current detail error state stays inside the panel body and preserves header/footer chrome. | `approved` | The error should stay local to the panel. |
| `LDP-BL-009` | The footer should keep the calmer `Previous` and `Next` traversal model instead of adding extra positional chrome by default. | Maintains the reviewed lightweight traversal posture for the child seam. | The current footer uses only `Previous` and `Next`. | `approved` | Keep the simple footer navigation. |
| `LDP-BL-010` | Terminal navigation states must be honest: when no next record remains, `Next` should disable and may expose a clear terminal hint such as `Last item`. | Prevents silent dead-end controls and keeps boundary behavior legible. | The current parent behavior already uses a disabled terminal next state with tooltip support. | `approved` | Boundary navigation should communicate the true end state. |
| `LDP-BL-011` | In RTL, the child seam must mirror header action ordering, copy alignment, and footer navigation order coherently rather than mirroring only the outer parent split. | Ensures the detail surface itself feels native in RTL contexts. | The current parent route already verifies mirrored header and footer control order in RTL. | `approved` | The panel’s own controls should mirror coherently. |
| `LDP-BL-012` | The child seam must remain readable under magnified and half-page review widths without clipping essential actions or collapsing the footer. | Makes magnification and constrained-width pressure explicit child-level rules. | The current long-content parent state already proves the detail surface under higher reading pressure. | `approved` | Keep the panel usable under tighter widths and zoom. |
| `LDP-BL-012A` | When magnified or long-content pressure makes the expanded header disproportionately tall, the child seam may automatically condense secondary header chrome after body scrolling begins, and restore the full header again near the top. | Gives the reading lane more space without permanently hiding context before the user has actually moved into the body content. | The child seam now supports scroll-triggered header compaction that hides subtitle, tightens header spacing, and reduces title scale only after the body scroll lane becomes active. | `approved` | Let the header compact itself once reading has clearly moved into the body. |
| `LDP-BL-013` | The child seam must preserve semantic orientation through a labelled detail region and explicit accessible names for close and footer controls. | Prevents accessibility from being treated as only a parent-template concern. | The current surface uses a labelled region and explicit control labels. | `approved` | Semantic orientation should remain part of the child contract. |
| `LDP-BL-014` | Focus-visible states on action, close, and footer controls must stay clear without shifting panel geometry. | Protects keyboard usability and WCAG-relevant visibility under child-level review. | The current control styling keeps focus and hover emphasis geometry-safe. | `approved` | Focus should be obvious and stable. |
| `LDP-BL-015` | Parent-owned behaviors such as open/close choreography, focus return to the originating card, mobile dialog semantics, and shell stacking must remain outside this child seam unless a later review explicitly promotes them. | Keeps the seam boundary honest and prevents accidental API creep. | The current child canonicals intentionally exclude parent-owned modal and shell framing behaviors. | `approved` | Keep those parent concerns out of this seam for now. |

## Exit Criteria For This Step

This behavior lock step is complete when the child-seam rules above are stable
enough to guide:

- the child reference pack
- the child canonical set
- the child verification checklist

Do not treat the `ListDetailPanel` canonicals as the next sign-off gate until
these child behaviors are explicitly reviewed first.

Behavior-lock sign-off is now recorded for this child seam. The next review
gate is the child reference pack and then the `LDP-*` canonical set.

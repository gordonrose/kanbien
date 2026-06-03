# Record List Default Proof

Layer: `04-pattern-contract`

Pattern: `record-list`

Status: `review-ready`

| Field | Value |
| --- | --- |
| Shared contract | `docs/design-system/04-pattern-contract/shared/record-list/RecordList-Contract.md` |
| Runtime seam | `src/frontend/designSystem/layers/04-pattern-contract/record-list/index.mjs#recordListPattern` |
| Proof route | `/design-system/default/patterns/record-list` |
| Required primitives | `record-list-item-control`; `detail-slot-control`; `resize-handle-control` |
| Direct token dependencies | `not-applicable; detail-slot values consumed through primitive` |

## Proof Controls

| Control | Purpose | Boundary |
| --- | --- | --- |
| Theme | Proves child row primitive and detail-slot primitive consume signed theme variants. | Runtime input |
| Direction | Proves list/detail composition remains reachable in LTR and RTL. | Proof-only diagnostic pressure |
| Width | Proves desktop split and constrained/narrow review behavior. | Proof-only diagnostic pressure |
| Ratio | Proves `1:2`, `1:4`, and `1:5` list-to-detail starting column variants. | Runtime input |
| Fixture count | Proves empty state, short list, and longer list reorder behavior. | Proof-only diagnostic pressure |

## Scroll And Responsive Ownership

The proof route owns page scrolling. The pattern owns the detail-slot open and
closed posture plus the initial list-to-detail ratio. The resize primitive owns
manual separator behavior. The list itself uses normal document flow in this
Layer 4 contract; fixed-height internal scrolling is deferred until a later
panel or page composition asks for it with signed scroll ownership.

On mobile review, the detail slot becomes a full-width overlay area within the
proof surface. This is pattern proof evidence for detail-slot reachability, not
an app route adoption rule.

## Evidence Requirements

Rendered proof must verify:

- row open updates the detail slot
- close action closes the detail slot
- primitive drag/keyboard move events reorder the displayed list
- empty state renders without fake rows
- no local row markup replaces `record-list-item-control`
- no local detail-slot aside markup replaces `detail-slot-control`
- no local resize behavior replaces `resize-handle-control`

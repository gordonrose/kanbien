# NestedEntityRecord Behavior Lock

## Scope

`NestedEntityRecord` is the reusable bounded frame for placing the signed-off
entity record body inside another entity or workflow surface.

## Behavior Contract

- `NER-001`: The nested frame consumes the shared entity record body seam rather
  than rebuilding entity page anatomy locally.
- `NER-002`: The frame has a visible bounded shell that distinguishes the nested
  record from the host page.
- `NER-003`: The nested record exposes a horizontal resize affordance for frame
  width review.
- `NER-004`: The nested record exposes a bottom resize affordance for frame
  height review.
- `NER-005`: The embedded entity body preserves its header, index, panel, and
  nested panel-index relationships.
- `NER-006`: Mobile layer preview follows the entity-page structure mobile
  layer model.
- `NER-007`: Extended content proves scroll ownership inside structural regions
  without adding domain content.
- `NER-008`: Theme, accent, direction, and magnification inherit from the
  design-system shell.
- `NER-009`: Resize handles are labeled and do not imply production drag
  behavior beyond the approved structure review.
- `NER-010`: The seam does not define actual child records, field layouts,
  evidence panels, or relationship workflows.

## Adoption Rule

Nested record consumers must preserve the bounded frame and shared entity-body
composition unless a future design-system loop approves a different nested
record container.

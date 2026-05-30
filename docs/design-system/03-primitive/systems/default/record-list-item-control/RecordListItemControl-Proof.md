# Default Record List Item Control Proof

Layer: `03-primitive`
Status: `review-ready`
System key: `default`

## Governed Route

`/design-system/default/primitives/record-list-item-control`

## Proof Coverage

The proof route exposes default, selected, disabled, long text, dragging, and
drop-marker states across original, dark, desert, RTL, and constrained widths.
Row states consume `record-list-item-frame`; drag source, preview, and marker
states consume `drag-drop-affordance-frame`.

It emits open and move events to a proof log so reviewers can verify click,
keyboard, and drag behavior without inspecting source.

## Boundary

The proof intentionally renders a placeholder detail panel instead of an
entity drawer. Drawer composition belongs to the later list pattern contract.

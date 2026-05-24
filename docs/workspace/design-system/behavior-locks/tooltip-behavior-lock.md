# Tooltip Behavior Lock

## Scope

`Tooltip` is the reusable lightweight explanatory overlay seam for controls and
truncated labels.

## Behavior Contract

- `TTP-001`: Tooltip surface uses the approved tooltip background, foreground,
  shadow, radius, arrow, max size, and layer variables.
- `TTP-002`: Tooltip text uses the paragraph main-minor typography seam.
- `TTP-003`: Top, right, bottom, and left placements are represented.
- `TTP-004`: Long tooltip content is bounded by max width and max height.
- `TTP-005`: Tooltip triggers use `data-tooltip` anchors rather than native
  title attributes as the governed path.
- `TTP-006`: Tooltip content does not replace accessible names or visible
  labels.
- `TTP-007`: Tooltip layering must sit above the local control surface without
  becoming a modal or drawer.
- `TTP-008`: Tooltip behavior is explanatory only; it must not carry critical
  form errors, destructive confirmations, or hidden required instructions.

## Adoption Rule

Consumers must use the shared tooltip layer and keep primary accessibility
semantics on the triggering control or label.

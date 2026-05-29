# Default Textarea Control Proof

## Status

Review-ready for the `default` design system.

## Rendered Proof

View the proof route at `/design-system/default/primitives/textarea-control`.

The proof route exposes review controls for native state, growth variant, value
pressure, label length, direction, and constrained width.

Browser evidence must verify that:

- `one-line`, `multi-line`, and `paragraph` variants change the signed row
  preset and viewport growth cap.
- `default`, `required`, `read-only`, `disabled`, and `error` states update
  native textarea semantics and consume the matching `text-control-frame`
  variant.
- long labels use the shared truncating-label disclosure behavior instead of
  overlapping the field row.
- overflowing textarea content grows until the signed cap and then keeps
  keyboard-accessible internal scrolling.

# Default Field Row Control Proof

## Status

Review-ready for the `default` design system.

## Rendered Proof

View the proof route at `/design-system/default/primitives/field-row-control`.

## Evidence

The proof route renders the primitive through the shared runtime seam and consumes signed Layer 2 field-row, label, and supporting-text tokens.

The field label is rendered through the governed `truncating-label` primitive so constrained labels disclose full text only when actually truncated.

Error text renders through the signed `error-text-style` token rather than borrowing helper/supporting text styling.

The route includes controls for state, helper/error visibility, direction, label length, width, and slot posture. These controls are proof-only and must change rendered evidence.

The default proof slot renders state evidence for each allowed state without creating a native input, textarea, selector, radio, toggle, accordion, or workflow builder.

The proof does not create a text input or any other native control.

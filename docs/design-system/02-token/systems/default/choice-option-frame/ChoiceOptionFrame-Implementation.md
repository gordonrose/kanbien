# Choice Option Frame Default Implementation

## Implementation Metadata

| Field | Value |
| --- | --- |
| Token status | `review-ready` |
| System key | `default` |
| Shared contract | `docs/design-system/02-token/shared/choice-option-frame/ChoiceOptionFrame-Contract.md` |
| Runtime seam | `src/frontend/designSystem/layers/02-token/choice-option-frame/systems/default.mjs#choiceOptionFrameTokenSpec` |
| Proof module | `src/frontend/designSystem/systems/default/tokens/proofs/choiceOptionFrame.tokens.mjs` |
| Rendered view | `/design-system/default/tokens/choice-option-frame` |

## Implementation Decision

The default system derives choice-option frames from signed body-region, primary-tint, error-text, label-text, supporting-text, and minimum-target-size tokens.

Default option frames inherit the body-region surface. Selected option frames use the primary tinted background and foreground tokens. Disabled option frames mix the body-region foreground into the body-region surface so disabled meaning is visually subdued without inventing standalone grey values. Error option frames use the signed error text foreground as the error source and keep the body-region surface as the host.

The token intentionally does not choose radio indicator styling, native control semantics, option-grid columns, or text-disclosure behavior. Those remain blocked until Layer 3 primitive work consumes this token with the existing lower-layer text and focus seams.

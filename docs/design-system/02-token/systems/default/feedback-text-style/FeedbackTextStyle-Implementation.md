# Feedback Text Style Default Implementation

## Implementation Metadata

| Field | Value |
| --- | --- |
| Token status | `review-ready` |
| System key | `default` |
| Shared contract | `docs/design-system/02-token/shared/feedback-text-style/FeedbackTextStyle-Contract.md` |
| Runtime seam | `src/frontend/designSystem/layers/02-token/feedback-text-style/systems/default.mjs#feedbackTextStyleTokenSpec` |
| Proof module | `src/frontend/designSystem/systems/default/tokens/proofs/feedbackTextStyle.tokens.mjs` |
| Rendered view | `/design-system/default/tokens/feedback-text-style` |

## Implementation Decision

The default system uses compact, readable feedback text for short panel and
pattern messages. Neutral feedback derives foreground from the signed theme
surface foreground. Warning feedback derives from signed warning status colour.
Error feedback derives from the signed themed text-control error foreground.

Typography is implemented as a default-system token value so downstream
patterns can consume one governed feedback text recipe instead of inventing
message styling locally.

## Variant Set

| Variant | Tone | Theme | Source |
| --- | --- | --- | --- |
| `feedback-text-style-neutral-original` | `neutral` | `original` | `--background-surface-original` |
| `feedback-text-style-warning-original` | `warning` | `original` | `--status-color-warning-original` |
| `feedback-text-style-error-original` | `error` | `original` | `--text-control-frame-error-original` |
| `feedback-text-style-neutral-dark` | `neutral` | `dark` | `--background-surface-dark` |
| `feedback-text-style-warning-dark` | `warning` | `dark` | `--status-color-warning-dark` |
| `feedback-text-style-error-dark` | `error` | `dark` | `--text-control-frame-error-dark` |
| `feedback-text-style-neutral-desert` | `neutral` | `desert` | `--background-surface-desert` |
| `feedback-text-style-warning-desert` | `warning` | `desert` | `--status-color-warning-desert` |
| `feedback-text-style-error-desert` | `error` | `desert` | `--text-control-frame-error-desert` |

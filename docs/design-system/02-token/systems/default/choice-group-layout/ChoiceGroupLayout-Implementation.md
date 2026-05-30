# Choice Group Layout Default Implementation

## Implementation Metadata

| Field | Value |
| --- | --- |
| Token status | `review-ready` |
| System key | `default` |
| Shared contract | `docs/design-system/02-token/shared/choice-group-layout/ChoiceGroupLayout-Contract.md` |
| Runtime seam | `src/frontend/designSystem/layers/02-token/choice-group-layout/systems/default.mjs#choiceGroupLayoutTokenSpec` |
| Proof module | `src/frontend/designSystem/systems/default/tokens/proofs/choiceGroupLayout.tokens.mjs` |
| Rendered view | `/design-system/default/tokens/choice-group-layout` |

## Implementation Decision

The default system exposes four requested column-count variants. Row and column gaps derive from the signed body-region content gap so choice groups align with form-panel spacing. The option collapse threshold is a choice-group layout decision and exists to prevent later primitives from keeping too many columns when each option would become too narrow to review safely.

The token does not perform responsive collapse itself. It signs the requested layout values and collapse threshold that the primitive may consume and prove.

# Primary Tinted Background Contract

## Token Metadata

| Field | Value |
| --- | --- |
| Contract scope | `shared across design systems` |
| UI family | `primary-tinted-background` |
| Harness layer | `02-token` |
| Contract status | `review-ready` |
| Behavior rule path | `docs/design-system/01-behavior-rule/shared/entity-body-placement/EntityBodyPlacement-Behaviour.md` |
| Contract artifact path | `docs/design-system/02-token/shared/primary-tinted-background/PrimaryTintedBackground-Contract.md` |
| Reference implementation | `docs/design-system/02-token/systems/default/primary-tinted-background/PrimaryTintedBackground-Implementation.md` |
| Files affected now | `docs/design-system/02-token/shared/primary-tinted-background/PrimaryTintedBackground-Contract.md` |

## Purpose

This shared contract defines a low-emphasis primary-tinted background derived
from the selected design system's `primary-color-source`.

It does not define selected, active, warning, error, success, or validation
meaning. Those states require separate governed token decisions.

## Shared Token Contract

| Field | Value |
| --- | --- |
| Contract module | `src/frontend/designSystem/layers/02-token/primary-tinted-background/contract.mjs` |
| Contract export | `primaryTintedBackgroundTokenContract` |
| Derived from | `tokens.primary-color-source` |
| Required roles | `primary tinted subtle background` |
| Required themes | `original`, `dark`, `desert` |
| Required value fields | `backgroundRole`, `sourceTokenId`, `sourceTokenName`, `sourceColorValue`, `backgroundValue`, `foregroundPairing`, `contrastRequirement`, `themeMapping`, `stateMapping` |

## Cross-System Rule

Every design system may choose different source colors and tint formulas, but
it must preserve the derived relationship to `primary-color-source`, theme
proof, consumer restrictions, and foreground-pairing requirements.

## Consumer Restrictions

Consumers must not hard-code primary tint values that this contract governs.

Consumers must not use this token as selected, active, warning, error, success,
or validation meaning.

Consumers must not place text on this tint without an approved foreground token
pairing in the consuming primitive or pattern.

Rendered proof pages may expose a temporary upstream source override to review
derivation behavior. That override is diagnostic only and must not replace the
signed system implementation value.

Consumers must not consume a system implementation unless the readiness index
marks both the shared contract and that system implementation as review-ready or
accepted.

## Storage And Consumption Plan

| Field | Value |
| --- | --- |
| Store this shared contract at | `docs/design-system/02-token/shared/primary-tinted-background/PrimaryTintedBackground-Contract.md` |
| Shared contract lookup key | `shared/primary-tinted-background/02-token-contract` |
| Current proof system | `default` |
| Current proof artifact | `docs/design-system/02-token/systems/default/primary-tinted-background/PrimaryTintedBackground-Implementation.md` |
| What later layers preserve | Later layers preserve source-token dependency, theme mappings, foreground-pairing rule, and consumer restrictions unless a token contract revision is approved. |
| What must not consume it | Runtime UI modules must not import this governance artifact. |
| Required next eval | `02-token/EVAL.md` |
| Required accessibility eval | `02-token/ACCESSIBILITY-EVAL.md` |

## Next Layer

| Field | Value |
| --- | --- |
| Next expected layer | `02-token` or `03-primitive` |
| Next layer status | `allowed for systems with review-ready implementations, but text-bearing use still needs approved foreground tokens` |
| Reason | `primary-tinted-background` defines the background tint only. It does not by itself prove text color, selected state, or status meaning. |

# Focus Ring Contract

## Token Metadata

| Field | Value |
| --- | --- |
| Contract scope | `shared across design systems` |
| UI family | `focus-ring` |
| Harness layer | `02-token` |
| Contract status | `review-ready` |
| Behavior rule path | `docs/design-system/01-behavior-rule/shared/entity-body-placement/EntityBodyPlacement-Behaviour.md` |
| Contract artifact path | `docs/design-system/02-token/shared/focus-ring/FocusRing-Contract.md` |
| Reference implementation | `docs/design-system/02-token/systems/default/focus-ring/FocusRing-Implementation.md` |
| Files affected now | `docs/design-system/02-token/shared/focus-ring/FocusRing-Contract.md` |

## Purpose

This shared contract defines what a focus-ring token implementation must
preserve before interactive primitives may consume it.

It does not choose design-system-specific focus colors or CSS values. Each
design system proves its own focus-ring values in
`docs/design-system/02-token/systems/<system-key>/`.

## Shared Token Contract

| Field | Value |
| --- | --- |
| Contract module | `src/frontend/designSystem/contracts/tokens/focusRing.contract.mjs` |
| Contract export | `focusRingTokenContract` |
| Required roles | `visible focus ring` |
| Required themes | `original`, `dark`, `desert` |
| Required variant fields | `id`, `tokenName`, `value`, `preview`, `metadata`, `useCaseInstructions` |
| Required value fields | `focusRole`, `sourceTokenId`, `sourceTokenName`, `sourceColorValue`, `ringValue`, `offsetValue`, `contrastRequirement`, `themeMapping`, `layoutImpact` |

## Cross-System Rule

Every design system may choose different focus-ring values, but it must
preserve visible keyboard focus, theme-specific proof, layout-stable rendering,
the declared primary source-color dependency, and the same consumer
restrictions before downstream primitives or patterns consume the token.

## Consumer Restrictions

Consumers must not hard-code focus-ring values that this contract governs.

Consumers must not use color alone as the only carrier of selected, active,
error, or status meaning.

Consumers must not treat a system implementation as a new shared contract.

Consumers must not consume a system implementation unless the readiness index
marks both the shared contract and that system implementation as review-ready or
accepted.

## Storage And Consumption Plan

| Field | Value |
| --- | --- |
| Store this shared contract at | `docs/design-system/02-token/shared/focus-ring/FocusRing-Contract.md` |
| Shared contract lookup key | `shared/focus-ring/02-token-contract` |
| Current proof system | `default` |
| Current proof artifact | `docs/design-system/02-token/systems/default/focus-ring/FocusRing-Implementation.md` |
| What later layers preserve | Later layers preserve the shared role, themes, required fields, cross-system rule, and consumer restrictions unless a token contract revision is approved. |
| What must not consume it | Runtime UI modules must not import this governance artifact. |
| Required next eval | `02-token/EVAL.md` |
| Required accessibility eval | `02-token/ACCESSIBILITY-EVAL.md` |

## Next Layer

| Field | Value |
| --- | --- |
| Next expected layer | `03-primitive` |
| Next layer status | `allowed for systems with review-ready implementations` |
| Reason | `focus-ring` has a shared contract and may be consumed by later layers only for system implementations listed as consumable in the readiness index. |

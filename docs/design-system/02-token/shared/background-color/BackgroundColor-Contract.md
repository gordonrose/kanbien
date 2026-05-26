# Background Color Contract

## Token Metadata

| Field | Value |
| --- | --- |
| Contract scope | `shared across design systems` |
| UI family | `background-color` |
| Harness layer | `02-token` |
| Contract status | `review-ready` |
| Behavior rule path | `docs/design-system/01-behavior-rule/shared/colours/Colours-Behaviour.md` |
| Contract artifact path | `docs/design-system/02-token/shared/background-color/BackgroundColor-Contract.md` |
| Reference implementation | `docs/design-system/02-token/systems/default/background-color/BackgroundColor-Implementation.md` |
| Files affected now | `docs/design-system/02-token/shared/background-color/BackgroundColor-Contract.md` |

## Purpose

This shared contract defines what a background-color token implementation must
preserve before later layers may consume it.

It does not choose design-system-specific color values. Each design system
proves its own values in `docs/design-system/02-token/systems/<system-key>/`.

## Shared Token Contract

| Field | Value |
| --- | --- |
| Contract module | `src/frontend/designSystem/layers/02-token/background-color/contract.mjs` |
| Contract export | `backgroundColorTokenContract` |
| Required roles | `page foundation`, `surface foundation`, `subtle foundation` |
| Required themes | `original`, `dark`, `desert` |
| Required variant fields | `id`, `tokenName`, `value`, `preview`, `metadata`, `useCaseInstructions` |

## Cross-System Rule

Every design system may choose different background values, but it must preserve
the same background roles, theme identities, metadata fields, and consumer
restrictions before downstream primitives or patterns consume the token.

Neutral page, surface, and subtle foundations do not automatically consume the
primary color source. Primary-tinted backgrounds must be defined as a separate
derived token decision so they can prove contrast and state meaning without
changing neutral background roles.

## Consumer Restrictions

Consumers must not hard-code background color values that this contract governs.

Consumers must not treat a system implementation as a new shared contract.

Consumers must not consume a system implementation unless the readiness index
marks both the shared contract and that system implementation as review-ready or
accepted.

## Storage And Consumption Plan

| Field | Value |
| --- | --- |
| Store this shared contract at | `docs/design-system/02-token/shared/background-color/BackgroundColor-Contract.md` |
| Shared contract lookup key | `shared/background-color/02-token-contract` |
| Current proof system | `default` |
| Current proof artifact | `docs/design-system/02-token/systems/default/background-color/BackgroundColor-Implementation.md` |
| What later layers preserve | Later layers preserve the shared roles, themes, required fields, cross-system rule, and consumer restrictions unless a token contract revision is approved. |
| What must not consume it | Runtime UI modules must not import this governance artifact. |
| Required next eval | `02-token/EVAL.md` |
| Required accessibility eval | `02-token/ACCESSIBILITY-EVAL.md` |

## Next Layer

| Field | Value |
| --- | --- |
| Next expected layer | `03-primitive` |
| Next layer status | `allowed for systems with review-ready implementations` |
| Reason | `background-color` has a shared contract and a review-ready `default` implementation seam. |

# Primary Color Source Contract

## Token Metadata

| Field | Value |
| --- | --- |
| Contract scope | `shared across design systems` |
| UI family | `primary-color-source` |
| Harness layer | `02-token` |
| Contract status | `review-ready` |
| Behavior rule path | `docs/design-system/01-behavior-rule/shared/entity-body-placement/EntityBodyPlacement-Behaviour.md` |
| Contract artifact path | `docs/design-system/02-token/shared/primary-color-source/PrimaryColorSource-Contract.md` |
| Reference implementation | `docs/design-system/02-token/systems/default/primary-color-source/PrimaryColorSource-Implementation.md` |
| Files affected now | `docs/design-system/02-token/shared/primary-color-source/PrimaryColorSource-Contract.md` |

## Purpose

This shared contract defines the source color a design system uses for its
primary accent family before downstream color tokens derive text, focus,
selected, or subtle-background values from it.

It does not define those derived semantic colors. Each derived token must name
its own role, accessibility evidence, and consumer restrictions.

## Shared Token Contract

| Field | Value |
| --- | --- |
| Contract module | `src/frontend/designSystem/contracts/tokens/primaryColorSource.contract.mjs` |
| Contract export | `primaryColorSourceTokenContract` |
| Token type template | `color-palette` |
| Required roles | `primary color source` |
| Required themes | `original`, `dark`, `desert` |
| Required variant fields | `id`, `tokenName`, `value`, `preview`, `metadata`, `useCaseInstructions` |
| Required value fields | `paletteRole`, `scaleStep`, `colorValue`, `colorSpace`, `themeMapping`, `allowedDerivations` |

## Cross-System Rule

Every design system may choose a different primary source value, but it must
preserve the role of that value as the approved root for downstream primary
color derivations.

Changing this token may change derived focus, text, selected, and subtle
background tokens, but it must not silently change primitive behavior,
accessibility semantics, or consumer contracts.

## Consumer Restrictions

Consumers must not hard-code primary accent literals that this contract
governs.

Consumers must not treat the source color as sufficient evidence for readable
text, focus visibility, selected state, warning, error, or success meaning.
Those require their own governed derived tokens.

Consumers must not consume a system implementation unless the readiness index
marks both the shared contract and that system implementation as review-ready or
accepted.

## Storage And Consumption Plan

| Field | Value |
| --- | --- |
| Store this shared contract at | `docs/design-system/02-token/shared/primary-color-source/PrimaryColorSource-Contract.md` |
| Shared contract lookup key | `shared/primary-color-source/02-token-contract` |
| Current proof system | `default` |
| Current proof artifact | `docs/design-system/02-token/systems/default/primary-color-source/PrimaryColorSource-Implementation.md` |
| What later layers preserve | Later layers preserve the shared role, themes, required fields, cross-system rule, and consumer restrictions unless a token contract revision is approved. |
| What must not consume it | Runtime UI modules must not import this governance artifact. |
| Required next eval | `02-token/EVAL.md` |
| Required accessibility eval | `02-token/ACCESSIBILITY-EVAL.md` |

## Next Layer

| Field | Value |
| --- | --- |
| Next expected layer | `02-token` |
| Next layer status | `derive semantic, text, selected, or focus token revisions from this source before primitives rely on those meanings` |
| Reason | `primary-color-source` is an upstream color source. It makes downstream derivation governable, but it does not by itself prove contrast, focus visibility, or state meaning. |

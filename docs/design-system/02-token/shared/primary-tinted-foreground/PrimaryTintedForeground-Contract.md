# Primary Tinted Foreground Contract

## Token Metadata

| Field | Value |
| --- | --- |
| Contract scope | `shared across design systems` |
| UI family | `primary-tinted-foreground` |
| Harness layer | `02-token` |
| Contract status | `review-ready` |
| Behavior rule path | `docs/design-system/01-behavior-rule/shared/entity-body-placement/EntityBodyPlacement-Behaviour.md` |
| Contract artifact path | `docs/design-system/02-token/shared/primary-tinted-foreground/PrimaryTintedForeground-Contract.md` |
| Reference implementation | `docs/design-system/02-token/systems/default/primary-tinted-foreground/PrimaryTintedForeground-Implementation.md` |
| Files affected now | `docs/design-system/02-token/shared/primary-tinted-foreground/PrimaryTintedForeground-Contract.md` |

## Purpose

This shared contract defines foreground text that may sit on
`primary-tinted-background` variants.

It does not define general body text, links, selected state, active state,
warning, error, success, or validation meaning.

## Shared Token Contract

| Field | Value |
| --- | --- |
| Contract module | `src/frontend/designSystem/contracts/tokens/primaryTintedForeground.contract.mjs` |
| Contract export | `primaryTintedForegroundTokenContract` |
| Token type template | `text-color` |
| Derived from | `tokens.primary-tinted-background` |
| Required roles | `primary foreground on primary tint` |
| Required themes | `original`, `dark`, `desert` |
| Required value fields | `textRole`, `backgroundTokenId`, `backgroundTokenName`, `backgroundValue`, `colorValueOrMapping`, `contrastRequirement`, `themeMapping`, `stateMapping`, `allowedContent` |

## Cross-System Rule

Every design system may choose different foreground values, but it must preserve
the explicit pairing with `primary-tinted-background`, theme proof, consumer
restrictions, and readable text evidence before downstream primitives consume
the token.

## Consumer Restrictions

Consumers must not hard-code foreground values that this contract governs.

Consumers must not use this token as selected, active, warning, error, success,
validation, or link meaning.

Consumers must not use this foreground on unapproved backgrounds.

Rendered proof pages may expose a temporary upstream source override to review
the dependency chain from `primary-color-source` through
`primary-tinted-background` to this foreground. That override is diagnostic
only and must not replace the signed system implementation formulas.

## Next Layer

| Field | Value |
| --- | --- |
| Next expected layer | `03-primitive` |
| Next layer status | `allowed for primitives that need short primary labels on primary-tinted backgrounds` |
| Reason | The foreground and background pairing is now explicit for the `default` system, but primitive behavior and semantics still need Layer 3 contracts. |

# Label Text Style Contract

## Token Metadata

| Field | Value |
| --- | --- |
| Contract scope | `shared across design systems` |
| UI family | `label-text-style` |
| Harness layer | `02-token` |
| Contract status | `review-ready` |
| Behavior rule path | `docs/design-system/01-behavior-rule/shared/text-overflow-disclosure/TextOverflowDisclosure-Behaviour.md` |
| Contract artifact path | `docs/design-system/02-token/shared/label-text-style/LabelTextStyle-Contract.md` |
| Reference implementation | `docs/design-system/02-token/systems/default/label-text-style/LabelTextStyle-Implementation.md` |

## Purpose

This shared contract defines a complete typography style for short labels.

It does not define label color, truncation behavior, tooltip disclosure,
selected state, error text, body text, or link text.

## Shared Token Contract

| Field | Value |
| --- | --- |
| Contract module | `src/frontend/designSystem/contracts/tokens/labelTextStyle.contract.mjs` |
| Contract export | `labelTextStyleTokenContract` |
| Token type template | `text-style` |
| Required roles | `short label text` |
| Required themes | `all` |
| Required value fields | `textStyleRole`, `fontFamilyValue`, `fontFallbackRule`, `fontSizeValue`, `fontWeightValue`, `lineHeightValue`, `letterSpacingValue`, `textTransform`, `overflowReadiness`, `zoomBehavior` |

## Cross-System Rule

Every design system may choose different typography values, but it must
preserve the short-label role, the complete style grouping, no negative letter
spacing, zoom readability, a complete font fallback stack, and the rule that
truncation behavior belongs to `text-overflow-disclosure` and later primitive
or pattern work.

## Consumer Restrictions

Consumers must not hard-code local font size, weight, line height, letter
spacing, or font family values for governed short labels.

Consumers must preserve the complete font family fallback stack instead of
extracting only the preferred font.

Consumers must not treat this token as a foreground color, body text, status
text, error text, link text, selected state, or tooltip behavior.

Consumers must preserve `text-overflow-disclosure` when labels can truncate.

## Next Layer

| Field | Value |
| --- | --- |
| Next expected layer | `03-primitive` |
| Next layer status | `allowed for narrow text/label primitives that do not need tooltip disclosure yet` |
| Reason | Short-label typography is now governed, but full truncation disclosure still needs tooltip/disclosure tokens and primitive behavior. |

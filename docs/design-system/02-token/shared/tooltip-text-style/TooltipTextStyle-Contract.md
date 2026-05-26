# Tooltip Text Style Contract

## Token Metadata

| Field | Value |
| --- | --- |
| Contract scope | `shared across design systems` |
| UI family | `tooltip-text-style` |
| Harness layer | `02-token` |
| Contract status | `review-ready` |
| Behavior rule path | `docs/design-system/01-behavior-rule/shared/text-overflow-disclosure/TextOverflowDisclosure-Behaviour.md` |
| Contract artifact path | `docs/design-system/02-token/shared/tooltip-text-style/TooltipTextStyle-Contract.md` |
| Reference implementation | `docs/design-system/02-token/systems/default/tooltip-text-style/TooltipTextStyle-Implementation.md` |

## Purpose

This shared contract defines a complete typography style for full-text
disclosure content inside governed tooltip surfaces.

It does not define tooltip surface color, trigger behavior, placement,
dismissal, ARIA behavior, selected state, validation state, body text, compact
label text, or link text.

## Shared Token Contract

| Field | Value |
| --- | --- |
| Contract module | `src/frontend/designSystem/layers/02-token/tooltip-text-style/contract.mjs` |
| Contract export | `tooltipTextStyleTokenContract` |
| Token type template | `text-style` |
| Required roles | `tooltip disclosure text` |
| Required themes | `all` |
| Required value fields | `textStyleRole`, `fontFamilyValue`, `fontFallbackRule`, `fontSizeValue`, `fontWeightValue`, `lineHeightValue`, `letterSpacingValue`, `textTransform`, `overflowReadiness`, `zoomBehavior` |

## Cross-System Rule

Every design system may choose different typography values, but it must
preserve the tooltip disclosure text role, the complete style grouping, a
complete font fallback stack, readable wrapping inside the tooltip surface,
no negative letter spacing, zoom readability, and the rule that trigger
behavior belongs to `03-primitive` or later.

## Consumer Restrictions

Consumers must not hard-code local font size, weight, line height, letter
spacing, or font family values for governed tooltip disclosure text.

Consumers must preserve the complete font family fallback stack instead of
extracting only the preferred font.

Consumers must pair this token with approved `tooltip-surface` foreground and
background values before rendering full disclosure text.

Consumers must not treat this token as tooltip trigger behavior, placement,
dismissal, ARIA behavior, compact label text, body text, status text, error
text, link text, selected state, or validation meaning.

## Next Layer

| Field | Value |
| --- | --- |
| Next expected layer | `03-primitive` |
| Next layer status | `allowed for tooltip/disclosure primitives after tooltip-surface pairing` |
| Reason | Tooltip disclosure typography and surface visuals are now governed, but interaction and accessibility behavior remain primitive work. |

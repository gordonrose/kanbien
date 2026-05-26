# Tooltip Surface Contract

## Token Metadata

| Field | Value |
| --- | --- |
| Contract scope | `shared across design systems` |
| UI family | `tooltip-surface` |
| Harness layer | `02-token` |
| Contract status | `review-ready` |
| Behavior rule path | `docs/design-system/01-behavior-rule/shared/text-overflow-disclosure/TextOverflowDisclosure-Behaviour.md` |
| Contract artifact path | `docs/design-system/02-token/shared/tooltip-surface/TooltipSurface-Contract.md` |
| Reference implementation | `docs/design-system/02-token/systems/default/tooltip-surface/TooltipSurface-Implementation.md` |

## Purpose

This shared contract defines the visual surface values required by later
full-text disclosure tooltip primitives.

It does not define trigger markup, placement, hover behavior, focus behavior,
touch behavior, dismissal, ARIA semantics, copy behavior, selected state,
validation state, menu behavior, popover behavior, or app adoption.

## Shared Token Contract

| Field | Value |
| --- | --- |
| Contract module | `src/frontend/designSystem/layers/02-token/tooltip-surface/contract.mjs` |
| Contract export | `tooltipSurfaceTokenContract` |
| Token type template | `tooltip-surface` |
| Required roles | `text overflow disclosure surface` |
| Required themes | `original`, `dark`, `desert` |
| Required value fields | `surfaceRole`, `backgroundValue`, `foregroundValue`, `borderValue`, `shadowValue`, `radiusValue`, `paddingBlockValue`, `paddingInlineValue`, `maxInlineSizeValue`, `zIndexValue`, `motionDurationValue`, `motionEasingValue` |

## Cross-System Rule

Every design system may choose different tooltip surface values, but it must
preserve readable full-text disclosure, bounded width, internal padding,
visual separation from the host surface, an explicit layering value, and
motion values that a later primitive can respect or disable for reduced motion.

## Consumer Restrictions

Consumers must not hard-code local tooltip background, foreground, border,
shadow, radius, padding, z-index, width, or motion values.

Consumers must not treat this token as approval for tooltip trigger behavior,
positioning, hover, focus, touch, dismissal, ARIA behavior, or copy/select
behavior.

Consumers must preserve `text-overflow-disclosure` before claiming governed
full-text access.

## Next Layer

| Field | Value |
| --- | --- |
| Next expected layer | `03-primitive` |
| Next layer status | `allowed for tooltip/disclosure primitive visual consumption after this proof passes` |
| Reason | Tooltip surface visuals are governed, but trigger semantics and controller behavior remain primitive work. |

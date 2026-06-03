# Pipeline Showcase Frame Contract

## Metadata

| Field | Value |
| --- | --- |
| Contract scope | `shared across design systems` |
| Token type | `pipeline-showcase-frame` |
| Harness layer | `02-token` |
| Token status | `review-ready` |
| Shared token contract path | `docs/design-system/02-token/shared/pipeline-showcase-frame/PipelineShowcaseFrame-Contract.md` |
| Runtime contract module | `src/frontend/designSystem/layers/02-token/pipeline-showcase-frame/contract.mjs` |

## Purpose

Pipeline showcase frame tokens govern reusable selector and panel frame roles
for ordered step showcases.

They define visual frame values for inactive selectors, active selectors,
dropdown selectors, and active content panels. They do not define tablist
semantics, select behavior, panel content structure, keyboard handling, route
state, or responsive selector switching.

## Required Roles

| Role | Required job |
| --- | --- |
| `step selector inactive frame` | Styles an available but inactive ordered step selector. |
| `step selector active frame` | Styles the selected ordered step selector without making color the only selected-state cue. |
| `mobile dropdown selector frame` | Styles the mobile replacement selector as the only visible selector in mobile mode. |
| `active step panel frame` | Styles the panel that contains the active step detail. |

## Required Fields

Every implementation variant must provide:

- `id`
- `tokenName`
- `value.frameRole`
- `value.backgroundValue`
- `value.foregroundValue`
- `value.borderValue`
- `value.borderWidthValue`
- `value.radiusValue`
- `value.shadowValue`
- `value.paddingBlockValue`
- `value.paddingInlineValue`
- `value.minBlockSizeValue`
- `value.gapValue`
- `value.layoutContext`
- `metadata.frameRole`
- `metadata.state`
- `metadata.theme`
- `metadata.accessibility`
- `useCaseInstructions`

## Consumer Rules

- Consumers must use this token for governed ordered pipeline selector and
  panel frames instead of local background, border, radius, shadow, padding, or
  minimum-height literals.
- This token does not approve component anatomy, tablist markup, select
  controller behavior, panel content slots, responsive breakpoints, or app
  adoption.
- Selected state must remain programmatic and visible through more than color;
  these frame values are visual support, not the selected-state contract.
- Focus indicators must be paired from the governed focus-ring token instead
  of being redefined by this token.
- Text styling must be paired from governed typography, label, supporting, or
  link text tokens instead of being inferred from this frame token.

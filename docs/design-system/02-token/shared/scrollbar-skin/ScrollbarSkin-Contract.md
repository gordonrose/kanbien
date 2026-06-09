# Scrollbar Skin Token Contract

## Token Metadata

| Field | Value |
| --- | --- |
| Contract scope | `shared across design systems` |
| UI family | `shared-scroll` |
| Token type | `scrollbar-skin` |
| Harness layer | `02-token` |
| Status | `review-ready` |
| Behavior rule path | `docs/design-system/01-behavior-rule/shared/index-navigation/IndexNavigation-Behaviour.md` |
| Runtime seam | `src/frontend/designSystem/layers/02-token/scrollbar-skin/systems/default.mjs#scrollbarSkinTokenSpec` |
| Rendered proof | `/design-system/default/tokens/scrollbar-skin` |

## Purpose

`scrollbar-skin` defines the approved visual values for a styled scrollbar
inside governed internal scroll regions.

It does not define scroll ownership, panel layout, item behavior, resize
behavior, or app adoption.

## Required Fields

| Field | Meaning |
| --- | --- |
| `scrollbarWidthValue` | Browser scrollbar width keyword or governed thickness value. |
| `scrollbarGutterInlineSizeValue` | Physical inline gutter size used where scrollbar pseudo-elements need a length. |
| `scrollbarThumbValue` | Thumb color value. |
| `scrollbarTrackValue` | Track color value. |
| `scrollbarRadiusValue` | Thumb radius value where the browser supports it. |
| `sourceTokenName` | Source token or mapping used by the implementation. |
| `formulaOrMapping` | Human-reviewable derivation. |

## Consumer Restrictions

Consumers must not set `scrollbar-width`, `scrollbar-color`, scrollbar gutter
size, or scrollbar pseudo-element colors locally for governed internal scroll
regions.

Consumers must consume this token through a governed primitive or later-layer
runtime seam.

If a browser does not support custom scrollbar styling, the primitive may fall
back to browser-native scrollbar rendering without changing scroll behavior.

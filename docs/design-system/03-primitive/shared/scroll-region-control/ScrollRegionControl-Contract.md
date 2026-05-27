# Scroll Region Control Primitive Contract

## Primitive Metadata

| Field | Value |
| --- | --- |
| Primitive | `scroll-region-control` |
| Harness layer | `03-primitive` |
| Status | `review-ready` |
| Shared contract path | `docs/design-system/03-primitive/shared/scroll-region-control/ScrollRegionControl-Contract.md` |
| System proof path | `docs/design-system/03-primitive/systems/default/scroll-region-control/ScrollRegionControl-Proof.md` |
| Runtime seam | `src/frontend/designSystem/layers/03-primitive/scroll-region-control/index.mjs#scrollRegionControlPrimitive` |
| Rendered proof | `/design-system/default/primitives/scroll-region-control` |

## Responsibility

`scroll-region-control` owns an internal scrollable region for governed
patterns.

It owns desktop internal scrolling, mobile page-scroll versus internal-scroll
mode attributes, and governed scrollbar skin token consumption.

It does not own panel headers, list item semantics, item activation, add
actions, resize behavior, route changes, or app adoption.

## Token Dependencies

| Token | Runtime seam |
| --- | --- |
| `scrollbar-skin` | `src/frontend/designSystem/layers/02-token/scrollbar-skin/systems/default.mjs#scrollbarSkinTokenSpec` |

## Behavior And Accessibility Contract

The primitive renders a non-focusable region by default and allows normal
browser scrolling.

On desktop, it may constrain block size and expose internal scrolling for long
lists.

On mobile `page-scroll` mode, it removes the internal scroll constraint so the
page or proof container owns scrolling.

Scrollbar styling is visual only. It must not be the only cue that content is
scrollable, and it must not change keyboard or pointer access to child content.

## Consumer Restrictions

Consumers must not recreate scroll-region overflow or scrollbar styling
locally for governed patterns. When a pattern needs a constrained height, it
must pass that constraint from its own signed token seam.

Consumers must not set custom scrollbar pseudo-element values outside this
primitive unless a later governed seam explicitly exposes them.

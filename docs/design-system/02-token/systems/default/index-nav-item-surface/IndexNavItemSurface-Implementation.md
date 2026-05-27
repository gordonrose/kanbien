# Default Index Nav Item Surface Implementation

## Token Metadata

| Field | Value |
| --- | --- |
| Contract scope | `shared across design systems` |
| Implementation system | `default` |
| UI family | `index-nav-item` |
| Harness layer | `02-token` |
| Token status | `review-ready` |
| Behavior rule path | `docs/design-system/01-behavior-rule/shared/index-navigation/IndexNavigation-Behaviour.md` |
| Proposed design-system URL | `/design-system/default/tokens/index-nav-item-surface` |
| Shared token contract path | `docs/design-system/02-token/shared/index-nav-item-surface/IndexNavItemSurface-Contract.md` |
| System implementation path | `docs/design-system/02-token/systems/default/index-nav-item-surface/IndexNavItemSurface-Implementation.md` |

## Deterministic Token Spec

The deterministic implementation source is:

`src/frontend/designSystem/systems/default/tokens/proofs/indexNavItemSurface.tokens.mjs#tokenDefinitionV1`

It defines twelve variants: resting, hover, current, and disabled states for
`original`, `dark`, and `desert` themes.

## System Token Implementation

| Field | Value |
| --- | --- |
| Implementation system | `default` |
| Governed runtime module | `src/frontend/designSystem/layers/02-token/index-nav-item-surface/systems/default.mjs` |
| System proof module | `src/frontend/designSystem/systems/default/tokens/proofs/indexNavItemSurface.tokens.mjs` |
| System token export | `indexNavItemSurfaceTokenSpec` |
| System page route | `/design-system/default/tokens/index-nav-item-surface` |
| System proof status | `review-ready` |

## Token Variants

| Variant Group | Preview | Metadata | Use Case Instructions |
| --- | --- | --- | --- |
| `rest` | Theme-specific surface background and subtle border. | `state=resting`; `theme=original/dark/desert` | Use for non-current enabled items only. |
| `hover` | Subtle primary mix over resting surface. | `state=hover`; `theme=original/dark/desert` | Use for pointer hover only; not current or selected meaning. |
| `current` | Theme-specific primary tint with primary-readable foreground. | `state=current`; `theme=original/dark/desert` | Use only after a future primitive exposes programmatic current/selected semantics. |
| `disabled` | Low-emphasis surface mix and muted border. | `state=disabled`; `theme=original/dark/desert` | Use only after a future primitive defines disabled behavior and activation denial. |

## Rendered View

| Field | Value |
| --- | --- |
| How to view | `/design-system/default/tokens/index-nav-item-surface` |
| Rendered view status | `available` |
| Dependency chain visible | `yes` |
| Diagnostic override | `not-applicable` |
| Diagnostic override scope | Upstream source-color review remains on the primary source/tint token proof pages. |
| If unavailable | Do not consume this implementation in later layers. |

## Required Evidence

| Evidence Area | Requirement |
| --- | --- |
| themes | Original, dark, and desert variants must render. |
| magnification | Mobile and zoomed render must keep values readable and non-overlapping. |
| accessibility | Current and disabled state surfaces must not be treated as sufficient semantics by themselves. |
| dependency rendering | Proof route must show source token and formula/mapping for derived state surfaces. |

## Consumer Restrictions

Consumers must not copy rendered proof values into route-local CSS or app CSS.

Consumers must not use these surface states to claim a current, selected, hover,
or disabled item before a governed primitive or pattern exposes the matching
behavior and semantics.

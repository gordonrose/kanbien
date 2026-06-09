# Default Panel Frame Token Implementation

## Token Metadata

| Field | Value |
| --- | --- |
| Contract scope | `shared across design systems` |
| Implementation system | `default` |
| UI family | `panel` |
| Harness layer | `02-token` |
| Token status | `review-ready` |
| Behavior rule path | `docs/design-system/01-behavior-rule/shared/entity-panel/EntityPanel-Behaviour.md` |
| Shared token contract path | `docs/design-system/02-token/shared/panel-frame/PanelFrame-Contract.md` |
| System implementation path | `docs/design-system/02-token/systems/default/panel-frame/PanelFrame-Implementation.md` |

## Purpose

The default system implementation exposes reusable panel shell frame variants
for the `original`, `dark`, and `desert` themes. The original variant is seeded
by the governed index-navigation panel proof and broadened for later panel
consumers.

The implementation keeps the values reviewable through a rendered token route
and a governed runtime seam.

## Inventory Check

| Field | Value |
| --- | --- |
| Inventory source checked | `index-nav-panel-frame`, `panel-corner-radius`, `entity-panel` behavior rule |
| Existing token covers need | `partial` |
| Reuse decision | Promote reusable panel shell decisions into `panel-frame`; keep header geometry, action appearance, and index-specific navigation behavior out of this token. |
| Duplication risk | Prevents entity-panel from copying index-navigation panel values or creating entity-only names for generic panel shell behavior. |

## Dependency Chain

| Field | Value |
| --- | --- |
| Upstream contract | `tokens.panel-corner-radius` |
| Upstream variant or token | `panel-corner-radius-flush`; theme surface foundations |
| Formula or mapping | Panel radius maps from the flush panel radius; panel background, foreground, and border map to the selected theme surface posture. |
| What changes when upstream changes | Radius or theme surface proof output changes in the rendered token page. |
| What must not change | Behavior contract, primitive semantics, accessibility contract, signed token values, or readiness truth. |

## System Token Implementation

| Field | Value |
| --- | --- |
| Implementation system | `default` |
| Governed runtime module | `src/frontend/designSystem/layers/02-token/panel-frame/systems/default.mjs` |
| System proof module | `src/frontend/designSystem/systems/default/tokens/proofs/panelFrame.tokens.mjs` |
| System token export | `panelFrameTokenSpec` |
| System page route | `/design-system/default/tokens/panel-frame` |
| System proof status | `review-ready` |

## Signed Variants

| Variant | Theme | Background | Foreground | Border |
| --- | --- | --- | --- | --- |
| `panel-frame-default` | `original` | `#ffffff` | `#111827` | `#dbe4f0` |
| `panel-frame-dark` | `dark` | `#171b22` | `#f4f7fb` | `#303845` |
| `panel-frame-desert` | `desert` | `#fffaf0` | `#493327` | `#ead8be` |

## Rendered View

| Field | Value |
| --- | --- |
| How to view | `/design-system/default/tokens/panel-frame` |
| Dependency chain visible | `yes` |
| Diagnostic override | `available for panel width range` |

## Required Evidence

Focused evidence must prove the rendered route exposes all theme variants,
shows signed dependency identity, and supports width review without mutating
signed values.

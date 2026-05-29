# Default Body Region Frame Token Implementation

## Token Metadata

| Field | Value |
| --- | --- |
| Contract scope | `shared across design systems` |
| Implementation system | `default` |
| UI family | `body-region` |
| Harness layer | `02-token` |
| Token status | `review-ready` |
| Behavior rule path | `docs/design-system/01-behavior-rule/shared/entity-body-panel/EntityBodyPanel-Behaviour.md` |
| Shared token contract path | `docs/design-system/02-token/shared/body-region-frame/BodyRegionFrame-Contract.md` |
| System implementation path | `docs/design-system/02-token/systems/default/body-region-frame/BodyRegionFrame-Implementation.md` |

## Purpose

The default system implementation exposes body/content-region frame values for
later primitives and patterns that need to host governed content inside a panel.

The implementation keeps values reviewable through a rendered token route and a
governed runtime seam.

## Inventory Check

| Field | Value |
| --- | --- |
| Inventory source checked | `panel-frame`, `panel-corner-radius`, `scrollbar-skin`, `entity-body-panel` behavior rule |
| Existing token covers need | `partial` |
| Reuse decision | Reuse panel surface posture and panel radius source, but keep inner body-region spacing and state spacing separate from the outer panel shell. |
| Duplication risk | Prevents body-panel primitives and patterns from using `token-spec-card`, route-local body padding, or copied panel-shell values as if they governed body content. |

## Dependency Chain

| Field | Value |
| --- | --- |
| Upstream contract | `tokens.panel-frame` |
| Upstream variant or token | `panel-frame-default` |
| Formula or mapping | Body region surface, foreground, border, radius, min inline size, max inline size, and desktop max block size map from the signed generic panel frame; body padding, section gap, and state spacing are body-region decisions. |
| What changes when upstream changes | Surface, foreground, border, radius, width rails, and desktop max-height proof output changes in the rendered token page. |
| What must not change | Behavior contract, primitive semantics, accessibility contract, signed token values, or readiness truth. |

## System Token Implementation

| Field | Value |
| --- | --- |
| Implementation system | `default` |
| Governed runtime module | `src/frontend/designSystem/layers/02-token/body-region-frame/systems/default.mjs` |
| System proof module | `src/frontend/designSystem/systems/default/tokens/proofs/bodyRegionFrame.tokens.mjs` |
| System token export | `bodyRegionFrameTokenSpec` |
| System page route | `/design-system/default/tokens/body-region-frame` |
| System proof status | `review-ready` |

## Rendered View

| Field | Value |
| --- | --- |
| How to view | `/design-system/default/tokens/body-region-frame` |
| Dependency chain visible | `yes` |
| Diagnostic override | `not yet needed; width rails are visible as signed token values and later pattern proofs must exercise resize pressure` |

## Required Evidence

Focused evidence must prove the rendered route exposes dependency identity,
body-region frame values, width rails, and content-height pressure without
treating proof-only placeholder content as a governed form control.

# Default Panel Header Frame Token Implementation

## Token Metadata

| Field | Value |
| --- | --- |
| Contract scope | `shared across design systems` |
| Implementation system | `default` |
| UI family | `panel` |
| Harness layer | `02-token` |
| Token status | `review-ready` |
| Behavior rule path | `docs/design-system/01-behavior-rule/shared/entity-panel/EntityPanel-Behaviour.md` |
| Shared token contract path | `docs/design-system/02-token/shared/panel-header-frame/PanelHeaderFrame-Contract.md` |
| System implementation path | `docs/design-system/02-token/systems/default/panel-header-frame/PanelHeaderFrame-Implementation.md` |

## Purpose

The default system implementation exposes the reusable panel header frame
variant consumed by `panel-header-control`.

## Inventory Check

| Field | Value |
| --- | --- |
| Inventory source checked | `index-nav-panel-frame`, `minimum-target-size`, `panel-frame`, `entity-panel` behavior rule |
| Existing token covers need | `partial` |
| Reuse decision | Split header geometry out of the bundled `panel-frame` proof into `panel-header-frame`. |
| Duplication risk | Prevents a generic panel shell token from becoming a mixed panel/header/action bucket. |

## Dependency Chain

| Field | Value |
| --- | --- |
| Upstream contract | `tokens.minimum-target-size`; `tokens.panel-frame` |
| Formula or mapping | Header height uses the minimum target height plus breathing room; separator aligns with panel border posture. |
| What changes when upstream changes | Header proof output should be reviewed if minimum target size or panel border posture changes. |
| What must not change | Behavior contract, primitive semantics, accessibility contract, signed token values, or readiness truth. |

## System Token Implementation

| Field | Value |
| --- | --- |
| Implementation system | `default` |
| Governed runtime module | `src/frontend/designSystem/layers/02-token/panel-header-frame/systems/default.mjs` |
| System proof module | `src/frontend/designSystem/systems/default/tokens/proofs/panelHeaderFrame.tokens.mjs` |
| System token export | `panelHeaderFrameTokenSpec` |
| System page route | `/design-system/default/tokens/panel-header-frame` |
| System proof status | `review-ready` |

## Rendered View

| Field | Value |
| --- | --- |
| How to view | `/design-system/default/tokens/panel-header-frame` |
| Dependency chain visible | `yes` |
| Diagnostic override | `not applicable` |

# Menu Simple Select Frame Default Implementation

## Token Metadata

| Field | Value |
| --- | --- |
| Contract scope | `shared across design systems` |
| Implementation system | `default` |
| UI family | `menu-simple-select` |
| Harness layer | `02-token` |
| Token status | `review-ready` |
| Behavior rule path | `docs/design-system/01-behavior-rule/shared/menu-simple-select/MenuSimpleSelect-Behaviour.md` |
| Existing design-system URL | legacy `/design-system/components/simple-select`; legacy `/design-system/tokens/dropdowns` |
| Proposed design-system URL | `/design-system/default/tokens/menu-simple-select-frame` |
| Shared token contract path | `docs/design-system/02-token/shared/menu-simple-select-frame/MenuSimpleSelectFrame-Contract.md` |
| System implementation path | `docs/design-system/02-token/systems/default/menu-simple-select-frame/MenuSimpleSelectFrame-Implementation.md` |
| Files affected now | default implementation, runtime seam, proof module, token route, readiness index, focused test |

## Purpose

| Field | Value |
| --- | --- |
| Source behavior need | Compact anchored menu select needs governed text trigger, chevron affordance, icon trigger, panel, option, current, disabled, sizing, spacing, stacking, and scroll-frame values before primitive behavior can consume them. |
| Token category | `surface`, `spacing`, `sizing`, `stacking`, `state frame` |
| Token job | Provide default-system concrete values for text-trigger, icon-trigger, panel, and option-state frame contracts across original, dark, and desert themes. |
| Non-goals | ARIA behavior, keyboard handling, option row anatomy, header placement, component APIs, demo routes, canonical scenarios, app adoption. |

## Deterministic Token Spec

The deterministic `tokenDefinitionV1` source lives in:

`src/frontend/designSystem/systems/default/tokens/proofs/menuSimpleSelectFrame.tokens.mjs`

That module is the source for the rendered token page, runtime seam, and
focused tests. It contains the single JSON-compatible `tokenDefinitionV1`
object for this system implementation.

## Approved Token Decisions

| Scope | Token Decision | Value |
| --- | --- | --- |
| system implementation | `--menu-simple-select-trigger-frame-*` | Theme-specific compact text trigger frame with `2.75rem` minimum block size. |
| system implementation | trigger supporting and icon foreground | Original theme uses muted supporting foreground `#64748b` and green chevron foreground `#008575`; dark and desert map those roles to their theme palettes. |
| system implementation | `--menu-simple-select-trigger-frame-icon-*` | Theme-specific square icon-only trigger frame with `2.75rem` inline and block target. |
| system implementation | `--menu-simple-select-panel-frame` | Anchored neutral panel with `32rem` max block size, `20` z-index, and internal scrolling posture. |
| system implementation | `--menu-simple-select-option-frame-rest` | Neutral option row/card frame. |
| system implementation | `--menu-simple-select-option-frame-current` | Current option frame with low-emphasis selected surface and stronger border. |
| system implementation | `--menu-simple-select-option-frame-disabled` | Muted option frame for unavailable options. |

## System Token Implementation

| Field | Value |
| --- | --- |
| Implementation system | `default` |
| Governed runtime module | `src/frontend/designSystem/layers/02-token/menu-simple-select-frame/systems/default.mjs` |
| System proof module | `src/frontend/designSystem/systems/default/tokens/proofs/menuSimpleSelectFrame.tokens.mjs` |
| System token export | `menuSimpleSelectFrameTokenSpec` |
| System page route | `/design-system/default/tokens/menu-simple-select-frame` |
| System proof status | `review-ready` |

## Page And Code Seam

| Field | Value |
| --- | --- |
| Required page route | `/design-system/default/tokens/menu-simple-select-frame` |
| Required page file | `src/frontend/designSystem/systems/default/tokens/menu-simple-select-frame/index.html` |
| Token contract module | `src/frontend/designSystem/layers/02-token/menu-simple-select-frame/contract.mjs` |
| Governed runtime module | `src/frontend/designSystem/layers/02-token/menu-simple-select-frame/systems/default.mjs` |
| System proof module | `src/frontend/designSystem/systems/default/tokens/proofs/menuSimpleSelectFrame.tokens.mjs` |
| Token spec export | `menuSimpleSelectFrameTokenSpec` |
| Token variant section description | Review compact trigger, anchored panel, resting option, current option, and disabled option frame values. |

## Required Evidence

| Evidence Area | Requirement |
| --- | --- |
| token unit proof | `tests/unit/designSystem/menuSimpleSelectFrameToken.test.ts` verifies roles, values, route metadata, and consumer restrictions. |
| registry proof | `tests/integration/frontend/designSystemSystemRegistryGuard.test.ts` verifies manifest shape. |
| rendered proof | Token route is available; local Playwright dependencies are installed for browser verification. |

## Consumer Restrictions

Consumers must import the runtime seam rather than reconstructing these values
from this document, the legacy dropdown route, the screenshot, or chat history.

## Implementation Plan Recommendation

| Step | Layer | Action | Blocking Reason |
| --- | --- | --- | --- |
| 1 | `02-token` | Treat this implementation as review-ready if focused tests pass. | none |
| 2 | `03-primitive` | Create the governed menu-simple-select primitive consuming this token. | Requires token gate pass. |

## Next Layer

| Field | Value |
| --- | --- |
| Next expected layer | `03-primitive` |
| Next layer status | `allowed` |
| Reason | Default-system frame values are now available through a governed token seam. |

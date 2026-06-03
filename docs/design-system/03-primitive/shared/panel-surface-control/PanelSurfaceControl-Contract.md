# Panel Surface Control Primitive Contract

## Primitive Metadata

| Field | Value |
| --- | --- |
| Contract scope | `shared across design systems` |
| Reference proof system | `default` |
| Token dependency systems | `default` |
| UI family | `panel-stack` |
| Primitive name | `panel-surface-control` |
| Harness layer | `03-primitive` |
| Primitive status | `review-ready` |
| Behavior rule path | `docs/design-system/01-behavior-rule/shared/panel-stack/PanelStack-Behaviour.md` |
| Shared primitive contract path | `docs/design-system/03-primitive/shared/panel-surface-control/PanelSurfaceControl-Contract.md` |
| System proof path | `docs/design-system/03-primitive/systems/default/panel-surface-control/PanelSurfaceControl-Proof.md` |
| Runtime seam | `src/frontend/designSystem/layers/03-primitive/panel-surface-control/index.mjs#panelSurfaceControlPrimitive` |
| Rendered proof | `/design-system/default/primitives/panel-surface-control` |

## Purpose

`panel-surface-control` owns the reusable low-level panel shell used by later
panel-stack patterns. It renders a labelled, token-backed panel surface and
normalizes whether that panel is active, covered by a child panel, or hidden.

It does not own panel stacking, side origin, resize behavior, headers, search,
selection, drawer routing, panel body composition, product data, app adoption,
or page topology.

## Layer Boundary

This primitive consumes signed Layer 2 panel tokens and exposes stable shell
semantics. It must not define token values, pattern layout, drawer controller
behavior, or app-specific content.

## Upstream Gates

| Field | Value |
| --- | --- |
| Behavior rule status | `review-ready` |
| Token readiness source checked | `docs/design-system/02-token/token-readiness-index.md` |
| Required tokens consumable by selected systems | `yes for default panel-frame` |
| Primitive inventory checked | `docs/design-system/03-primitive/primitive-readiness-index.md`; no generic panel-surface primitive existed before this artifact |

## Token Dependencies

| Token Dependency | System | Runtime Seam | Primitive Decision Supported | Status |
| --- | --- | --- | --- | --- |
| `panel-frame` | `default` | `src/frontend/designSystem/layers/02-token/panel-frame/systems/default.mjs#panelFrameTokenSpec` | Supplies panel surface, border, radius, padding, gap, width rails, and max block size. | `consumable` |

## Behavior Contract

The primitive renders a semantic region with an accessible label. Consumers
must supply a stable label that describes the panel.

The primitive supports only these shell states:

| State | Required Behavior |
| --- | --- |
| `active` | The panel is visible and available to keyboard and assistive technology. |
| `covered` | The panel remains in the stack but is covered by a child panel; it is hidden from assistive technology and must not compete for focus. |
| `hidden` | The panel is not rendered as an available visible panel. |

## Accessibility Contract

The active panel uses a labelled region. Covered and hidden panels expose
`aria-hidden` and inert behavior so covered content does not compete with the
active overlay panel.

This primitive does not trap focus, move focus, or restore focus. Focus handoff
and return behavior belong to the consuming `panel-stack` pattern.

## Public Consumption Boundary

| Field | Value |
| --- | --- |
| Runtime module | `src/frontend/designSystem/layers/03-primitive/panel-surface-control/index.mjs` |
| Runtime export | `panelSurfaceControlPrimitive` |
| Render export | `renderPanelSurfaceControlPrimitive` |
| Controller export | `attachPanelSurfaceControlPrimitiveController` |
| Allowed consumers | `04-pattern-contract` after selected system proof is ready |

## Consumer Restrictions

Consumers must not hard-code values governed by `panel-frame`.

Consumers must not recreate panel shell markup, state attributes, ARIA rules, or
CSS variables locally when this primitive exists.

Consumers must not treat this primitive as proof of panel stacking, search,
selection, drawer select, resize behavior, body scrolling, or app adoption.

## Required Evidence

| Evidence Area | Requirement |
| --- | --- |
| behavior | Unit proof must show token resolution and allowed state normalization. |
| accessibility | Proof must show active labelled region and covered/hidden inert posture. |
| token consumption | Unit proof must show `panel-frame` is the only visual token dependency. |
| rendered verification | Proof route must expose active, covered, hidden, and width pressure states. |

## Rendered View

| Field | Value |
| --- | --- |
| How to view | `/design-system/default/primitives/panel-surface-control` |
| Rendered view status | `available` |

## Next Layer

| Field | Value |
| --- | --- |
| Next expected layer | `04-pattern-contract` |
| Next layer status | `allowed` |
| Reason | `panel-stack` can compose panel surfaces using signed `panel-stack-placement` values and existing header, icon button, resize, and scroll primitives. |

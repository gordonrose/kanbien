# Entity Panel Pattern Contract

## Pattern Metadata

| Field | Value |
| --- | --- |
| Contract scope | `shared across design systems` |
| Reference proof system | `default` |
| UI family | `entity-panel` |
| Pattern name | `entity-panel` |
| Harness layer | `04-pattern-contract` |
| Pattern status | `review-ready` |
| Behavior rule path | `docs/design-system/01-behavior-rule/shared/entity-panel/EntityPanel-Behaviour.md` |
| Shared pattern contract path | `docs/design-system/04-pattern-contract/shared/entity-panel/EntityPanel-Contract.md` |
| System proof path | `docs/design-system/04-pattern-contract/systems/default/entity-panel/EntityPanel-Proof.md` |
| Runtime seam | `src/frontend/designSystem/layers/04-pattern-contract/entity-panel/index.mjs#entityPanelPattern` |
| Rendered proof | `/design-system/default/patterns/entity-panel` |

## Purpose

`entity-panel` composes a governed panel header, optional embedded
secondary index, governed body scroll region, and body slot placeholder for
future governed form or builder content.

It does not own hosted text fields, textareas, radios, toggles, dropdowns,
drawer selects, accordions, card selects, workflow builders, backend data
loading, component seams, canonical scenarios, templates, or app adoption.

## Upstream Gates

| Gate | Status |
| --- | --- |
| Behavior rule | `review-ready`; `docs/design-system/01-behavior-rule/shared/entity-panel/EntityPanel-Behaviour.md` |
| Token dependency | `panel-frame` is `review-ready` for `default` |
| Primitive dependency | `panel-header-control`, `icon-button-control`, and `scroll-region-control` are `review-ready` for `default` |
| Pattern dependency | `index-nav-panel` and `entity-body-panel` are `review-ready` for `default` |
| Hosted body proof | The default proof may host `accordion-form-section` and governed form-field seams; the entity-panel runtime seam still accepts body HTML rather than owning those child contracts |

## Composition Contract

The pattern renders one labelled entity panel with one governed
`panel-header-control`, an optional embedded secondary `index-nav-panel`, and a
governed body scroll region.

On desktop, the body scroll region may own internal scrolling so the panel
header remains available for orientation. On mobile, the pattern exposes an
active internal state for proof and later composition: `body` or
`secondary-index`. The secondary index overlays the body rather than replacing
it. The body remains the underlying working view.

The embedded secondary index must reuse the governed `index-nav-panel` pattern.
Consumers must not reconstruct a separate secondary navigation family inside
the entity panel.

On mobile body/content view, the entity panel header action uses the
governed `list` icon from `icon-button-control` to return to the secondary
index. The secondary index may render its governed index-nav header for review;
when shown in this composition, the secondary mobile header exposes both the
optional add affordance and a mobile-only close affordance.

On mobile, the secondary index panel fills the available entity-panel
inline space. Its action buttons live inside the governed secondary
`index-nav-panel` header, not as parent-pattern overlay controls.

The embedded secondary index may expose the governed `index-nav-panel` resize
handle. Width limits, keyboard resizing, and pointer resizing remain owned by
the child `index-nav-panel` and `resize-handle-control` contracts.

When the mobile secondary index overlay is active, it must expose both the
secondary add affordance and a governed close affordance that returns to the
page-level primary index coordination state. When a secondary nav item is
activated on mobile, the proof moves to body/content view and preserves that
secondary item as the current tab.

The primary index is not part of the entity-panel composition and must not
be rendered under the panel header. The default proof route may render a
page-level primary index wrapper to prove coordination, but that wrapper is not
owned by this pattern.

## Data Or Event Contract

Input contains `title`, optional `secondaryItems`, optional
`secondaryCurrent`, and proof-only `bodyHtml`.

Header action activation bubbles through the composed `icon-button-control`.
Secondary index item activation bubbles through the composed index-nav seams.
Mobile transitions from page-level primary to secondary clear secondary
selection; secondary item activation sets the secondary current tab; returning
from body to secondary preserves the current secondary tab.
The entity panel pattern does not route, fetch, persist, validate, or
mutate product data.

## Visual-Skin Boundary

Panel shell, gap, padding, width, mobile breakpoint, and body scroll max height
come from `panel-frame`. Header geometry comes through `panel-header-control`.
Scrollbar appearance comes through `scroll-region-control`. Secondary index
appearance comes through `index-nav-panel`.

## Rendered View

| Field | Value |
| --- | --- |
| How to view | `/design-system/default/patterns/entity-panel` |
| Rendered view status | `available` |

The rendered proof must expose controls for review viewport, page-level
primary-index presence, secondary-index presence, secondary header visibility,
secondary resize visibility, secondary fixture length, mobile active region,
body content pressure, and text direction.
These controls are
diagnostic review pressure; they are not downstream consumer values unless the
runtime seam explicitly names them.

The proof route must not render the governed context bar or display-settings
drawer until those families have their own Layer 1-4 governed seams. Their
legacy route-local renderings are inventory, not consumable dependencies for
this pattern.

## Consumer Restrictions

Consumers must not copy proof-route markup, recreate panel frame values,
rebuild header behavior, rebuild secondary index behavior, or invent body
scroll CSS locally.

Consumers must not treat proof-route hosted body content as entity-panel-owned
form or builder controls. Hosted body content must remain governed by its own
primitive or pattern contract before it is used as real downstream UI.

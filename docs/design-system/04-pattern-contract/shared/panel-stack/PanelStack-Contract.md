# Panel Stack Pattern Contract

## Pattern Metadata

| Field | Value |
| --- | --- |
| Contract scope | `shared across design systems` |
| Reference proof system | `default` |
| UI family | `panel-stack` |
| Pattern name | `panel-stack` |
| Harness layer | `04-pattern-contract` |
| Pattern status | `review-ready` |
| Behavior rule path | `docs/design-system/01-behavior-rule/shared/panel-stack/PanelStack-Behaviour.md` |
| Shared pattern contract path | `docs/design-system/04-pattern-contract/shared/panel-stack/PanelStack-Contract.md` |
| System proof path | `docs/design-system/04-pattern-contract/systems/default/panel-stack/PanelStack-Proof.md` |
| Runtime seam | `src/frontend/designSystem/layers/04-pattern-contract/panel-stack/index.mjs#panelStackPattern` |
| Rendered proof | `/design-system/default/patterns/panel-stack` |

## Purpose

`panel-stack` composes governed panel surfaces into a reusable side-panel stack.
It owns origin side, desktop flush adjacency, mobile overlay order, active
panel identity, and covered-panel posture.

It does not own drawer select, searchable selection, filter semantics, display
settings, panel header content, resize controls, product routes, app adoption,
or backend/frontend data contracts.

## Upstream Gates

| Dependency | Required Seam | Status |
| --- | --- | --- |
| Behavior rule | `docs/design-system/01-behavior-rule/shared/panel-stack/PanelStack-Behaviour.md` | `review-ready` |
| Token | `src/frontend/designSystem/layers/02-token/panel-stack-placement/systems/default.mjs#panelStackPlacementTokenSpec` | `review-ready` |
| Primitive | `src/frontend/designSystem/layers/03-primitive/panel-surface-control/index.mjs#panelSurfaceControlPrimitive` | `review-ready` |

## Composition Contract

The pattern renders one labelled stack containing two or more
`panel-surface-control` children.

On desktop, panels are arranged flush next to each other using the signed
desktop adjacency value.

On mobile or narrow posture, only the active panel is operable. Earlier panels
remain in the stack as covered panels and must not compete for focus or
assistive-technology navigation.

The consuming caller may choose `left` or `right` origin and the active panel.
The pattern does not choose product routing or step state.

The consuming caller may also pass a signed theme name. `panel-stack` must
forward that theme to each `panel-surface-control` child instead of owning panel
surface colors itself.

When a consumer marks an ancestor as `data-drawer-overlay-boundary`,
`panel-stack` must constrain page-shell drawer overlays to that ancestor's
rendered box. This is allowed for governed proof or composition hosts, such as
a mobile viewport proof, where the host intentionally stands in for the page
content area. Without that explicit boundary, page-shell drawer overlays use
the real shell-preserving placement behavior.

## Allowed States

Only include states that change composition behavior or accessibility posture.

| State | Required Behavior |
| --- | --- |
| `desktop` | Panels remain side by side and operable as panel surfaces. |
| `mobile` | Active panel overlays covered panels; covered panels are inert through the primitive. |
| `left` origin | Stack grows from the left edge. |
| `right` origin | Stack grows from the right edge. |
| `original`, `dark`, or `desert` theme | Each child panel resolves the matching `panel-frame` variant through `panel-surface-control`. |

## Accessibility Contract

The stack is a labelled group. Active panel semantics come from
`panel-surface-control`.

Mobile covered panels must use the primitive covered state. Focus handoff,
close-button behavior, and focus return belong to the eventual drawer-select
or consuming panel workflow pattern that supplies open/close controls.

## Visual-Skin Boundary

Panel surface styling comes from `panel-surface-control` and `panel-frame`.
Stack adjacency, overlay inset, mobile breakpoint, and layer order come from
`panel-stack-placement`.

No route-local stack gaps, overlay offsets, z-index literals, panel widths, or
panel surface values are allowed.

Contained overlay boundaries are measured from the declared host's rendered
box. Consumers may opt into that boundary, but they must not invent replacement
overlay dimensions or drawer placement values locally.

## Public Consumption Boundary

| Field | Value |
| --- | --- |
| Runtime module | `src/frontend/designSystem/layers/04-pattern-contract/panel-stack/index.mjs` |
| Runtime export | `panelStackPattern` |
| Render export | `renderPanelStackPattern` |
| Controller export | `attachPanelStackPatternController` |
| Allowed consumers | Later Layer 4 patterns such as searchable selection panel and drawer select, and later component seams after signoff |

## Consumer Restrictions

Consumers must not recreate stack placement or covered-panel composition
locally.

Consumers must not treat this pattern as a drawer-select implementation, search
panel, filter panel, display settings drawer, route topology, or app adoption
seam.

## Required Evidence

| Evidence Area | Requirement |
| --- | --- |
| behavior | Unit proof must show desktop all-active posture and mobile active/covered posture. |
| accessibility | Proof must show covered panels use the primitive covered state on mobile. |
| token consumption | Unit proof must show `panel-stack-placement` is consumed directly and panel visuals come through `panel-surface-control`. |
| rendered verification | Proof route must expose origin, viewport posture, active panel, and panel count controls; consuming proof routes that declare contained overlay boundaries must verify the drawer fits that rendered boundary. |

## Rendered View

| Field | Value |
| --- | --- |
| How to view | `/design-system/default/patterns/panel-stack` |
| Rendered view status | `available` |

## Next Layer

| Field | Value |
| --- | --- |
| Next expected layer | `04-pattern-contract` |
| Next pattern | `searchable-selection-panel` |
| Reason | Drawer select needs searchable grouped selection behavior after the stack foundation exists. |

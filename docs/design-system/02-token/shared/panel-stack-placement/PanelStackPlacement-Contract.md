# Panel Stack Placement Token Contract

## Purpose

`panel-stack-placement` signs reusable side-panel stack relationship values:
origin-side support, desktop adjacency, narrow overlay inset, mobile breakpoint
inheritance, and ordered overlay layers.

It exists so drawer select, filter panels, display settings, entity panels, and
future side-panel consumers do not invent stack gaps, overlay offsets, or
z-index values locally.

## Scope

This token may define only placement and layering values for reusable stacked
panels. It does not define panel surface styling, panel width values, panel
header geometry, close behavior, focus behavior, search behavior, selectable
cards, component APIs, routes, or app adoption.

## Required Fields

- `placementRole`
- `originSides`
- `desktopAdjacencyGapValue`
- `overlayInsetValue`
- `mobileBreakpointValue`
- `layerBaseValue`
- `layerStepValue`
- `coveredPanelBehavior`

## Consumer Rules

Consumers must import the governed runtime seam instead of hard-coding stack
gap, overlay inset, z-index base, z-index step, or mobile breakpoint values.

Layer 3 and Layer 4 work may use this token only with the `panel-stack`
behavior rule at
`docs/design-system/01-behavior-rule/shared/panel-stack/PanelStack-Behaviour.md`.

If a consumer needs panel surface, width, header, scroll, focus, or close
behavior, it must consume the owning token or primitive seam rather than adding
those decisions here.

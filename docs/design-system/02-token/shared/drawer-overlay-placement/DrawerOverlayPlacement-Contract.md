# Drawer Overlay Placement Token Contract

## Purpose

`drawer-overlay-placement` signs the open page-shell overlay posture for
drawer patterns.

It exists so drawer-select and later drawer patterns do not invent fixed
placement, page-shell dimensions, inset, or overlay z-index values locally.

## Scope

This token may define only the drawer's page-shell overlay placement and layer
above the surrounding page/proof content underlay.

The overlay region preserves shell chrome such as top navigation, side
navigation, and bottom navigation. It governs the content-region overlay, not a
full-browser takeover.

The default page-shell overlay starts below the governed top shell chrome using
the signed `4rem` block-start fallback. It preserves the signed side-rail
offset using the `4.25rem` inline-start fallback on wider viewports, and may
collapse that inline offset on mobile when the consuming pattern proves
full-width mobile overlay behavior.

It does not define panel surface styling, panel-stack internal overlay order,
panel headers, search fields, selectable cards, close behavior, focus
behavior, component APIs, routes, or app adoption.

## Required Fields

- `placementRole`
- `positionValue`
- `insetValue`
- `inlineSizeValue`
- `blockSizeValue`
- `layerValue`
- `underlayBehavior`

## Consumer Rules

Consumers must import the governed runtime seam instead of hard-coding fixed
positioning, page-shell sizing, inset, or z-index values.

Layer 4 drawer patterns may use this token only with the `drawer-select`
behavior rule at
`docs/design-system/01-behavior-rule/shared/drawer-select/DrawerSelect-Behaviour.md`.

If a consumer needs internal panel order, panel visuals, search, selection,
close, focus, or app adoption behavior, it must consume the owning seam rather
than adding those decisions here.

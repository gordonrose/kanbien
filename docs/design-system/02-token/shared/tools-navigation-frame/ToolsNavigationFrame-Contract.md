# Tools Navigation Frame Token Contract

Layer: 02-token  
Family: tools-navigation  
Status: review-ready

## Purpose

`tools-navigation-frame` governs the current desktop right-rail frame and tool
item affordance values for tools navigation.

Mobile tools-navigation is intentionally hidden in this version.

## Required Variant Role

- `tools navigation frame`

## Required Fields

- `desktopPositioningModel`
- `desktopRailInlineSize`
- `desktopRailTopOffset`
- `desktopRailBottomOffset`
- `desktopRailGapValue`
- `desktopRailPaddingBlockValue`
- `desktopRailPaddingInlineValue`
- `mobileBreakpoint`
- `mobileVisibility`
- `surfaceValue`
- `borderValue`
- `shadowValue`
- `itemInlineSize`
- `itemBlockSize`
- `itemRadiusValue`
- `itemRestingBackgroundValue`
- `itemRestingForegroundValue`
- `itemHoverBackgroundValue`
- `itemActiveBackgroundValue`
- `itemActiveForegroundValue`
- `itemUnavailableOpacityValue`

## Consumer Rules

Allowed:

- Use for desktop tools-navigation rail and item affordance values.

Denied:

- Do not use to invent mobile tools behavior, payload drawers, panel internals,
  app routing, product action semantics, component props, or app-local CSS.

## Proof

Default implementation proof:

- `/design-system/default/tokens/tools-navigation-frame`
- `src/frontend/designSystem/systems/default/tokens/proofs/toolsNavigationFrame.tokens.mjs`

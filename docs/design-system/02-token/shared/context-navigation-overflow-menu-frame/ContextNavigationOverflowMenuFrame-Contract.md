# Context Navigation Overflow Menu Frame Token Contract

Layer: 02-token  
Family: context-navigation  
Status: review-ready

## Purpose

`context-navigation-overflow-menu-frame` governs frame, placement, and layer values for the context-navigation More menu.

It exists so mobile overflow does not drop items or invent menu placement locally.

## Required Variant Role

- `context navigation overflow menu frame`

## Required Fields

- `minInlineSize`
- `paddingValue`
- `borderValue`
- `radiusValue`
- `backgroundValue`
- `shadowValue`
- `zIndexValue`
- `desktopBottomOffset`
- `desktopInlineOffset`
- `mobileBottomOffset`
- `mobileInlineInset`

## Consumer Rules

Allowed:

- Use for context-navigation overflow menu frame and placement values.

Denied:

- Do not use for item semantics, trigger behavior, drawer payloads, tooltip disclosure, or app routing.
- Do not use as a generic menu, popover, select, or dialog frame.

## Accessibility

The consuming primitive must preserve open and close behavior, Escape handling, outside click dismissal, and focus restoration.

## Proof

Default implementation proof:

- `/design-system/default/tokens/context-navigation-overflow-menu-frame`
- `src/frontend/designSystem/systems/default/tokens/proofs/contextNavigationOverflowMenuFrame.tokens.mjs`

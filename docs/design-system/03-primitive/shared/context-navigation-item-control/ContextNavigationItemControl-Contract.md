# Context Navigation Item Control Primitive Contract

Layer: 03-primitive  
Family: context-navigation  
Status: review-ready

## Purpose

`context-navigation-item-control` governs one interactive item inside the context navigation family.

It decides whether the item is a native destination link or a native utility button, preserves the minimum target size and visible focus treatment, and exposes current and disabled semantics without inventing later-layer navigation styling.

## Required Inputs

- `label`: non-empty accessible name and visible short label.
- `kind`: `destination` or `utility`.
- `state`: `resting`, `current`, or `disabled`.
- `href`: required for enabled destination items.
- `value`: optional activation payload for utility controls.
- `icon`: optional decorative glyph name from the selected system glyph
  registry.

## Token Dependencies

- `context-navigation-frame`
- `context-navigation-item-affordance`
- `minimum-target-size`
- `focus-ring`
- `label-text-style`
- `icon-size`
- `tooltip-surface`
- `tooltip-text-style`

The primitive may consume these token seams only through the signed runtime modules. It must not copy frame, target, focus, label, icon-size, or tooltip values into app CSS.

## System Dependencies

- `default` glyph registry for decorative item icons.

## Icon Button Boundary

This primitive intentionally does not compose `icon-button-control`.
`icon-button-control` is a generic icon-only native button based on
`button-frame`; this primitive must also render destination links, visible
labels, current destination semantics, and context-navigation item-affordance
tokens.

## Behavior

- Destination items render as native links with `href`.
- Current destination items expose `aria-current="page"`.
- Utility items render as native `button type="button"` controls.
- Enabled utility items emit `context-navigation-item-control:activate`.
- Disabled items render as native disabled buttons and deny activation.
- Keyboard behavior follows native link and button behavior.
- Focus remains on the activated control unless downstream routing changes the page.
- Pointer hover and keyboard focus disclose a governed tooltip containing the
  item label; `Escape` dismisses the tooltip without activating the item.

## Accessibility

- Every rendered item has an accessible name from `label`.
- The visual icon slot is `aria-hidden` and cannot replace the text label.
- Current meaning is programmatic at this layer and visual affordance comes from `context-navigation-item-affordance`.
- The primitive must preserve the signed minimum target size and visible focus ring.
- The primitive owns the item-label tooltip disclosure for icon-only rail
  presentation; long visible-label truncation remains out of scope.

## Consumer Boundary

Allowed:

- Use for one governed context-navigation destination or utility control.
- Compose inside later context-navigation rail, bottom-bar, drawer, or overflow patterns after their gates pass.

Denied:

- Do not use this primitive to define rail layout, bottom-bar pinning, drawer behavior, More-menu overflow, or page-shell placement.
- Do not invent context-navigation current-state styling in this primitive.
- Do not nest another focusable control inside this item.
- Do not copy this route's proof markup into app pages.
- Do not add local ellipsis, clipping, or alternate tooltip behavior for long
  labels.

## Proof

Default proof route:

- `/design-system/default/primitives/context-navigation-item-control`
- `src/frontend/designSystem/systems/default/primitives/context-navigation-item-control/index.html`

Runtime seam:

- `src/frontend/designSystem/layers/03-primitive/context-navigation-item-control/index.mjs`

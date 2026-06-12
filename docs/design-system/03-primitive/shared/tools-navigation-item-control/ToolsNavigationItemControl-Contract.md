# Tools Navigation Item Control Primitive Contract

Layer: 03-primitive  
Family: tools-navigation  
Status: review-ready

## Purpose

`tools-navigation-item-control` governs one native tool action button inside
the tools-navigation rail.

## Token Dependencies

- `tools-navigation-frame`
- `button-frame`
- `focus-ring`
- `minimum-target-size`
- `icon-size`

## Primitive Dependencies

- `icon-button-control`

## System Dependencies

- `default` glyph registry for decorative tool icons.

## Icon Button Boundary

This primitive composes `icon-button-control` for governed icon-only button
anatomy, glyph sizing, target sizing, focus behavior, and decorative icon
semantics.

`tools-navigation-item-control` adds the tools-navigation-specific active,
unavailable, sizing, and activation-event boundary. It must not recreate a
parallel tools-only button anatomy.

## States

- `resting`
- `active`
- `unavailable`

## Behavior

- The primitive renders one native button through `icon-button-control`.
- The visible icon is decorative; the button's accessible name comes from the
  required label.
- Enabled controls emit `tools-navigation-item-control:activate`.
- Active controls expose `aria-pressed="true"`.
- Unavailable controls expose `aria-disabled="true"`, remain named, and emit no
  activation event.

## Consumer Boundary

Allowed:

- Use for one governed tools-navigation action control.

Denied:

- Do not use for tool payloads, panel behavior, mobile tools behavior, route
  destinations, component props, or app-local CSS.

## Proof

Default proof route:

- `/design-system/default/primitives/tools-navigation-item-control`

Runtime seam:

- `src/frontend/designSystem/layers/03-primitive/tools-navigation-item-control/index.mjs`

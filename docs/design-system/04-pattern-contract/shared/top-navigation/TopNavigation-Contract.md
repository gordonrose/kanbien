# Top Navigation Pattern Contract

Layer: `04-pattern-contract`  
Family: `top-navigation`  
Status: `review-ready`

## Purpose

`top-navigation` composes governed brand, destination-link, and trigger
primitives into the standard top chrome navigation pattern.

## Dependencies

Tokens:

- `top-navigation-frame`
- `standard-page-shell-frame`

Primitives:

- `top-navigation-brand-control`
- `top-navigation-link-control`
- `top-navigation-trigger-control`

## Composition

- Desktop mode renders the brand link, all primary destinations, and profile
  trigger.
- Overflow mode renders the brand link, the first two primary destinations,
  a `More` trigger, and an overflow menu containing remaining destinations.
- Mobile mode renders the brand link and one mobile trigger; destinations and
  profile links move into the mobile surface.
- Auto mode resolves from rendered inline size and governed child-control
  minimum widths: wide proof width keeps desktop, intermediate proof widths
  move overflowing destinations into `More` one by one, and narrow proof width
  moves to mobile before wrapping, clipping, or overlap.
- Current destination semantics are delegated to `top-navigation-link-control`.
- Expanded trigger semantics are delegated to `top-navigation-trigger-control`.
- Outside click and `Escape` close open top-navigation surfaces and restore
  focus to the owning trigger.
- Overflow and profile surfaces anchor to their owning trigger. The mobile
  surface fills the physical viewport width in both LTR and RTL.

## Review Evidence

The default proof route must expose controls for mode, open surface, theme,
direction, and proof width. Proof-width values are diagnostic review pressure
only; they are not pattern runtime tokens or downstream consumable values.

The rendered proof must verify original, dark, and desert themes, LTR and RTL
direction, automatic desktop-to-overflow-to-mobile resize behavior, overflow
menu alignment to the `More` trigger, viewport-width mobile surface geometry,
and `Escape` dismissal with focus restoration.

## Consumer Boundary

Allowed:

- Use for governed top-navigation chrome composition.

Denied:

- Do not use for component props, app routing, profile data loading,
  authorization, standard-page-shell adoption by copy, or app-local CSS.

## Source Material

- Behavior rule: `docs/design-system/01-behavior-rule/shared/top-navigation/TopNavigation-Behaviour.md`
- Behavior lock: `docs/workspace/design-system/behavior-locks/top-nav-behavior-lock.md`
- Reference pack: `docs/workspace/design-system/reference-packs/top-nav-reference-pack.md`

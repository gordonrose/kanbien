# Top Navigation Brand Control Primitive Contract

Layer: `03-primitive`  
Family: `top-navigation`  
Status: `review-ready`

## Purpose

`top-navigation-brand-control` owns the governed native brand home link used by
the top-navigation pattern.

It renders one native anchor with a decorative short mark, a governed text label,
signed focus treatment, signed target sizing, signed mark contrast, and
`truncating-label` for long brand labels.

## Dependencies

Tokens:

- `top-navigation-frame`
- `primary-tinted-background`
- `primary-tinted-foreground`
- `label-text-style`
- `focus-ring`
- `minimum-target-size`

Primitives:

- `truncating-label`

## Consumer Boundary

Allowed:

- Use for top-navigation brand/home links.

Denied:

- Do not use for destination links, triggers, product identity policy, logo
  artwork governance, route authorization, component seams, app adoption, or
  app-local CSS.

## Source Material

- Behavior rule: `docs/design-system/01-behavior-rule/shared/top-navigation/TopNavigation-Behaviour.md`
- Behavior lock: `docs/workspace/design-system/behavior-locks/top-nav-behavior-lock.md`
- Reference pack: `docs/workspace/design-system/reference-packs/top-nav-reference-pack.md`

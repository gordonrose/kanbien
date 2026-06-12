# Breadcrumb Trail Control Primitive Contract

Behavior rule: `docs/design-system/01-behavior-rule/shared/breadcrumb/Breadcrumb-Behaviour.md`

`breadcrumb-trail-control` is the governed breadcrumb primitive for real page
hierarchy links, current-page semantics, progressive reduction, and lightweight
hidden-path recovery.

It owns native link/current semantics, collapse and compact reveal controls,
focus return on dismissal, and long-label disclosure through the accepted
`truncating-label` primitive. It does not own row placement, search, route
generation, component props, or app adoption.

## Token And Primitive Dependencies

- `button-frame`
- `label-text-style`
- `focus-ring`
- `minimum-target-size`
- `tooltip-surface`
- `tooltip-text-style`
- `truncating-label`

## Behavior Boundary

- Render only real hierarchy items supplied by the consumer.
- Keep the current page visible in full and reduced states.
- Use reduction modes: `full`, `reduced-page-minus-one`,
  `reduced-middle`, `compact`, and `mobile-hidden`.
- In compact mode, hide the full trail and expose hidden path context through
  one trigger.
- Reveal surfaces close on outside click and `Escape`; focus returns to the
  triggering control.
- Consumers must not recreate breadcrumb collapse, menus, current semantics,
  or tooltip behavior locally.

## Rendered Proof

Default proof route:
`/design-system/default/primitives/breadcrumb-trail-control`

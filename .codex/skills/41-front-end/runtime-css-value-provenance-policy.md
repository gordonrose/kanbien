# Runtime CSS Value Provenance Policy

This policy governs the first executable audit for runtime CSS values in the
`41-front-end` harness.

## Purpose

Runtime CSS in governed design-system seams must not silently invent visual
values. A CSS declaration in governed runtime selectors should be traceable to
one of:

- a signed Layer 2 token exposed as a CSS variable
- a governed primitive or child pattern variable
- browser-native structural CSS
- an explicitly inherited governed value
- proof-only diagnostic pressure that is not downstream-consumable

## First Audit Scope

The first executable audit is intentionally conservative.

It covers governed runtime selectors in:

- `src/frontend/designSystem/systems/default/assets/styles.css`

It starts with selectors for currently governed Layer 3 and Layer 4 seams:

- `.ds-index-nav*`
- `.ds-truncating-label*`

It does not audit legacy/pre-governed route selectors yet.

## Initial Failures

Within the scoped governed selectors, fail:

- literal color values such as hex, `rgb()`, `rgba()`, `hsl()`, `hsla()`, or
  `color-mix()` in runtime declarations
- custom `scrollbar-*` values other than browser-native `auto`

## Initial Allowed Values

The first audit allows:

- `var(...)`
- `inherit`
- `currentColor`
- `transparent`
- `none`
- `auto`
- browser-native layout keywords
- numeric layout mechanics such as `0`, `100%`, `1fr`, and grid/flex keywords

This is not a claim that every allowed value is permanently governed. It is a
conservative first pass that catches unambiguous visual-value inventions while
avoiding noisy false positives.

## Future Expansion

Later passes should classify more value categories, including spacing, width,
height, radius, shadow, motion, z-index, and border thickness. Those passes
need a richer allowlist so they do not punish browser-native layout mechanics
or proof-only diagnostics.

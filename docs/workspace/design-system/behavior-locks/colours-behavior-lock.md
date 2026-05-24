# Colours Behavior Lock

## Scope

`Colours` is the reusable semantic colour scale review surface for design-system
and app-facing tokens.

## Behavior Contract

- `COL-001`: The colour route presents semantic colour values as reusable
  decisions, not route-local swatches.
- `COL-002`: Primary/accent colour choices remain centralized through shared
  shell accent controls.
- `COL-003`: Text colours must stay distinct from surface and border colours.
- `COL-004`: Success, warning, and error colours are semantic state colours,
  not arbitrary decorative variants.
- `COL-005`: Dark and desert theme colours remain separate from normal theme
  colours.
- `COL-006`: Colour previews must expose token names or CSS variables so app
  consumers can use semantic values.
- `COL-007`: Direction changes do not alter colour meaning.
- `COL-008`: Magnification must not make colour labels or swatches overlap.
- `COL-009`: Colour tokens do not define layout, component anatomy, or
  production copy.

## Adoption Rule

App consumers must use semantic colour variables instead of raw literals when a
signed-off semantic token exists.

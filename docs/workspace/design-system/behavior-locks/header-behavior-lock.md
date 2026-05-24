# Header Behavior Lock

## Scope

`Header` is the reusable typography token seam for heading hierarchy.

## Behavior Contract

- `HDR-001`: Header token definitions are rendered from
  `tokenHeaderModel.mjs`.
- `HDR-002`: `header.1` through `header.6` provide the approved heading scale.
- `HDR-003`: Header weights stay heavier than paragraph weights.
- `HDR-004`: Header line heights stay tighter than paragraph body copy where
  approved by the model.
- `HDR-005`: `header.6` uses the approved uppercase compact treatment.
- `HDR-006`: Normal, dark, and desert heading ink variants are shown for every
  header definition.
- `HDR-007`: Header token previews must expose token name, size, line height,
  weight, case, and ink variables.
- `HDR-008`: Header tokens do not define page layout, container spacing, or
  section hierarchy by themselves.
- `HDR-009`: First consumers must prove long heading behavior in their actual
  wrapper before adoption is marked complete.

## Adoption Rule

App headings must consume the shared header token class or semantic variable
when they map to the approved heading hierarchy.

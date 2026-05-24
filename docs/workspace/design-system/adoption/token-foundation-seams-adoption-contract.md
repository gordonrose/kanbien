# Token Foundation Seams Adoption Contract

## Scope

This contract governs first real-app use of the signed-off token foundation
seams promoted from `/design-system/tokens`.

## Approved Source Of Truth

- Behavior lock:
  `docs/workspace/design-system/behavior-locks/token-foundation-seams-behavior-lock.md`
- Reference pack:
  `docs/workspace/design-system/reference-packs/token-foundation-seams-reference-pack.md`
- Pattern artifact:
  `docs/workspace/design-system/patterns/token-foundation-seams-pattern.md`
- Component artifact:
  `docs/workspace/design-system/components/token-foundation-seams-component.md`
- Token candidacy review:
  `docs/workspace/design-system/token-reviews/token-foundation-seams-token-candidacy-review.md`

## Adoption Rules

- App consumers must use the shared design-system seam, token class, CSS
  variable, or controller contract named by the component artifact.
- App consumers must not copy token route HTML as app implementation.
- App consumers must not redefine signed-off token values in app-page CSS.
- App consumers must not introduce unsupported variants without returning to
  the design-system loop.
- First consumers must compare their rendered result against the matching
  `TFS-*` reference route before adoption is marked complete.

## First Consumer Targets

| Seam | First Consumer Target |
| --- | --- |
| `background` | shared app page backgrounds and future page structures |
| `container` | shared app surface containers |
| `container-section` | repeated container subsections |
| `colours` | semantic state treatment across controls and content |
| `paragraph` | shared app typography |
| `header` | shared heading hierarchy |
| `icon-button` | shared icon-only command buttons |
| `tooltip` | shared lightweight tooltip layer |
| `entity-page-structure` | future entity record page families |
| `nested-entity-record` | nested record panels inside entity workflows |
| `filter-panel-structure` | collection/list filter overlays |

## Required First-Consumer Evidence

- Name the consuming app route or shared app component.
- Identify the exact design-system seam consumed.
- Prove app code consumes the shared seam instead of copying route markup.
- Capture rendered parity against the matching token route.
- Verify theme, direction, magnification, and responsive behavior where the
  consumer supports those modes.
- Verify keyboard and focus behavior for interactive seams.
- Record any intentional product-specific deviations before implementation.

## Compatibility Notes

- Existing app-local CSS may remain until an explicit migration touches that
  surface, but new governed app UI should consume these seams.
- If a surface cannot consume the shared seam cleanly, pause adoption and
  return to the design-system loop rather than adding app-page CSS.
- Generated canonical render pages are not required for this first promotion
  pass, but may be required later for high-change or high-risk consumers.

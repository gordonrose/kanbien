# Visual Proof Surface Brochure Proof

## Proof Metadata

| Field | Value |
| --- | --- |
| Shared primitive contract | `docs/design-system/03-primitive/shared/visual-proof-surface/VisualProofSurface-Contract.md` |
| System key | `brochure` |
| Proof status | `review-ready` |
| Runtime seam | `src/frontend/designSystem/layers/03-primitive/visual-proof-surface/index.mjs#visualProofSurfacePrimitive` |
| Proof route | `/design-system/brochure/primitives/visual-proof-surface` |

## Proof Summary

The brochure proof renders one non-interactive decorative proof surface from the
Layer 3 runtime seam.

It verifies that the primitive consumes:

- `visual-proof-ornament` for decorative grid and overlay backdrop material
- `surface-frame` for the surrounding proof surface frame

The proof route does not approve diagram stage composition, workflow state,
semantic labels, chips, connector paths, markers, selected state, validation
state, or app adoption.

## Evidence Requirements

| Area | Evidence |
| --- | --- |
| Rendered route | `/design-system/brochure/primitives/visual-proof-surface` returns `200`. |
| Token consumption | Unit tests verify token names and variants are resolved from the brochure runtime seams. |
| Accessibility | The rendered primitive is `aria-hidden="true"` and non-focusable. |
| Boundary | Later patterns must consume the runtime seam instead of copying the proof route markup. |

## Next Layer

The next allowed layer is `04-pattern-contract` for a composed visual proof
diagram pattern.

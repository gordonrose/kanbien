# Visual Proof Diagram Brochure Proof

## Proof Metadata

| Field | Value |
| --- | --- |
| Shared pattern contract | `docs/design-system/04-pattern-contract/shared/visual-proof-diagram/VisualProofDiagram-Contract.md` |
| System key | `brochure` |
| Proof status | `review-ready` |
| Runtime seam | `src/frontend/designSystem/layers/04-pattern-contract/visual-proof-diagram/index.mjs#visualProofDiagramPattern` |
| Proof route | `/design-system/brochure/patterns/visual-proof-diagram` |

## Proof Summary

The brochure proof renders a non-interactive ordered proof-flow diagram using
the `visual-proof-surface` primitive and signed brochure tokens.

It proves that semantic proof meaning is carried by ordered text stages while
surface, chips, connectors, accent, and marker visuals remain decorative.

## Evidence Requirements

| Area | Evidence |
| --- | --- |
| Rendered route | `/design-system/brochure/patterns/visual-proof-diagram` returns `200`. |
| Primitive consumption | Unit tests verify the pattern composes `visual-proof-surface`. |
| Token consumption | Unit tests verify direct token names are resolved from brochure seams. |
| Accessibility | The pattern renders a named section and ordered list; decorative children are hidden. |
| Boundary | Later layers must consume the runtime seam rather than copying proof route markup. |

## Next Layer

The next layer is `05-component-seam` if the brochure page needs an importable
component boundary before app adoption.

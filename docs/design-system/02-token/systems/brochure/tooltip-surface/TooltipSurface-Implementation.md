# Tooltip Surface Token Implementation - Brochure

| Field | Value |
| --- | --- |
| Token type | `tooltip-surface` |
| System key | `brochure` |
| Status | `review-ready` |
| Runtime seam | `src/frontend/designSystem/layers/02-token/tooltip-surface/systems/brochure.mjs#tooltipSurfaceTokenSpec` |
| Proof route | `/design-system/brochure/tokens/tooltip-surface` |

This implementation provides the brochure-specific full-text disclosure surface
used by governed brochure text-link primitives when a link label is truncated.
It does not define trigger behavior, placement, dismissal, or ARIA behavior.

## Evidence

- The runtime seam exports one `text overflow disclosure surface` variant.
- The proof route renders the brochure tooltip surface sample.
- The brochure text-link primitive consumes this token for overflow disclosure.

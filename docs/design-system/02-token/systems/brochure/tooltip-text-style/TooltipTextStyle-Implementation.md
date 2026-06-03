# Tooltip Text Style Token Implementation - Brochure

| Field | Value |
| --- | --- |
| Token type | `tooltip-text-style` |
| System key | `brochure` |
| Status | `review-ready` |
| Runtime seam | `src/frontend/designSystem/layers/02-token/tooltip-text-style/systems/brochure.mjs#tooltipTextStyleTokenSpec` |
| Proof route | `/design-system/brochure/tokens/tooltip-text-style` |

This implementation provides the brochure-specific typography used inside
governed full-text disclosure surfaces for truncated brochure text links. It
does not define trigger behavior, placement, dismissal, or ARIA behavior.

## Evidence

- The runtime seam exports one `tooltip disclosure text` variant.
- The proof route renders the brochure disclosure text sample.
- The brochure text-link primitive consumes this token for overflow disclosure.

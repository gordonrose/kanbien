# Brochure Link Decoration Token Implementation

## Implementation Metadata

| Field | Value |
| --- | --- |
| Shared contract | `docs/design-system/02-token/shared/link-decoration/LinkDecoration-Contract.md` |
| System key | `brochure` |
| Status | `review-ready` |
| Runtime seam | `src/frontend/designSystem/layers/02-token/link-decoration/systems/brochure.mjs#linkDecorationTokenSpec` |
| Proof route | `/design-system/brochure/tokens/link-decoration` |

## Implementation Summary

The brochure implementation promotes the current public brochure text-link
underline treatment into a reusable token seam so link meaning is not carried
by color alone.

The token is scoped to standalone text links and is not approved for inline
prose links, buttons, tabs, or selected-state indicators.

## Evidence

| Area | Proof |
| --- | --- |
| Runtime seam | `src/frontend/designSystem/layers/02-token/link-decoration/systems/brochure.mjs#linkDecorationTokenSpec` exports deterministic variants. |
| Proof route | `/design-system/brochure/tokens/link-decoration` renders the signed value. |
| Downstream blocker removed | `brochure-text-link-action` can consume link decoration after `link-text-style` is also available. |

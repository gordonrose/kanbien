# Brochure Link Text Style Token Implementation

## Implementation Metadata

| Field | Value |
| --- | --- |
| Shared contract | `docs/design-system/02-token/shared/link-text-style/LinkTextStyle-Contract.md` |
| System key | `brochure` |
| Status | `review-ready` |
| Runtime seam | `src/frontend/designSystem/layers/02-token/link-text-style/systems/brochure.mjs#linkTextStyleTokenSpec` |
| Proof route | `/design-system/brochure/tokens/link-text-style` |

## Implementation Summary

The brochure implementation promotes the current public brochure standalone
text-link typography and foreground treatment into a reusable token seam.

The token is intentionally scoped to standalone text links. Inline prose links
remain a separate decision because target sizing, wrapping, and text-flow
behavior differ.

## Evidence

| Area | Proof |
| --- | --- |
| Runtime seam | `src/frontend/designSystem/layers/02-token/link-text-style/systems/brochure.mjs#linkTextStyleTokenSpec` exports deterministic variants. |
| Proof route | `/design-system/brochure/tokens/link-text-style` renders the signed value. |
| Downstream blocker removed | `brochure-text-link-action` can consume link text style after `link-decoration` is also available. |

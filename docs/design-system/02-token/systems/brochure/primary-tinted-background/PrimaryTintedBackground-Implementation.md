# Primary Tinted Background Brochure Implementation

## Metadata

| Field | Value |
| --- | --- |
| Contract scope | `shared across design systems` |
| Implementation system | `brochure` |
| Token status | `review-ready` |
| Shared contract | `docs/design-system/02-token/shared/primary-tinted-background/PrimaryTintedBackground-Contract.md` |
| Runtime seam | `src/frontend/designSystem/layers/02-token/primary-tinted-background/systems/brochure.mjs` |
| Proof module | `src/frontend/designSystem/systems/brochure/tokens/proofs/primaryTintedBackground.tokens.mjs` |
| Proof route | `/design-system/brochure/tokens/primary-tinted-background` |

## Purpose

This implementation derives low-emphasis brochure primary tints from the
brochure primary color source token while preserving the shared background
contract.

## System Values

- Original tint: `color-mix(in srgb, #1f6f78 12%, white)`
- Dark tint: `color-mix(in srgb, #68b0a6 16%, #171b22)`
- Desert tint: `color-mix(in srgb, #c77d2a 12%, #fffaf0)`

## Consumer Rule

This token does not approve selected, active, status, or validation meaning.
Text-bearing use requires an approved foreground pairing.

## Evidence

Registered by `src/frontend/designSystem/systems/brochure/system.manifest.json`
and covered by the design-system registry and isolation guards.

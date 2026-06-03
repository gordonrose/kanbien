# Primary Tinted Foreground Brochure Implementation

## Metadata

| Field | Value |
| --- | --- |
| Contract scope | `shared across design systems` |
| Implementation system | `brochure` |
| Token status | `review-ready` |
| Shared contract | `docs/design-system/02-token/shared/primary-tinted-foreground/PrimaryTintedForeground-Contract.md` |
| Runtime seam | `src/frontend/designSystem/layers/02-token/primary-tinted-foreground/systems/brochure.mjs` |
| Proof module | `src/frontend/designSystem/systems/brochure/tokens/proofs/primaryTintedForeground.tokens.mjs` |
| Proof route | `/design-system/brochure/tokens/primary-tinted-foreground` |

## Purpose

This implementation pairs readable brochure foreground mappings with the
brochure primary-tinted background token.

## System Values

- Original foreground: `color-mix(in srgb, #1f6f78 48%, #111827)`
- Dark foreground: `color-mix(in srgb, #68b0a6 22%, #f4f7fb)`
- Desert foreground: `color-mix(in srgb, #c77d2a 38%, #493327)`

## Consumer Rule

Use only on the paired brochure primary-tinted background until broader
foreground/background pairings are signed.

## Evidence

Registered by `src/frontend/designSystem/systems/brochure/system.manifest.json`
and covered by the design-system registry and isolation guards.

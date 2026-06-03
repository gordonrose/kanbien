# Label Text Style Brochure Implementation

## Metadata

| Field | Value |
| --- | --- |
| Contract scope | `shared across design systems` |
| Implementation system | `brochure` |
| Token status | `review-ready` |
| Shared contract | `docs/design-system/02-token/shared/label-text-style/LabelTextStyle-Contract.md` |
| Runtime seam | `src/frontend/designSystem/layers/02-token/label-text-style/systems/brochure.mjs` |
| Proof module | `src/frontend/designSystem/systems/brochure/tokens/proofs/labelTextStyle.tokens.mjs` |
| Proof route | `/design-system/brochure/tokens/label-text-style` |

## Purpose

This implementation gives brochure compact labels a stronger editorial weight
without changing shared overflow or accessibility behavior.

## System Values

- Font family: `Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif`
- Font size: `0.9rem`
- Font weight: `800`
- Line height: `1.2`
- Letter spacing: `0`
- Text transform: `none`

## Consumer Rule

Use as a complete short-label text style. Do not reconstruct the individual
font literals in downstream app CSS.

## Evidence

Registered by `src/frontend/designSystem/systems/brochure/system.manifest.json`
and covered by the design-system registry and isolation guards.

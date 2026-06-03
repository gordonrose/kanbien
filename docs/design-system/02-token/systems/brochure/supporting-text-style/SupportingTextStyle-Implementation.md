# Supporting Text Style Brochure Implementation

## Metadata

| Field | Value |
| --- | --- |
| Contract scope | `shared across design systems` |
| Implementation system | `brochure` |
| Token status | `review-ready` |
| Shared contract | `docs/design-system/02-token/shared/supporting-text-style/SupportingTextStyle-Contract.md` |
| Runtime seam | `src/frontend/designSystem/layers/02-token/supporting-text-style/systems/brochure.mjs` |
| Proof module | `src/frontend/designSystem/systems/brochure/tokens/proofs/supportingTextStyle.tokens.mjs` |
| Proof route | `/design-system/brochure/tokens/supporting-text-style` |

## Purpose

This implementation gives brochure supporting copy a calmer public-site rhythm
while keeping shared overflow behavior outside the token layer.

## System Values

- Font family: `Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif`
- Font size: `1rem`
- Font weight: `400`
- Line height: `1.6`
- Letter spacing: `0`
- Text transform: `none`

## Consumer Rule

Use for supporting copy in governed brochure primitives and patterns. This
token does not define status, error, body-copy hierarchy, or tooltip behavior.

## Evidence

Registered by `src/frontend/designSystem/systems/brochure/system.manifest.json`
and covered by the design-system registry and isolation guards.

# Primary Color Source Brochure Implementation

## Metadata

| Field | Value |
| --- | --- |
| Contract scope | `shared across design systems` |
| Implementation system | `brochure` |
| Token status | `review-ready` |
| Shared contract | `docs/design-system/02-token/shared/primary-color-source/PrimaryColorSource-Contract.md` |
| Runtime seam | `src/frontend/designSystem/layers/02-token/primary-color-source/systems/brochure.mjs` |
| Proof module | `src/frontend/designSystem/systems/brochure/tokens/proofs/primaryColorSource.tokens.mjs` |
| Proof route | `/design-system/brochure/tokens/primary-color-source` |

## Purpose

This implementation defines the brochure primary accent sources that derived
color tokens may reference without changing shared token behavior.

## System Values

- Original source: `#1f6f78`
- Dark source: `#68b0a6`
- Desert source: `#c77d2a`

## Consumer Rule

Downstream color tokens may derive from these values only through governed
brochure seams and must prove their own contrast and state semantics.

## Evidence

Registered by `src/frontend/designSystem/systems/brochure/system.manifest.json`
and covered by the design-system registry and isolation guards.

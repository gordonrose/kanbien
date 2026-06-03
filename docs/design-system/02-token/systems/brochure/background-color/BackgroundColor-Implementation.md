# Background Color Brochure Implementation

## Metadata

| Field | Value |
| --- | --- |
| Contract scope | `shared across design systems` |
| Implementation system | `brochure` |
| Token status | `review-ready` |
| Shared contract | `docs/design-system/02-token/shared/background-color/BackgroundColor-Contract.md` |
| Runtime seam | `src/frontend/designSystem/layers/02-token/background-color/systems/brochure.mjs` |
| Proof module | `src/frontend/designSystem/systems/brochure/tokens/proofs/backgroundColor.tokens.mjs` |
| Proof route | `/design-system/brochure/tokens/background-color` |

## Purpose

This implementation keeps the shared background roles stable while giving the
brochure system its public editorial palette.

## System Values

- Original page: `#f6f8f3`
- Original surface: `#fffdf8`
- Original subtle: `#fbf2df`
- Dark page: `#162126`
- Dark surface: `#223139`
- Dark subtle: `#2c4149`
- Desert page: `#f7efe1`
- Desert surface: `#fff8ec`
- Desert subtle: `#ead7b8`

## Consumer Rule

Consumers must import the brochure runtime seam for brochure surfaces. The
default system must continue to import the default runtime seam.

## Evidence

Registered by `src/frontend/designSystem/systems/brochure/system.manifest.json`
and covered by the design-system registry and isolation guards.

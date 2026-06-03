# Focus Ring Brochure Implementation

## Metadata

| Field | Value |
| --- | --- |
| Contract scope | `shared across design systems` |
| Implementation system | `brochure` |
| Token status | `review-ready` |
| Shared contract | `docs/design-system/02-token/shared/focus-ring/FocusRing-Contract.md` |
| Runtime seam | `src/frontend/designSystem/layers/02-token/focus-ring/systems/brochure.mjs` |
| Proof module | `src/frontend/designSystem/systems/brochure/tokens/proofs/focusRing.tokens.mjs` |
| Proof route | `/design-system/brochure/tokens/focus-ring` |

## Purpose

This implementation derives visible focus rings from the brochure primary color
source while preserving no-layout-shift focus behavior.

## System Values

Each theme uses `0.125rem solid color-mix(in srgb, <primary source> 58%, white)`
with a `0.125rem` offset.

## Consumer Rule

This token is focus visibility only. It does not define selected, active,
warning, error, or validation meaning.

## Evidence

Registered by `src/frontend/designSystem/systems/brochure/system.manifest.json`
and covered by the design-system registry and isolation guards.

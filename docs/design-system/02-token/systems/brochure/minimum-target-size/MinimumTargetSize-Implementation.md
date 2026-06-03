# Minimum Target Size Brochure Implementation

## Metadata

| Field | Value |
| --- | --- |
| Contract scope | `shared across design systems` |
| Implementation system | `brochure` |
| Token status | `review-ready` |
| Shared contract | `docs/design-system/02-token/shared/minimum-target-size/MinimumTargetSize-Contract.md` |
| Runtime seam | `src/frontend/designSystem/layers/02-token/minimum-target-size/systems/brochure.mjs` |
| Proof module | `src/frontend/designSystem/systems/brochure/tokens/proofs/minimumTargetSize.tokens.mjs` |
| Proof route | `/design-system/brochure/tokens/minimum-target-size` |

## Purpose

This implementation intentionally preserves the shared interactive target-size
behavior for the brochure system.

## System Values

The brochure system keeps the same minimum target-size values as default
because the accessibility requirement does not vary by visual skin.

## Consumer Rule

Visual variants may change, but interactive targets must continue to satisfy
the governed size and spacing constraints.

## Evidence

Registered by `src/frontend/designSystem/systems/brochure/system.manifest.json`
and covered by the design-system registry and isolation guards.

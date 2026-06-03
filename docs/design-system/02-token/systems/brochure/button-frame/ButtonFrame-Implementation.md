# Button Frame Brochure Implementation

## Metadata

| Field | Value |
| --- | --- |
| Contract scope | `shared across design systems` |
| Implementation system | `brochure` |
| Token status | `review-ready` |
| Shared contract | `docs/design-system/02-token/shared/button-frame/ButtonFrame-Contract.md` |
| Runtime seam | `src/frontend/designSystem/layers/02-token/button-frame/systems/brochure.mjs` |
| Proof module | `src/frontend/designSystem/systems/brochure/tokens/proofs/buttonFrame.tokens.mjs` |
| Proof route | `/design-system/brochure/tokens/button-frame` |

## Purpose

This implementation composes brochure background, primary, foreground, and
label text tokens into reusable button frame values.

## System Values

Quiet frames use the signed host surface directly. Subtle frames mix the
brochure primary source `10%` over the host surface and use a border mixed
`30%` from the same source.

## Consumer Rule

Button primitives must pair this frame token with focus-ring, minimum-target
size, accessible names, and native button semantics.

## Evidence

Registered by `src/frontend/designSystem/systems/brochure/system.manifest.json`
and covered by the design-system registry and isolation guards.

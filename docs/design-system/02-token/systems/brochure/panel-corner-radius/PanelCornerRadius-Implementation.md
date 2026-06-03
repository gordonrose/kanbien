# Panel Corner Radius Brochure Implementation

## Metadata

| Field | Value |
| --- | --- |
| Contract scope | `shared across design systems` |
| Implementation system | `brochure` |
| Token status | `review-ready` |
| Shared contract | `docs/design-system/02-token/shared/panel-corner-radius/PanelCornerRadius-Contract.md` |
| Runtime seam | `src/frontend/designSystem/layers/02-token/panel-corner-radius/systems/brochure.mjs` |
| Proof module | `src/frontend/designSystem/systems/brochure/tokens/proofs/panelCornerRadius.tokens.mjs` |
| Proof route | `/design-system/brochure/tokens/panel-corner-radius` |

## Purpose

This implementation gives brochure panels their restrained editorial radius
while keeping the shared panel-corner contract stable.

## System Values

- Panel corner radius: `0.5rem`

## Consumer Rule

This token approves brochure panel containers only. Buttons, chips, tooltips,
items, and decorative cards need their own governed token decisions.

## Evidence

Registered by `src/frontend/designSystem/systems/brochure/system.manifest.json`
and covered by the design-system registry and isolation guards.

# Layer 3 Primitive Readiness Index

This index prevents primitive templates, examples, route-local markup, or app
fragments from being mistaken for governed primitive contracts.

A primitive is consumable by later layers only when it has a review-ready or
accepted shared primitive contract, any required system proof for the selected
design system, and signed token dependencies for that system.

## Consumable For Later Layers

| Primitive | Shared contract status | System key | System proof status | Runtime seam | Token dependencies | Evidence |
| --- | --- | --- | --- | --- | --- | --- |
| `surface-foundation` | `review-ready` | `default` | `review-ready` | `src/frontend/designSystem/layers/03-primitive/surface-foundation/index.mjs#surfaceFoundationPrimitive` | `src/frontend/designSystem/layers/02-token/background-color/systems/default.mjs#backgroundColorTokenSpec` | `docs/design-system/03-primitive/shared/surface-foundation/SurfaceFoundation-Contract.md`; `docs/design-system/03-primitive/systems/default/surface-foundation/SurfaceFoundation-Proof.md`; `docs/design-system/02-token/token-readiness-index.md`; `tests/unit/designSystem/surfaceFoundationPrimitive.test.ts` |
| `truncating-label` | `accepted` | `default` | `accepted` | `src/frontend/designSystem/layers/03-primitive/truncating-label/index.mjs#truncatingLabelPrimitive` | `src/frontend/designSystem/layers/02-token/label-text-style/systems/default.mjs#labelTextStyleTokenSpec`; `src/frontend/designSystem/layers/02-token/tooltip-surface/systems/default.mjs#tooltipSurfaceTokenSpec`; `src/frontend/designSystem/layers/02-token/tooltip-text-style/systems/default.mjs#tooltipTextStyleTokenSpec`; `src/frontend/designSystem/layers/02-token/focus-ring/systems/default.mjs#focusRingTokenSpec`; `src/frontend/designSystem/layers/02-token/minimum-target-size/systems/default.mjs#minimumTargetSizeTokenSpec` | `docs/design-system/03-primitive/shared/truncating-label/TruncatingLabel-Contract.md`; `docs/design-system/03-primitive/systems/default/truncating-label/TruncatingLabel-Proof.md`; `docs/design-system/02-token/token-readiness-index.md`; `tests/unit/designSystem/truncatingLabelPrimitive.test.ts`; `tests/visual/designSystem/primitives/truncatingLabelPrimitiveRoute.spec.ts`; rendered view `/design-system/default/primitives/truncating-label` |

## Template Only Or Not Yet Created

The Layer 3 harness is active. Interactive primitives such as `button`,
`icon-button`, `input`, `checkbox`, `radio`, and `switch` are still not
consumable because their required focus, sizing, text, border, and state tokens
are not signed in the Layer 2 readiness index.

## Update Rule

When a primitive moves out of template-only or missing status, update this index
in the same change as the shared primitive contract, any system proof artifact,
runtime seam planning or implementation, and focused verification evidence.

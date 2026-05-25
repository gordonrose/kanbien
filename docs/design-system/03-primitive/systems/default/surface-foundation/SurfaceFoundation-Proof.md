# Surface Foundation Default Proof

## Proof Metadata

| Field | Value |
| --- | --- |
| Proof system | `default` |
| Shared primitive contract | `docs/design-system/03-primitive/shared/surface-foundation/SurfaceFoundation-Contract.md` |
| System proof path | `docs/design-system/03-primitive/systems/default/surface-foundation/SurfaceFoundation-Proof.md` |
| Token dependency | `background-color` |
| Token implementation | `docs/design-system/02-token/systems/default/background-color/BackgroundColor-Implementation.md` |
| Runtime token seam | `src/frontend/designSystem/layers/02-token/background-color/systems/default.mjs#backgroundColorTokenSpec` |
| Runtime primitive seam | `src/frontend/designSystem/layers/03-primitive/surface-foundation/index.mjs#surfaceFoundationPrimitive` |
| Proof status | `review-ready` |

## Purpose

This proof records that the `default` design system can satisfy the shared
`surface-foundation` primitive contract using the signed `background-color`
token implementation.

It uses a runtime data/spec helper. It does not create a visual proof route or
rendered primitive HTML.

## Token Proof

| Requirement | Evidence |
| --- | --- |
| Signed token dependency | `background-color` is review-ready for `default` in `docs/design-system/02-token/token-readiness-index.md`. |
| Shared token contract | `docs/design-system/02-token/shared/background-color/BackgroundColor-Contract.md` defines page, surface, and subtle foundation roles. |
| System implementation | `docs/design-system/02-token/systems/default/background-color/BackgroundColor-Implementation.md` proves original, dark, and desert variants for `default`. |
| Runtime seam | `src/frontend/designSystem/layers/02-token/background-color/systems/default.mjs#backgroundColorTokenSpec` is the governed Layer 2 token seam for later layers. |
| Runtime primitive seam | `src/frontend/designSystem/layers/03-primitive/surface-foundation/index.mjs#surfaceFoundationPrimitive` resolves allowed roles and themes from the signed token seam. |

## Contract Preservation

The `default` proof may vary visual background values only through the signed
`background-color` token implementation.

It must preserve the shared primitive contract:

- no interactive role
- no implicit landmark or grouping role
- no focus behavior
- no accessible-name requirement
- no product workflow meaning
- no local color literals
- no card, panel, layout, status, or component behavior

## Required Evidence Before Runtime Promotion

If a render helper or visual proof route is later implemented, verification
must include:

- desktop rendering
- mobile rendering
- text and child content not overlapping because of the primitive shell
- token consumption through the registered `default` background-color seam
- no added role, tab stop, or accessible name from the primitive itself

The current data/spec helper is verified by
`tests/unit/designSystem/surfaceFoundationPrimitive.test.ts`.

## System Proof Boundary

This proof is specific to the `default` design system.

Another design system must add its own proof under
`docs/design-system/03-primitive/systems/<system-key>/surface-foundation/`
before later layers may consume `surface-foundation` for that system.

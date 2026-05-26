# Truncating Label Default Proof

## Proof Metadata

| Field | Value |
| --- | --- |
| Shared primitive contract | `docs/design-system/03-primitive/shared/truncating-label/TruncatingLabel-Contract.md` |
| System proof path | `docs/design-system/03-primitive/systems/default/truncating-label/TruncatingLabel-Proof.md` |
| Reference proof system | `default` |
| Runtime primitive seam | `src/frontend/designSystem/layers/03-primitive/truncating-label/index.mjs#truncatingLabelPrimitive` |
| Render helper | `src/frontend/designSystem/layers/03-primitive/truncating-label/index.mjs#renderTruncatingLabelPrimitive` |
| Controller helper | `src/frontend/designSystem/layers/03-primitive/truncating-label/index.mjs#attachTruncatingLabelPrimitiveController` |
| Rendered view | `/design-system/default/primitives/truncating-label` |
| Proof status | `accepted` |

## Purpose

This proof shows that the `default` design system can render the shared
`truncating-label` primitive using signed Layer 2 token seams.

The proof does not change shared primitive behavior, accessibility semantics,
state meaning, emitted events, or consumer obligations.

## Signed Token Evidence

| Token | Runtime seam | Use |
| --- | --- | --- |
| `label-text-style` | `src/frontend/designSystem/layers/02-token/label-text-style/systems/default.mjs#labelTextStyleTokenSpec` | Visible clipped label typography. |
| `tooltip-surface` | `src/frontend/designSystem/layers/02-token/tooltip-surface/systems/default.mjs#tooltipSurfaceTokenSpec` | Disclosure surface visuals. |
| `tooltip-text-style` | `src/frontend/designSystem/layers/02-token/tooltip-text-style/systems/default.mjs#tooltipTextStyleTokenSpec` | Disclosure text typography. |
| `focus-ring` | `src/frontend/designSystem/layers/02-token/focus-ring/systems/default.mjs#focusRingTokenSpec` | Keyboard focus visibility. |
| `minimum-target-size` | `src/frontend/designSystem/layers/02-token/minimum-target-size/systems/default.mjs#minimumTargetSizeTokenSpec` | Reachable focus, pointer, and touch target. |

## Runtime Proof

The runtime seam resolves signed token variants and returns a primitive spec
with:

- stable semantic attributes
- full text as the accessible value
- token-backed CSS variables
- disclosure state behavior
- consumer restrictions

The render helper owns the primitive HTML. The controller owns focus, hover,
tap toggle, and Escape disclosure behavior.

The render helper does not emit an inline `style` attribute. Token-derived
style declarations are carried through the primitive data contract and applied
by the primitive controller so the proof respects the repo CSP.

## Rendered Evidence

| Evidence Area | Proof |
| --- | --- |
| desktop | `tests/visual/designSystem/primitives/truncatingLabelPrimitiveRoute.spec.ts` checks truncation, containment, focus reveal, Escape dismissal, and full accessible value. |
| mobile | The same browser proof checks mobile containment, RTL stability, and touch/click toggle disclosure. |
| unit | `tests/unit/designSystem/truncatingLabelPrimitive.test.ts` checks token resolution, rejected inputs, unsupported systems, render ownership, route-local markup exclusion, and CSP-safe style transport. |
| live route | `http://localhost:3000/design-system/default/primitives/truncating-label` was checked with Playwright after the dev server restart; it rendered 3 labels, click opened, second click closed, and no console or page errors were reported. |

## Rendered View

| Field | Value |
| --- | --- |
| How to view | `/design-system/default/primitives/truncating-label` |
| Rendered view status | `available` |
| If unavailable | Do not consume this primitive in later layers. |

## Consumer Boundary

Later layers must consume the runtime primitive seam when they need this
behavior. They must not copy route-local proof markup or CSS.

The primitive may be composed into patterns only after Layer 4 is active.

# Layer 2 Token Readiness Index

This index prevents token-type templates from being mistaken for signed-off
token decisions.

A token type is consumable by later layers only when it has a review-ready or
accepted TokenDefinitionArtifact and a registered runtime seam for the selected
design system.

## Consumable For Later Layers

| Token type | System key | Token status | Runtime seam | Evidence |
| --- | --- | --- | --- | --- |
| `background-color` | `default` | `review-ready` | `src/frontend/designSystem/systems/default/tokens/definitions/backgroundColor.tokens.mjs` | `docs/design-system/02-token/background-color/tokens/BackgroundColor-Tokens.md`; `tests/visual/designSystem/tokens/backgroundColorTokenRoute.spec.ts`; `tests/integration/frontend/designSystemSystemRegistryGuard.test.ts` |

## Template Only

These token types have first-draft token-type templates. They are not signed
off token decisions and must not be consumed by primitives, patterns,
components, demos, canonicals, or app pages until a TokenDefinitionArtifact and
runtime seam exist for the selected design system.

- `border-color`
- `border-radius`
- `border-width`
- `breakpoint`
- `color-palette`
- `container-width`
- `density`
- `disabled-state`
- `elevation-shadow`
- `error-state`
- `focus-ring`
- `font-size`
- `font-weight`
- `gap`
- `icon-size`
- `letter-spacing`
- `line-height`
- `loading-state`
- `margin`
- `minimum-target-size`
- `motion-duration`
- `motion-easing`
- `opacity`
- `outline`
- `padding`
- `semantic-color`
- `sizing`
- `spacing`
- `success-state`
- `surface`
- `text-color`
- `theme`
- `typography-family`
- `warning-state`
- `z-index-layering`

## Update Rule

When a token type moves out of template-only status, update this index in the
same change as the TokenDefinitionArtifact, runtime seam, registry or manifest
wiring, and focused verification evidence.

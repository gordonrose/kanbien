# Layer 2 Token Readiness Index

This index prevents token-type templates from being mistaken for signed-off
token decisions.

A token type is consumable by later layers only when it has a review-ready or
accepted shared contract, a review-ready or accepted implementation artifact,
and a registered runtime seam for the selected design system.

## Consumable For Later Layers

| Token type | Shared contract status | System key | System implementation status | Governed runtime seam | Proof implementation | Evidence |
| --- | --- | --- | --- | --- | --- | --- |
| `background-color` | `review-ready` | `default` | `review-ready` | `src/frontend/designSystem/layers/02-token/background-color/systems/default.mjs#backgroundColorTokenSpec` | `src/frontend/designSystem/systems/default/tokens/proofs/backgroundColor.tokens.mjs` | `docs/design-system/02-token/shared/background-color/BackgroundColor-Contract.md`; `docs/design-system/02-token/systems/default/background-color/BackgroundColor-Implementation.md`; `tests/visual/designSystem/tokens/backgroundColorTokenRoute.spec.ts`; `tests/integration/frontend/designSystemSystemRegistryGuard.test.ts` |
| `focus-ring` | `review-ready` | `default` | `review-ready` | `src/frontend/designSystem/layers/02-token/focus-ring/systems/default.mjs#focusRingTokenSpec` | `src/frontend/designSystem/systems/default/tokens/proofs/focusRing.tokens.mjs` | `docs/design-system/02-token/shared/focus-ring/FocusRing-Contract.md`; `docs/design-system/02-token/systems/default/focus-ring/FocusRing-Implementation.md`; `tests/visual/designSystem/tokens/focusRingTokenRoute.spec.ts`; `tests/integration/frontend/designSystemSystemRegistryGuard.test.ts` |
| `icon-size` | `review-ready` | `default` | `review-ready` | `src/frontend/designSystem/layers/02-token/icon-size/systems/default.mjs#iconSizeTokenSpec` | `src/frontend/designSystem/systems/default/tokens/proofs/iconSize.tokens.mjs` | `docs/design-system/02-token/shared/icon-size/IconSize-Contract.md`; `docs/design-system/02-token/systems/default/icon-size/IconSize-Implementation.md`; `tests/unit/designSystem/iconSizeToken.test.ts`; `tests/visual/designSystem/tokens/iconSizeTokenRoute.spec.ts`; `tests/integration/frontend/designSystemSystemRegistryGuard.test.ts` |
| `index-nav-item-current-indicator` | `review-ready` | `default` | `review-ready` | `src/frontend/designSystem/layers/02-token/index-nav-item-current-indicator/systems/default.mjs#indexNavItemCurrentIndicatorTokenSpec` | `src/frontend/designSystem/systems/default/tokens/proofs/indexNavItemCurrentIndicator.tokens.mjs` | `docs/design-system/02-token/shared/index-nav-item-current-indicator/IndexNavItemCurrentIndicator-Contract.md`; `docs/design-system/02-token/systems/default/index-nav-item-current-indicator/IndexNavItemCurrentIndicator-Implementation.md`; `tests/visual/designSystem/tokens/indexNavItemCurrentIndicatorTokenRoute.spec.ts`; `tests/integration/frontend/designSystemSystemRegistryGuard.test.ts` |
| `index-nav-item-gap` | `review-ready` | `default` | `review-ready` | `src/frontend/designSystem/layers/02-token/index-nav-item-gap/systems/default.mjs#indexNavItemGapTokenSpec` | `src/frontend/designSystem/systems/default/tokens/proofs/indexNavItemGap.tokens.mjs` | `docs/design-system/02-token/shared/index-nav-item-gap/IndexNavItemGap-Contract.md`; `docs/design-system/02-token/systems/default/index-nav-item-gap/IndexNavItemGap-Implementation.md`; `tests/visual/designSystem/tokens/indexNavItemFrameTokenRoutes.spec.ts`; `tests/integration/frontend/designSystemSystemRegistryGuard.test.ts` |
| `index-nav-item-padding` | `review-ready` | `default` | `review-ready` | `src/frontend/designSystem/layers/02-token/index-nav-item-padding/systems/default.mjs#indexNavItemPaddingTokenSpec` | `src/frontend/designSystem/systems/default/tokens/proofs/indexNavItemPadding.tokens.mjs` | `docs/design-system/02-token/shared/index-nav-item-padding/IndexNavItemPadding-Contract.md`; `docs/design-system/02-token/systems/default/index-nav-item-padding/IndexNavItemPadding-Implementation.md`; `tests/visual/designSystem/tokens/indexNavItemFrameTokenRoutes.spec.ts`; `tests/integration/frontend/designSystemSystemRegistryGuard.test.ts` |
| `index-nav-item-radius` | `review-ready` | `default` | `review-ready` | `src/frontend/designSystem/layers/02-token/index-nav-item-radius/systems/default.mjs#indexNavItemRadiusTokenSpec` | `src/frontend/designSystem/systems/default/tokens/proofs/indexNavItemRadius.tokens.mjs` | `docs/design-system/02-token/shared/index-nav-item-radius/IndexNavItemRadius-Contract.md`; `docs/design-system/02-token/systems/default/index-nav-item-radius/IndexNavItemRadius-Implementation.md`; `tests/visual/designSystem/tokens/indexNavItemFrameTokenRoutes.spec.ts`; `tests/integration/frontend/designSystemSystemRegistryGuard.test.ts` |
| `index-nav-item-surface` | `review-ready` | `default` | `review-ready` | `src/frontend/designSystem/layers/02-token/index-nav-item-surface/systems/default.mjs#indexNavItemSurfaceTokenSpec` | `src/frontend/designSystem/systems/default/tokens/proofs/indexNavItemSurface.tokens.mjs` | `docs/design-system/02-token/shared/index-nav-item-surface/IndexNavItemSurface-Contract.md`; `docs/design-system/02-token/systems/default/index-nav-item-surface/IndexNavItemSurface-Implementation.md`; `tests/visual/designSystem/tokens/indexNavItemSurfaceTokenRoute.spec.ts`; `tests/integration/frontend/designSystemSystemRegistryGuard.test.ts` |
| `index-nav-item-supporting-text-style` | `review-ready` | `default` | `review-ready` | `src/frontend/designSystem/layers/02-token/index-nav-item-supporting-text-style/systems/default.mjs#indexNavItemSupportingTextStyleTokenSpec` | `src/frontend/designSystem/systems/default/tokens/proofs/indexNavItemSupportingTextStyle.tokens.mjs` | `docs/design-system/02-token/shared/index-nav-item-supporting-text-style/IndexNavItemSupportingTextStyle-Contract.md`; `docs/design-system/02-token/systems/default/index-nav-item-supporting-text-style/IndexNavItemSupportingTextStyle-Implementation.md`; `tests/visual/designSystem/tokens/indexNavItemSupportingTextStyleTokenRoute.spec.ts`; `tests/integration/frontend/designSystemSystemRegistryGuard.test.ts` |
| `index-nav-list-gap` | `review-ready` | `default` | `review-ready` | `src/frontend/designSystem/layers/02-token/index-nav-list-gap/systems/default.mjs#indexNavListGapTokenSpec` | `src/frontend/designSystem/systems/default/tokens/proofs/indexNavListGap.tokens.mjs` | `docs/design-system/02-token/shared/index-nav-list-gap/IndexNavListGap-Contract.md`; `docs/design-system/02-token/systems/default/index-nav-list-gap/IndexNavListGap-Implementation.md`; `tests/visual/designSystem/tokens/indexNavListGapTokenRoute.spec.ts`; `tests/integration/frontend/designSystemSystemRegistryGuard.test.ts` |
| `index-nav-panel-frame` | `review-ready` | `default` | `review-ready` | `src/frontend/designSystem/layers/02-token/index-nav-panel-frame/systems/default.mjs#indexNavPanelFrameTokenSpec` | `src/frontend/designSystem/systems/default/tokens/proofs/indexNavPanelFrame.tokens.mjs` | `docs/design-system/02-token/shared/index-nav-panel-frame/IndexNavPanelFrame-Contract.md`; `docs/design-system/02-token/systems/default/index-nav-panel-frame/IndexNavPanelFrame-Implementation.md`; `tests/unit/designSystem/indexNavPanelFrameToken.test.ts`; `tests/visual/designSystem/tokens/indexNavPanelFrameTokenRoute.spec.ts`; `tests/integration/frontend/designSystemSystemRegistryGuard.test.ts` |
| `label-text-style` | `review-ready` | `default` | `review-ready` | `src/frontend/designSystem/layers/02-token/label-text-style/systems/default.mjs#labelTextStyleTokenSpec` | `src/frontend/designSystem/systems/default/tokens/proofs/labelTextStyle.tokens.mjs` | `docs/design-system/02-token/shared/label-text-style/LabelTextStyle-Contract.md`; `docs/design-system/02-token/systems/default/label-text-style/LabelTextStyle-Implementation.md`; `tests/visual/designSystem/tokens/labelTextStyleTokenRoute.spec.ts`; `tests/integration/frontend/designSystemSystemRegistryGuard.test.ts` |
| `minimum-target-size` | `review-ready` | `default` | `review-ready` | `src/frontend/designSystem/layers/02-token/minimum-target-size/systems/default.mjs#minimumTargetSizeTokenSpec` | `src/frontend/designSystem/systems/default/tokens/proofs/minimumTargetSize.tokens.mjs` | `docs/design-system/02-token/shared/minimum-target-size/MinimumTargetSize-Contract.md`; `docs/design-system/02-token/systems/default/minimum-target-size/MinimumTargetSize-Implementation.md`; `tests/visual/designSystem/tokens/minimumTargetSizeTokenRoute.spec.ts`; `tests/integration/frontend/designSystemSystemRegistryGuard.test.ts` |
| `primary-color-source` | `review-ready` | `default` | `review-ready` | `src/frontend/designSystem/layers/02-token/primary-color-source/systems/default.mjs#primaryColorSourceTokenSpec` | `src/frontend/designSystem/systems/default/tokens/proofs/primaryColorSource.tokens.mjs` | `docs/design-system/02-token/shared/primary-color-source/PrimaryColorSource-Contract.md`; `docs/design-system/02-token/systems/default/primary-color-source/PrimaryColorSource-Implementation.md`; `tests/visual/designSystem/tokens/primaryColorSourceTokenRoute.spec.ts`; `tests/integration/frontend/designSystemSystemRegistryGuard.test.ts` |
| `primary-tinted-background` | `review-ready` | `default` | `review-ready` | `src/frontend/designSystem/layers/02-token/primary-tinted-background/systems/default.mjs#primaryTintedBackgroundTokenSpec` | `src/frontend/designSystem/systems/default/tokens/proofs/primaryTintedBackground.tokens.mjs` | `docs/design-system/02-token/shared/primary-tinted-background/PrimaryTintedBackground-Contract.md`; `docs/design-system/02-token/systems/default/primary-tinted-background/PrimaryTintedBackground-Implementation.md`; `tests/visual/designSystem/tokens/primaryTintedBackgroundTokenRoute.spec.ts`; `tests/integration/frontend/designSystemSystemRegistryGuard.test.ts` |
| `primary-tinted-foreground` | `review-ready` | `default` | `review-ready` | `src/frontend/designSystem/layers/02-token/primary-tinted-foreground/systems/default.mjs#primaryTintedForegroundTokenSpec` | `src/frontend/designSystem/systems/default/tokens/proofs/primaryTintedForeground.tokens.mjs` | `docs/design-system/02-token/shared/primary-tinted-foreground/PrimaryTintedForeground-Contract.md`; `docs/design-system/02-token/systems/default/primary-tinted-foreground/PrimaryTintedForeground-Implementation.md`; `tests/visual/designSystem/tokens/primaryTintedForegroundTokenRoute.spec.ts`; `tests/integration/frontend/designSystemSystemRegistryGuard.test.ts` |
| `tooltip-surface` | `review-ready` | `default` | `review-ready` | `src/frontend/designSystem/layers/02-token/tooltip-surface/systems/default.mjs#tooltipSurfaceTokenSpec` | `src/frontend/designSystem/systems/default/tokens/proofs/tooltipSurface.tokens.mjs` | `docs/design-system/02-token/shared/tooltip-surface/TooltipSurface-Contract.md`; `docs/design-system/02-token/systems/default/tooltip-surface/TooltipSurface-Implementation.md`; `tests/visual/designSystem/tokens/tooltipSurfaceTokenRoute.spec.ts`; `tests/integration/frontend/designSystemSystemRegistryGuard.test.ts` |
| `tooltip-text-style` | `review-ready` | `default` | `review-ready` | `src/frontend/designSystem/layers/02-token/tooltip-text-style/systems/default.mjs#tooltipTextStyleTokenSpec` | `src/frontend/designSystem/systems/default/tokens/proofs/tooltipTextStyle.tokens.mjs` | `docs/design-system/02-token/shared/tooltip-text-style/TooltipTextStyle-Contract.md`; `docs/design-system/02-token/systems/default/tooltip-text-style/TooltipTextStyle-Implementation.md`; `tests/visual/designSystem/tokens/tooltipTextStyleTokenRoute.spec.ts`; `tests/integration/frontend/designSystemSystemRegistryGuard.test.ts` |

## Template Only

These token categories have first-draft token-type templates or broad template
coverage. A template category is not itself consumable by primitives, patterns,
components, demos, canonicals, or app pages until a concrete
TokenDefinitionArtifact and runtime seam exist for the selected design system.

When a concrete token seam appears in the consumable table above, consume that
specific seam only. For example, `label-text-style` is consumable for short
labels, but the broader `text-style` category does not approve body text,
heading text, helper text, error text, or link text.

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
- `font-size`
- `font-weight`
- `gap`
- `letter-spacing`
- `line-height`
- `loading-state`
- `margin`
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
- `text-style`
- `theme`
- `typography-family`
- `warning-state`
- `z-index-layering`

## Update Rule

When a token type moves out of template-only status, update this index in the
same change as the TokenDefinitionArtifact, runtime seam, registry or manifest
wiring, and focused verification evidence.

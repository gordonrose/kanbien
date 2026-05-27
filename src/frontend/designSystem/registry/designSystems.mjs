export const designSystems = {
  default: {
    systemKey: "default",
    label: "Default",
    assetsBase: "/design-system/systems/default/assets",
    tokens: {
      backgroundColor: () => import("../systems/default/tokens/proofs/backgroundColor.tokens.mjs"),
      focusRing: () => import("../systems/default/tokens/proofs/focusRing.tokens.mjs"),
      iconSize: () => import("../systems/default/tokens/proofs/iconSize.tokens.mjs"),
      indexNavItemCurrentIndicator: () => import("../systems/default/tokens/proofs/indexNavItemCurrentIndicator.tokens.mjs"),
      indexNavItemGap: () => import("../systems/default/tokens/proofs/indexNavItemGap.tokens.mjs"),
      indexNavItemPadding: () => import("../systems/default/tokens/proofs/indexNavItemPadding.tokens.mjs"),
      indexNavItemRadius: () => import("../systems/default/tokens/proofs/indexNavItemRadius.tokens.mjs"),
      indexNavItemSurface: () => import("../systems/default/tokens/proofs/indexNavItemSurface.tokens.mjs"),
      indexNavItemSupportingTextStyle: () => import("../systems/default/tokens/proofs/indexNavItemSupportingTextStyle.tokens.mjs"),
      indexNavListGap: () => import("../systems/default/tokens/proofs/indexNavListGap.tokens.mjs"),
      indexNavPanelFrame: () => import("../systems/default/tokens/proofs/indexNavPanelFrame.tokens.mjs"),
      labelTextStyle: () => import("../systems/default/tokens/proofs/labelTextStyle.tokens.mjs"),
      minimumTargetSize: () => import("../systems/default/tokens/proofs/minimumTargetSize.tokens.mjs"),
      primaryColorSource: () => import("../systems/default/tokens/proofs/primaryColorSource.tokens.mjs"),
      primaryTintedBackground: () => import("../systems/default/tokens/proofs/primaryTintedBackground.tokens.mjs"),
      primaryTintedForeground: () => import("../systems/default/tokens/proofs/primaryTintedForeground.tokens.mjs"),
      tooltipSurface: () => import("../systems/default/tokens/proofs/tooltipSurface.tokens.mjs"),
      tooltipTextStyle: () => import("../systems/default/tokens/proofs/tooltipTextStyle.tokens.mjs"),
    },
  },
};

export function getDesignSystem(systemKey = "default") {
  return designSystems[systemKey] ?? null;
}

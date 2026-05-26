export const designSystems = {
  default: {
    systemKey: "default",
    label: "Default",
    assetsBase: "/design-system/systems/default/assets",
    tokens: {
      backgroundColor: () => import("../systems/default/tokens/proofs/backgroundColor.tokens.mjs"),
      focusRing: () => import("../systems/default/tokens/proofs/focusRing.tokens.mjs"),
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

export const designSystems = {
  default: {
    systemKey: "default",
    label: "Default",
    assetsBase: "/design-system/systems/default/assets",
    tokens: {
      backgroundColor: () => import("../systems/default/tokens/proofs/backgroundColor.tokens.mjs"),
    },
  },
};

export function getDesignSystem(systemKey = "default") {
  return designSystems[systemKey] ?? null;
}

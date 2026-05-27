export const indexNavItemSurfaceTokenContract = {
  schema: "kanbien.designSystem.tokenContract.v1",
  contractId: "tokens.index-nav-item-surface",
  tokenType: "surface",
  requiredVariantRoles: [
    "index nav item resting surface",
    "index nav item hover surface",
    "index nav item current surface",
    "index nav item disabled surface",
  ],
  requiredThemes: ["original", "dark", "desert"],
  requiredVariantFields: ["id", "tokenName", "value", "preview", "metadata", "useCaseInstructions"],
  valueFields: [
    "surfaceRole",
    "backgroundValue",
    "borderValue",
    "elevationValue",
    "nestingRule",
    "themeMapping",
  ],
  metadataFields: ["surfaceRole", "theme", "nestingRule", "state", "accessibility"],
  useCaseInstructionFields: ["allowedUse", "forbiddenUse", "nestingRule"],
  consumerRules: [
    "Every design system must expose equivalent index-nav-item surface states before downstream interactive index items consume them.",
    "Design-system implementations may change concrete values, but must preserve roles, themes, states, and color-independent meaning constraints.",
    "Consumers must import the governed runtime seam, not copy item surface, border, hover, current, or disabled values into local CSS.",
  ],
};

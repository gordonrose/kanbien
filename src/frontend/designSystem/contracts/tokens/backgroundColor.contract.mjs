export const backgroundColorTokenContract = {
  schema: "kanbien.designSystem.tokenContract.v1",
  contractId: "tokens.background-color",
  tokenType: "background-color",
  requiredVariantRoles: ["page foundation", "surface foundation", "subtle foundation"],
  requiredThemes: ["default", "dark", "desert"],
  requiredVariantFields: ["id", "tokenName", "value", "preview", "metadata", "useCaseInstructions"],
  valueFields: [
    "backgroundRole",
    "surfaceRelationship",
    "mappedPaletteToken",
    "themeMapping",
    "contrastPairings",
    "stateMapping",
  ],
  metadataFields: ["backgroundRole", "surfaceRelationship", "theme", "state", "accessibility"],
  useCaseInstructionFields: ["allowedUse", "forbiddenUse", "approvedForegrounds"],
  consumerRules: [
    "Every design system must expose the same background color token names before downstream primitives or patterns consume them.",
    "Design-system implementations may change values and appearance, but must preserve variant roles, themes, metadata, and usage constraints.",
    "Consumers must import the system implementation or contract-approved seam, not copy token literals into app CSS.",
  ],
};

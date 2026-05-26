export const primaryColorSourceTokenContract = {
  schema: "kanbien.designSystem.tokenContract.v1",
  contractId: "tokens.primary-color-source",
  tokenType: "primary-color-source",
  tokenTypeTemplate: "color-palette",
  requiredVariantRoles: ["primary color source"],
  requiredThemes: ["original", "dark", "desert"],
  requiredVariantFields: ["id", "tokenName", "value", "preview", "metadata", "useCaseInstructions"],
  valueFields: ["paletteRole", "scaleStep", "colorValue", "colorSpace", "themeMapping", "allowedDerivations"],
  metadataFields: ["paletteRole", "theme", "state", "accessibility"],
  useCaseInstructionFields: ["allowedUse", "forbiddenUse", "literalRule"],
  consumerRules: [
    "Every design system must expose a primary color source before downstream primary color derivations consume it.",
    "Design-system implementations may choose different source values, but must preserve the source role and theme mappings.",
    "Consumers must not treat this source token as contrast, focus, selected, warning, error, success, or validation evidence by itself.",
    "Consumers must import the system implementation or contract-approved seam, not copy primary color literals into app CSS.",
  ],
};

export const iconSizeTokenContract = {
  schema: "kanbien.designSystem.tokenContract.v1",
  contractId: "tokens.icon-size",
  tokenType: "icon-size",
  requiredVariantRoles: ["icon button glyph"],
  requiredThemes: ["all"],
  requiredVariantFields: ["id", "tokenName", "value", "preview", "metadata", "useCaseInstructions"],
  valueFields: ["iconRole", "inlineSize", "blockSize", "viewBox"],
  metadataFields: ["iconRole", "viewBox", "accessibility"],
  useCaseInstructionFields: ["allowedUse", "forbiddenUse", "accessibility"],
  consumerRules: [
    "Every design system must expose a governed icon glyph size before icon-button primitives consume icon dimensions.",
    "Implementations may change the concrete glyph size, but must preserve that icon size is visual glyph size, not touch target size.",
    "Consumers must combine this token with minimum-target-size for interactive icon buttons.",
  ],
};

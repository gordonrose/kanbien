export const spacingScaleTokenContract = {
  schema: "kanbien.designSystem.tokenContract.v1",
  contractId: "tokens.spacing-scale",
  tokenType: "spacing-scale",
  requiredVariantRoles: ["page gutter", "section padding", "content gap", "compact gap"],
  requiredThemes: ["all"],
  requiredVariantFields: ["id", "tokenName", "value", "preview", "metadata", "useCaseInstructions"],
  valueFields: ["spacingRole", "lengthValue", "layoutContext", "responsiveMapping", "densityMapping"],
  metadataFields: ["spacingRole", "layoutContext", "theme", "accessibility"],
  useCaseInstructionFields: ["allowedUse", "forbiddenUse", "densityRule"],
  consumerRules: [
    "Consumers must use this token for governed spacing instead of local gap, padding, or margin literals.",
    "This token does not define component anatomy, item counts, or product workflow spacing.",
    "Spacing must not be used to solve text overflow or target-size requirements.",
  ],
};

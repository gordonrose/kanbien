export const indexNavItemPaddingTokenContract = {
  schema: "kanbien.designSystem.tokenContract.v1",
  contractId: "tokens.index-nav-item-padding",
  tokenType: "padding",
  requiredVariantRoles: ["index nav item block padding", "index nav item inline padding"],
  requiredThemes: ["all"],
  requiredVariantFields: ["id", "tokenName", "value", "preview", "metadata", "useCaseInstructions"],
  valueFields: ["paddingRole", "axis", "lengthValue", "densityMapping", "directionBehavior", "targetSizeImpact"],
  metadataFields: ["paddingRole", "axis", "directionBehavior", "accessibility"],
  useCaseInstructionFields: ["allowedUse", "forbiddenUse", "targetSizeImpact"],
  consumerRules: [
    "Every design system must expose governed index-nav-item padding before rectangular item controls consume internal spacing.",
    "Inline padding must remain logical so RTL does not need a separate local override.",
    "Consumers must combine this token with minimum-target-size for interactive controls.",
  ],
};

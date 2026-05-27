export const indexNavItemCurrentIndicatorTokenContract = {
  schema: "kanbien.designSystem.tokenContract.v1",
  contractId: "tokens.index-nav-item-current-indicator",
  tokenType: "state-indicator",
  requiredVariantRoles: ["index nav item current indicator"],
  requiredThemes: ["all"],
  requiredVariantFields: ["id", "tokenName", "value", "preview", "metadata", "useCaseInstructions"],
  valueFields: ["indicatorRole", "inlineSize", "minBlockSize", "blockSizeBehavior", "radiusValue", "placement", "colorSource"],
  metadataFields: ["indicatorRole", "placement", "blockSizeBehavior", "colorSource", "accessibility"],
  useCaseInstructionFields: ["allowedUse", "forbiddenUse", "semanticOwner"],
  consumerRules: [
    "Every design system must expose a governed current indicator before index item primitives render a non-color current marker.",
    "Implementations may change the concrete indicator, but must preserve the role as a current-state visual affordance.",
    "Consumers must import the governed runtime seam instead of inventing bars, dots, icons, badges, or underlines locally.",
  ],
};

export const indexNavItemGapTokenContract = {
  schema: "kanbien.designSystem.tokenContract.v1",
  contractId: "tokens.index-nav-item-gap",
  tokenType: "gap",
  requiredVariantRoles: ["index nav item content gap"],
  requiredThemes: ["all"],
  requiredVariantFields: ["id", "tokenName", "value", "preview", "metadata", "useCaseInstructions"],
  valueFields: ["gapRole", "lengthValue", "layoutContext", "responsiveMapping", "densityMapping", "wrapBehavior"],
  metadataFields: ["gapRole", "layoutContext", "wrapBehavior", "accessibility"],
  useCaseInstructionFields: ["allowedUse", "forbiddenUse", "wrapBehavior"],
  consumerRules: [
    "Every design system must expose a governed index-nav-item content gap before multi-row item controls consume row spacing.",
    "Implementations may change the concrete gap, but must preserve the role as internal item content spacing.",
    "Consumers must import the governed runtime seam instead of hard-coding local row-gap values.",
  ],
};

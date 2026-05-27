export const indexNavListGapTokenContract = {
  schema: "kanbien.designSystem.tokenContract.v1",
  contractId: "tokens.index-nav-list-gap",
  tokenType: "gap",
  requiredVariantRoles: ["index nav list item gap"],
  requiredThemes: ["all"],
  requiredVariantFields: ["id", "tokenName", "value", "preview", "metadata", "useCaseInstructions"],
  valueFields: ["gapRole", "lengthValue", "layoutContext", "responsiveMapping", "densityMapping", "wrapBehavior"],
  metadataFields: ["gapRole", "layoutContext", "wrapBehavior", "accessibility"],
  useCaseInstructionFields: ["allowedUse", "forbiddenUse", "wrapBehavior"],
  consumerRules: [
    "Every design system must expose a governed index-nav-list gap before list patterns space index items.",
    "Implementations may change the concrete value, but must preserve the role as spacing between items, not inside one item.",
    "Consumers must import the governed runtime seam instead of hard-coding local list row gaps.",
  ],
};

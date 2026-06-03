export const contentWidthTokenContract = {
  schema: "kanbien.designSystem.tokenContract.v1",
  contractId: "tokens.content-width",
  tokenType: "content-width",
  requiredVariantRoles: ["content measure", "text measure", "media minimum"],
  requiredThemes: ["all"],
  requiredVariantFields: ["id", "tokenName", "value", "preview", "metadata", "useCaseInstructions"],
  valueFields: [
    "widthRole",
    "inlineSizeValue",
    "layoutContext",
    "responsiveMapping",
    "overflowRule",
  ],
  metadataFields: ["widthRole", "layoutContext", "theme", "accessibility"],
  useCaseInstructionFields: ["allowedUse", "forbiddenUse", "overflowRule"],
  consumerRules: [
    "Consumers must use this token for governed content measures instead of local max-width literals.",
    "This token does not define grid anatomy, breakpoint behavior, or component structure.",
    "Overflow behavior remains owned by the consuming primitive or pattern.",
  ],
};

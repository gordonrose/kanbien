export const panelCornerRadiusTokenContract = {
  schema: "kanbien.designSystem.tokenContract.v1",
  contractId: "tokens.panel-corner-radius",
  tokenType: "border-radius",
  requiredVariantRoles: ["flush panel corner radius"],
  requiredThemes: ["all"],
  requiredVariantFields: ["id", "tokenName", "value", "preview", "metadata", "useCaseInstructions"],
  valueFields: ["radiusRole", "radiusValue", "cornerScope", "compositionPurpose", "forbiddenUse"],
  metadataFields: ["radiusRole", "cornerScope", "accessibility"],
  useCaseInstructionFields: ["allowedUse", "forbiddenUse"],
  consumerRules: [
    "Every design system must expose a governed flush panel radius before panel containers consume corner styling.",
    "Implementations may change the concrete radius, but must preserve the flush-panel role unless a behavior rule changes.",
    "Consumers must import the governed runtime seam instead of hard-coding panel border-radius values.",
  ],
};

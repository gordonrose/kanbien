export const indexNavItemRadiusTokenContract = {
  schema: "kanbien.designSystem.tokenContract.v1",
  contractId: "tokens.index-nav-item-radius",
  tokenType: "border-radius",
  requiredVariantRoles: ["index nav item corner radius"],
  requiredThemes: ["all"],
  requiredVariantFields: ["id", "tokenName", "value", "preview", "metadata", "useCaseInstructions"],
  valueFields: ["radiusRole", "radiusValue", "cornerScope", "sizeMapping", "surfaceRelationship", "forbiddenUse"],
  metadataFields: ["radiusRole", "cornerScope", "accessibility"],
  useCaseInstructionFields: ["allowedUse", "forbiddenUse"],
  consumerRules: [
    "Every design system must expose a governed index-nav-item radius before rectangular index items consume corner styling.",
    "Implementations may change the concrete radius, but must preserve the single item-corner role unless the behavior rule changes.",
    "Consumers must import the governed runtime seam instead of hard-coding border-radius values.",
  ],
};

export const minimumTargetSizeTokenContract = {
  schema: "kanbien.designSystem.tokenContract.v1",
  contractId: "tokens.minimum-target-size",
  tokenType: "minimum-target-size",
  requiredVariantRoles: ["interactive target", "adjacent target spacing"],
  requiredThemes: ["all"],
  requiredVariantFields: ["id", "tokenName", "value", "preview", "metadata", "useCaseInstructions"],
  valueFields: [
    "inputModality",
    "minimumWidth",
    "minimumHeight",
    "exceptionRule",
    "spacingRelationship",
    "proofRequirement",
  ],
  metadataFields: ["inputModality", "minimumWidth", "minimumHeight", "exceptionRule", "accessibility"],
  useCaseInstructionFields: ["allowedUse", "forbiddenUse", "exceptionRule"],
  consumerRules: [
    "Every design system must expose a minimum interactive target before dense interactive primitives consume compact sizing.",
    "Design-system implementations may change measurements, but must preserve operable hit areas and governed exception rules.",
    "Consumers must import the system implementation or contract-approved seam, not copy target-size literals into app CSS.",
  ],
};

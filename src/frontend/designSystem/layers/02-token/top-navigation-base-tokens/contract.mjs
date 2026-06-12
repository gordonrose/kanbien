export const topNavigationBaseTokensContract = {
  schema: "kanbien.designSystem.tokenContract.v1",
  contractId: "tokens.top-navigation-base-tokens",
  tokenType: "top-navigation-base-tokens",
  status: "blocked",
  requiredVariantRoles: ["top navigation 41-token inventory"],
  requiredVariantFields: ["id", "tokenName", "value", "preview", "metadata", "useCaseInstructions"],
  valueFields: [
    "mapped41TokenSeams",
    "missing41TokenSeams",
    "retired40VariableGroups",
    "localOnlyDecisions",
  ],
  metadataFields: ["role", "theme", "state", "accessibility"],
  useCaseInstructionFields: ["allowedUse", "forbiddenUse", "proofRequirement"],
  consumerRules: [
    "This slice is blocked and is not consumable by top-navigation primitives or patterns.",
    "Later top-navigation layers may consume only concrete 41 token seams, not old CSS variables such as --surface-1, --ink, --line, --accent, --shadow, or --radius.",
    "Consume top-navigation-frame for text, border, elevation, current-state, and shell-radius frame roles before top-navigation primitive or pattern work claims token readiness.",
  ],
};

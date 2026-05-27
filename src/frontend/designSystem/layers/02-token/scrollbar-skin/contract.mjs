export const scrollbarSkinTokenContract = {
  schema: "kanbien.designSystem.tokenContract.v1",
  contractId: "tokens.scrollbar-skin",
  tokenType: "scrollbar-skin",
  uiFamily: "shared-scroll",
  status: "review-ready",
  contractPath: "docs/design-system/02-token/shared/scrollbar-skin/ScrollbarSkin-Contract.md",
  requiredFields: [
    "scrollbarWidthValue",
    "scrollbarThumbValue",
    "scrollbarTrackValue",
    "scrollbarRadiusValue",
    "sourceTokenName",
    "formulaOrMapping",
  ],
  allowedConsumers: ["03-primitive", "04-pattern-contract"],
  consumerRules: [
    "Use this token for governed internal scrollbar styling.",
    "Do not set custom scrollbar colors or thickness locally in patterns, components, templates, or app pages.",
    "Browser-native fallback is allowed only when custom scrollbar styling is unsupported.",
  ],
};

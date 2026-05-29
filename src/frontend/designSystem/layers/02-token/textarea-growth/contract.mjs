export const textareaGrowthTokenContract = {
  schema: "kanbien.designSystem.tokenContract.v1",
  contractId: "tokens.textarea-growth",
  tokenType: "textarea-growth",
  requiredVariantRoles: ["one-line textarea growth", "multi-line textarea growth", "paragraph textarea growth"],
  requiredValueFields: [
    "growthRole",
    "initialRows",
    "maxViewportBlockRatio",
    "maxBlockSizeValue",
    "resizeBehavior",
    "growthBehavior",
  ],
  consumerRules: [
    "Every design system must expose governed textarea growth values before textarea primitives own row counts, growth caps, or resize posture.",
    "Consumers must use the runtime seam instead of local textarea rows, max-height percentages, or resize behavior.",
    "This token does not define value typography, input frame styling, label/helper structure, validation, persistence, or form submission.",
  ],
};

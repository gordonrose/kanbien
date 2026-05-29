export const textControlFrameTokenContract = {
  schema: "kanbien.designSystem.tokenContract.v1",
  contractId: "tokens.text-control-frame",
  tokenType: "text-control-frame",
  requiredVariantRoles: ["text control frame"],
  requiredValueFields: [
    "frameRole",
    "backgroundValue",
    "foregroundValue",
    "borderValue",
    "radiusValue",
    "paddingBlockValue",
    "paddingInlineValue",
    "minBlockSize",
    "maxInlineSize",
  ],
  consumerRules: [
    "Every design system must expose governed text-control frame values before text-entry primitives own input surface, border, padding, radius, or minimum height.",
    "Consumers must use the runtime seam instead of local text-control surface, border, padding, radius, or minimum-height literals.",
    "This token does not define value typography, focus ring behavior, field labels, helper text, validation color, textarea auto-growth, parsing, persistence, or form submission.",
  ],
};

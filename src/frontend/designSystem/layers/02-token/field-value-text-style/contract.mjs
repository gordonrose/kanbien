export const fieldValueTextStyleTokenContract = {
  schema: "kanbien.designSystem.tokenContract.v1",
  contractId: "tokens.field-value-text-style",
  tokenType: "field-value-text-style",
  requiredVariantRoles: ["field value text"],
  requiredValueFields: [
    "textStyleRole",
    "fontFamilyValue",
    "fontFallbackRule",
    "fontSizeValue",
    "fontWeightValue",
    "lineHeightValue",
    "letterSpacingValue",
    "textTransform",
    "overflowReadiness",
    "zoomBehavior",
  ],
  consumerRules: [
    "Every design system must expose governed field-value typography before text-entry primitives render values.",
    "Consumers must use the runtime seam instead of local input font-family, font-size, font-weight, line-height, or letter-spacing literals.",
    "This token does not define label text, helper text, validation color, input frame geometry, placeholder behavior, parsing, persistence, or submission.",
  ],
};

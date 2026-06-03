export const fieldContainerFrameTokenContract = {
  schema: "kanbien.designSystem.tokenContract.v1",
  contractId: "tokens.field-container-frame",
  tokenType: "field-container-frame",
  requiredVariantRoles: ["field container frame"],
  requiredValueFields: [
    "frameRole",
    "backgroundValue",
    "foregroundValue",
    "borderValue",
    "radiusValue",
    "paddingBlockValue",
    "paddingInlineValue",
    "minBlockSize",
    "minInlineSize",
    "maxInlineSize",
  ],
  consumerRules: [
    "Every design system must expose governed field-container frame values before reusable form-field containers own surface, padding, border, radius, or sizing.",
    "Consumers must use the runtime seam instead of local field-container surface, padding, border, radius, or width literals.",
    "This token does not approve label semantics, native input styling, selector behavior, validation behavior, product data, component seams, or app adoption.",
  ],
};

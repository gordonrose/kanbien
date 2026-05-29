export const fieldRowFrameTokenContract = {
  schema: "kanbien.designSystem.tokenContract.v1",
  contractId: "tokens.field-row-frame",
  tokenType: "field-row-frame",
  requiredVariantRoles: ["field row frame"],
  requiredValueFields: [
    "frameRole",
    "rowGapValue",
    "labelToControlGapValue",
    "controlToMessageGapValue",
    "controlSlotMinBlockSize",
    "controlSlotBorderValue",
    "minInlineSize",
    "maxInlineSize",
    "readableOrder",
  ],
  consumerRules: [
    "Every design system must expose governed field-row frame values before reusable field primitives own label, control-slot, helper, or error spacing.",
    "Consumers must use the runtime seam instead of local field-row spacing, control-slot minimum size, or width literals.",
    "This token does not approve native input styling, textarea sizing, selector behavior, radio state, toggle behavior, validation semantics, product copy, form submission, or app adoption.",
  ],
};
